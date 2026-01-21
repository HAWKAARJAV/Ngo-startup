import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidUUID, sanitizeString } from "@/lib/security";

// GET: Get tranche details
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const trancheId = searchParams.get('trancheId');

        if (trancheId) {
            // Validate UUID
            if (!isValidUUID(trancheId)) {
                return NextResponse.json({ error: "Invalid trancheId format" }, { status: 400 });
            }
            
            const tranche = await prisma.tranche.findUnique({
                where: { id: trancheId },
                include: {
                    project: {
                        include: { ngo: true }
                    }
                }
            });
            
            if (!tranche) {
                return NextResponse.json({ error: "Tranche not found" }, { status: 404 });
            }
            
            return NextResponse.json({ tranche });
        }

        if (projectId) {
            // Validate UUID
            if (!isValidUUID(projectId)) {
                return NextResponse.json({ error: "Invalid projectId format" }, { status: 400 });
            }
            
            const tranches = await prisma.tranche.findMany({
                where: { projectId },
                orderBy: { status: 'asc' }
            });
            return NextResponse.json({ tranches });
        }

        return NextResponse.json({ error: "projectId or trancheId required" }, { status: 400 });
    } catch (error) {
        console.error("[Tranches API] Error fetching tranches:", error);
        return NextResponse.json({ error: "Failed to fetch tranches" }, { status: 500 });
    }
}

// POST: Request tranche release (NGO action)
export async function POST(request) {
    try {
        const body = await request.json();
        const { trancheId, proofDocUrl, geoTag, ngoUserId } = body;

        if (!trancheId) {
            return NextResponse.json({ error: "Tranche ID required" }, { status: 400 });
        }

        // Validate UUID
        if (!isValidUUID(trancheId)) {
            return NextResponse.json({ error: "Invalid trancheId format" }, { status: 400 });
        }

        const tranche = await prisma.tranche.findUnique({
            where: { id: trancheId },
            include: {
                project: {
                    include: { ngo: { include: { user: true } } }
                }
            }
        });

        if (!tranche) {
            return NextResponse.json({ error: "Tranche not found" }, { status: 404 });
        }

        // Prevent double release
        if (tranche.status === 'RELEASED' || tranche.status === 'DISBURSED') {
            return NextResponse.json({ error: "Tranche already released" }, { status: 400 });
        }

        // Prevent release if already requested
        if (tranche.releaseRequested) {
            return NextResponse.json({ error: "Release already requested, pending approval" }, { status: 400 });
        }

        // Sanitize URLs if provided
        const sanitizedProofUrl = proofDocUrl ? sanitizeString(proofDocUrl, 2000) : tranche.proofDocUrl;
        const sanitizedGeoTag = geoTag ? sanitizeString(geoTag, 100) : tranche.geoTag;

        // Update tranche with release request
        const updatedTranche = await prisma.tranche.update({
            where: { id: trancheId },
            data: {
                releaseRequested: true,
                proofDocUrl: sanitizedProofUrl,
                geoTag: sanitizedGeoTag
            }
        });

        // Get corporate for notification
        const corporate = await prisma.corporate.findFirst({
            include: { user: true }
        });

        if (corporate) {
            // Create notification for Corporate
            await prisma.notification.create({
                data: {
                    userId: corporate.userId,
                    userRole: 'CORPORATE',
                    type: 'TRANCHE_REQUEST',
                    title: 'Tranche Release Request',
                    message: `${tranche.project.ngo.orgName} has requested release of ₹${tranche.amount.toLocaleString()} for "${tranche.project.title}"`,
                    link: `/dashboard/projects/${tranche.projectId}`,
                    metadata: JSON.stringify({ 
                        trancheId, 
                        projectId: tranche.projectId,
                        amount: tranche.amount 
                    })
                }
            });

            // Create audit log
            await prisma.complianceLog.create({
                data: {
                    ngoId: tranche.project.ngoId,
                    docType: 'TRANCHE_REQUEST',
                    action: 'REQUEST_RELEASE',
                    actorId: ngoUserId || tranche.project.ngo.userId,
                    metadata: JSON.stringify({
                        trancheId,
                        amount: tranche.amount,
                        condition: tranche.unlockCondition
                    })
                }
            });
        }

        return NextResponse.json({ 
            success: true, 
            tranche: updatedTranche,
            message: "Release request submitted. Pending corporate approval." 
        });

    } catch (error) {
        console.error("[Tranches API] Error requesting tranche release:", error);
        return NextResponse.json({ error: "Failed to submit release request" }, { status: 500 });
    }
}

