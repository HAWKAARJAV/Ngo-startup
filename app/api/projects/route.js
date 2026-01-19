import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch projects (with optional filters)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const corporateId = searchParams.get('corporateId');
        const ngoId = searchParams.get('ngoId');
        const status = searchParams.get('status');

        const where = {};
        if (ngoId) where.ngoId = ngoId;
        if (status) where.status = status;

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
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
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

        if (!ngoId || !title || !targetAmount) {
            return NextResponse.json(
                { error: "Missing required fields: ngoId, title, targetAmount" },
                { status: 400 }
            );
        }

        // Create project with tranches
        const project = await prisma.project.create({
            data: {
                ngoId,
                title,
                description: description || '',
                targetAmount: parseFloat(targetAmount),
                raisedAmount: 0,
                location: location || '',
                sector: sector || 'General',
                status: 'ACTIVE',
                tranches: {
                    create: tranches.length > 0 
                        ? tranches.map((t, index) => ({
                            amount: parseFloat(t.amount) || (targetAmount * (t.percentage || 33) / 100),
                            unlockCondition: t.condition || `Milestone ${index + 1}`,
                            status: index === 0 ? 'PENDING' : 'LOCKED',
                            releaseRequested: false
                        }))
                        : [
                            { amount: targetAmount * 0.3, unlockCondition: 'Project Kickoff', status: 'PENDING' },
                            { amount: targetAmount * 0.4, unlockCondition: 'Mid-Term Assessment', status: 'LOCKED' },
                            { amount: targetAmount * 0.3, unlockCondition: 'Final Delivery', status: 'LOCKED' }
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
                    message: `You have been selected for project "${title}" with a budget of ₹${targetAmount.toLocaleString()}`,
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
                                    message: `Project "${title}" has been created. You can now communicate about project details and milestones.`,
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
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project", details: error.message },
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

        const project = await prisma.project.update({
            where: { id: projectId },
            data: {
                ...(status && { status }),
                ...updates
            },
            include: {
                ngo: true,
                tranches: true
            }
        });

        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}
