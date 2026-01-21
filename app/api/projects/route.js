import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidUUID, sanitizeString, isPositiveNumber } from "@/lib/security";

// GET: Fetch projects (with optional filters)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const corporateId = searchParams.get('corporateId');
        const ngoId = searchParams.get('ngoId');
        const status = searchParams.get('status');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Cap at 100

        const where = {};
        
        // Validate UUID format before querying
        if (ngoId) {
            if (!isValidUUID(ngoId)) {
                return NextResponse.json({ error: "Invalid ngoId format" }, { status: 400 });
            }
            where.ngoId = ngoId;
        }
        if (status) {
            // Whitelist allowed statuses
            const allowedStatuses = ['ACTIVE', 'COMPLETED', 'PENDING', 'SUSPENDED', 'Fundraising', 'Active'];
            if (!allowedStatuses.includes(status)) {
                return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
            }
            where.status = status;
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                ngo: {
                    include: { user: true }
                },
                tranches: true,
                complianceDocs: true,
                donations: true
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("[Projects API] Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

// POST: Create a new project with tranches
export async function POST(request) {
    try {
        const body = await request.json();
        const { 
            ngoId, 
            title, 
            description, 
            targetAmount, 
            location, 
            sector, 
            tranches = [],
            corporateId // Will be used when proper auth is implemented
        } = body;

        // ===== INPUT VALIDATION =====
        if (!ngoId || !title || !targetAmount) {
            return NextResponse.json(
                { error: "Missing required fields: ngoId, title, targetAmount" },
                { status: 400 }
            );
        }

        // Validate UUID
        if (!isValidUUID(ngoId)) {
            return NextResponse.json(
                { error: "Invalid ngoId format" },
                { status: 400 }
            );
        }

        // Validate targetAmount is positive
        if (!isPositiveNumber(targetAmount) || parseFloat(targetAmount) <= 0) {
            return NextResponse.json(
                { error: "targetAmount must be a positive number" },
                { status: 400 }
            );
        }

        // Sanitize string inputs
        const sanitizedTitle = sanitizeString(title, 200);
        const sanitizedDescription = sanitizeString(description || '', 2000);
        const sanitizedLocation = sanitizeString(location || '', 200);
        const sanitizedSector = sanitizeString(sector || 'General', 100);

        // Verify NGO exists before creating project
        const ngoExists = await prisma.nGO.findUnique({ where: { id: ngoId } });
        if (!ngoExists) {
            return NextResponse.json(
                { error: "NGO not found" },
                { status: 404 }
            );
        }

        const parsedTargetAmount = parseFloat(targetAmount);

        // Create project with tranches
        const project = await prisma.project.create({
            data: {
                ngoId,
                title: sanitizedTitle,
                description: sanitizedDescription,
                targetAmount: parsedTargetAmount,
                raisedAmount: 0,
                location: sanitizedLocation,
                sector: sanitizedSector,
                status: 'ACTIVE',
                tranches: {
                    create: tranches.length > 0 
                        ? tranches.map((t, index) => ({
                            amount: parseFloat(t.amount) || (parsedTargetAmount * (t.percentage || 33) / 100),
                            unlockCondition: sanitizeString(t.condition || `Milestone ${index + 1}`, 500),
                            status: index === 0 ? 'PENDING' : 'LOCKED',
                            releaseRequested: false
                        }))
                        : [
                            { amount: parsedTargetAmount * 0.3, unlockCondition: 'Project Kickoff', status: 'PENDING' },
                            { amount: parsedTargetAmount * 0.4, unlockCondition: 'Mid-Term Assessment', status: 'LOCKED' },
                            { amount: parsedTargetAmount * 0.3, unlockCondition: 'Final Delivery', status: 'LOCKED' }
                        ]
                }
            },
            include: {
                ngo: true,
                tranches: true
            }
        });

        // Get corporate user for notification
        const corporate = await prisma.corporate.findFirst({
            include: { user: true }
        });

        // Create notification for NGO
        const ngo = await prisma.nGO.findUnique({
            where: { id: ngoId },
            include: { user: true }
        });

        if (ngo) {
            await prisma.notification.create({
                data: {
                    userId: ngo.userId,
                    userRole: 'NGO',
                    type: 'PROJECT_CREATED',
                    title: 'New Project Assigned',
                    message: `You have been selected for project "${sanitizedTitle}" with a budget of ₹${parsedTargetAmount.toLocaleString()}`,
                    link: `/ngo-portal/projects`,
                    metadata: JSON.stringify({ projectId: project.id })
                }
            });

            // Create chat room between corporate and NGO
            if (corporate) {
                const existingRoom = await prisma.chatRoom.findFirst({
                    where: {
                        corporateId: corporate.id,
                        ngoId: ngoId
                    }
                });

                if (!existingRoom) {
                    await prisma.chatRoom.create({
                        data: {
                            corporateId: corporate.id,
                            ngoId: ngoId,
                            messages: {
                                create: {
                                    senderId: 'SYSTEM',
                                    senderRole: 'SYSTEM',
                                    senderName: 'System',
                                    message: `Project "${sanitizedTitle}" has been created. You can now communicate about project details and milestones.`,
                                    messageType: 'SYSTEM'
                                }
                            }
                        }
                    });
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            project,
            message: "Project created successfully" 
        });

    } catch (error) {
        console.error("[Projects API] Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project", details: process.env.NODE_ENV !== 'production' ? error.message : undefined },
            { status: 500 }
        );
    }
}

// PATCH: Update project status
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { projectId, status, updates } = body;

        if (!projectId) {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            );
        }

        // Validate UUID
        if (!isValidUUID(projectId)) {
            return NextResponse.json(
                { error: "Invalid projectId format" },
                { status: 400 }
            );
        }

        // Validate status if provided
        if (status) {
            const allowedStatuses = ['ACTIVE', 'COMPLETED', 'PENDING', 'SUSPENDED', 'Fundraising', 'Active'];
            if (!allowedStatuses.includes(status)) {
                return NextResponse.json(
                    { error: "Invalid status value" },
                    { status: 400 }
                );
            }
        }

        // Verify project exists
        const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
        if (!existingProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // Sanitize updates if provided
        const sanitizedUpdates = {};
        if (updates) {
            if (updates.title) sanitizedUpdates.title = sanitizeString(updates.title, 200);
            if (updates.description) sanitizedUpdates.description = sanitizeString(updates.description, 2000);
            if (updates.location) sanitizedUpdates.location = sanitizeString(updates.location, 200);
            if (updates.sector) sanitizedUpdates.sector = sanitizeString(updates.sector, 100);
            if (updates.targetAmount && isPositiveNumber(updates.targetAmount)) {
                sanitizedUpdates.targetAmount = parseFloat(updates.targetAmount);
            }
        }

        const project = await prisma.project.update({
            where: { id: projectId },
            data: {
                ...(status && { status }),
                ...sanitizedUpdates
            },
            include: {
                ngo: true,
                tranches: true
            }
        });

        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error("[Projects API] Error updating project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}