// PATCH: Approve/Reject tranche release (Corporate action)
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { trancheId, action, reviewedBy, remarks, corporateUserId } = body;

        if (!trancheId || !action) {
            return NextResponse.json({ error: "trancheId and action required" }, { status: 400 });
        }

        // Validate UUID
        if (!isValidUUID(trancheId)) {
            return NextResponse.json({ error: "Invalid trancheId format" }, { status: 400 });
        }

        // Whitelist allowed actions
        if (!['APPROVE', 'REJECT', 'BLOCK'].includes(action)) {
            return NextResponse.json({ error: "Invalid action. Use APPROVE, REJECT, or BLOCK" }, { status: 400 });
        }

        const tranche = await prisma.tranche.findUnique({
            where: { id: trancheId },
            include: {
                project: {
                    include: { ngo: { include: { user: true } } }
                }
            }
        });

        if (!tranche) {
            return NextResponse.json({ error: "Tranche not found" }, { status: 404 });
        }

        // Prevent approving already released tranche
        if (action === 'APPROVE' && (tranche.status === 'RELEASED' || tranche.status === 'DISBURSED')) {
            return NextResponse.json({ error: "Tranche already released" }, { status: 400 });
        }

        // Sanitize remarks
        const sanitizedRemarks = remarks ? sanitizeString(remarks, 1000) : null;

        let updateData = {};
        let notificationType = '';
        let notificationTitle = '';
        let notificationMessage = '';

        if (action === 'APPROVE') {
            updateData = {
                status: 'RELEASED',
                releaseRequested: false,
                reviewedBy: reviewedBy || corporateUserId,
                isBlocked: false,
                blockReason: null
            };
            notificationType = 'TRANCHE_APPROVED';
            notificationTitle = 'Tranche Released! 🎉';
            notificationMessage = `₹${tranche.amount.toLocaleString()} has been approved for "${tranche.project.title}". Funds will be disbursed shortly.`;

            // Update project raised amount
            await prisma.project.update({
                where: { id: tranche.projectId },
                data: {
                    raisedAmount: {
                        increment: tranche.amount
                    }
                }
            });
        } else if (action === 'REJECT') {
            updateData = {
                status: 'LOCKED',
                releaseRequested: false,
                isBlocked: true,
                blockReason: sanitizedRemarks || 'Additional documentation required'
            };
            notificationType = 'TRANCHE_REJECTED';
            notificationTitle = 'Tranche Release Rejected';
            notificationMessage = `Your release request for ₹${tranche.amount.toLocaleString()} was rejected. Reason: ${sanitizedRemarks || 'Please upload required documentation.'}`;
        } else if (action === 'BLOCK') {
            updateData = {
                isBlocked: true,
                blockReason: sanitizedRemarks || 'Compliance issue detected'
            };
            notificationType = 'TRANCHE_BLOCKED';
            notificationTitle = 'Tranche Blocked';
            notificationMessage = `Tranche of ₹${tranche.amount.toLocaleString()} has been blocked. Reason: ${sanitizedRemarks || 'Compliance verification required.'}`;
        }

        const updatedTranche = await prisma.tranche.update({
            where: { id: trancheId },
            data: updateData
        });

        // Create notification for NGO
        await prisma.notification.create({
            data: {
                userId: tranche.project.ngo.userId,
                userRole: 'NGO',
                type: notificationType,
                title: notificationTitle,
                message: notificationMessage,
                link: `/ngo-portal/projects`,
                metadata: JSON.stringify({ 
                    trancheId, 
                    projectId: tranche.projectId,
                    action,
                    remarks: sanitizedRemarks 
                })
            }
        });

        // Create audit log
        await prisma.complianceLog.create({
            data: {
                ngoId: tranche.project.ngoId,
                docType: 'TRANCHE_REVIEW',
                action: action,
                actorId: corporateUserId || 'CORPORATE',
                metadata: JSON.stringify({
                    trancheId,
                    amount: tranche.amount,
                    remarks: sanitizedRemarks,
                    previousStatus: tranche.status,
                    newStatus: updateData.status || tranche.status
                })
            }
        });

        return NextResponse.json({ 
            success: true, 
            tranche: updatedTranche,
            message: `Tranche ${action.toLowerCase()}ed successfully` 
        });

    } catch (error) {
        console.error("[Tranches API] Error processing tranche:", error);
        return NextResponse.json({ error: "Failed to process tranche" }, { status: 500 });
    }
}
