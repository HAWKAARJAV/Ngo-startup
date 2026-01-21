import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Get session user
const getSessionUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
        try {
            return JSON.parse(token);
        } catch (e) {
            console.error('Error parsing session token:', e);
        }
    }
    return null;
};

// POST: Create a new project (NGO action)
export async function POST(request) {
    try {
        const session = await getSessionUser();
        
        if (!session) {
            return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
        }

        // Get NGO profile
        const ngo = await prisma.nGO.findUnique({
            where: { userId: session.id },
            include: { user: true }
        });

        if (!ngo) {
            return NextResponse.json({ error: "NGO profile not found" }, { status: 404 });
        }

        const body = await request.json();
        const { title, description, targetAmount, location, sector, duration, tranches = [] } = body;

        // Validation
        if (!title || !description || !targetAmount || !location || !sector) {
            return NextResponse.json(
                { error: "Missing required fields: title, description, targetAmount, location, sector" },
                { status: 400 }
            );
        }

        // Create project with tranches
        const project = await prisma.project.create({
            data: {
                ngoId: ngo.id,
                title,
                description,
                targetAmount: parseFloat(targetAmount),
                raisedAmount: 0,
                location,
                sector,
                status: 'ACTIVE',
                tranches: {
                    create: tranches.length > 0
                        ? tranches.map((t, index) => ({
                            amount: (parseFloat(targetAmount) * t.percentage) / 100,
                            unlockCondition: t.condition,
                            status: index === 0 ? 'PENDING' : 'LOCKED',
                            releaseRequested: false,
                            isBlocked: false
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

        // Notify all corporate users about new project
        const corporates = await prisma.corporate.findMany({
            include: { user: true }
        });

        // Create notifications for all corporates
        for (const corporate of corporates) {
            await prisma.notification.create({
                data: {
                    userId: corporate.userId,
                    userRole: 'CORPORATE',
                    type: 'PROJECT_CREATED',
                    title: '🆕 New Project Available',
                    message: `${ngo.orgName} has submitted a new project: "${title}" seeking ₹${targetAmount.toLocaleString()} in ${sector} sector.`,
                    link: `/dashboard/projects/${project.id}`,
                    metadata: JSON.stringify({ 
                        projectId: project.id,
                        ngoId: ngo.id,
                        ngoName: ngo.orgName,
                        sector,
                        amount: targetAmount,
                        isNew: true
                    })
                }
            });
        }

        // Create notification for NGO (confirmation)
        await prisma.notification.create({
            data: {
                userId: ngo.userId,
                userRole: 'NGO',
                type: 'PROJECT_CREATED',
                title: 'Project Submitted Successfully',
                message: `Your project "${title}" has been submitted and is now visible to corporate partners.`,
                link: `/ngo-portal/projects/${project.id}`,
                metadata: JSON.stringify({ projectId: project.id })
            }
        });

        // Create audit log
        await prisma.complianceLog.create({
            data: {
                ngoId: ngo.id,
                docType: 'PROJECT',
                action: 'CREATE',
                actorId: session.id,
                metadata: JSON.stringify({
                    projectId: project.id,
                    title,
                    targetAmount,
                    sector,
                    tranchesCount: tranches.length
                })
            }
        });

        return NextResponse.json({
            success: true,
            project,
            message: "Project created successfully and notifications sent to corporate partners."
        });

    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project", details: error.message },
            { status: 500 }
        );
    }
}
