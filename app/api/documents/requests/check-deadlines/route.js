import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Check for overdue document requests and send warning notifications
 * This endpoint can be called periodically (e.g., via cron job) or manually
 */

export async function GET(request) {
  try {
    const now = new Date();
    
    // Find all pending document requests with passed deadlines that haven't been warned
    const overdueRequests = await prisma.documentRequest.findMany({
      where: {
        status: 'PENDING',
        deadline: {
          lt: now
        },
        deadlineWarned: false
      }
    });

    if (overdueRequests.length === 0) {
      return NextResponse.json({ 
        message: 'No overdue requests found',
        warned: 0
      });
    }

    const warnings = [];

    for (const req of overdueRequests) {
      // Get corporate and NGO details
      const [corporate, ngo] = await Promise.all([
        prisma.corporate.findUnique({
          where: { id: req.corporateId },
          select: { companyName: true }
        }),
        prisma.nGO.findUnique({
          where: { id: req.ngoId },
          include: { user: true }
        })
      ]);

      if (!ngo || !corporate) continue;

      const deadlineDate = new Date(req.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      // Create warning notification for NGO
      await prisma.notification.create({
        data: {
          userId: ngo.userId,
          userRole: 'NGO',
          type: 'DEADLINE_WARNING',
          title: '⚠️ Document Deadline Missed!',
          message: `The deadline for "${req.docName}" requested by ${corporate.companyName} has passed (was due: ${deadlineDate}). Please upload immediately to avoid compliance issues.`,
          link: '/ngo-portal/compliance',
          metadata: JSON.stringify({
            requestId: req.id,
            corporateId: req.corporateId,
            corporateName: corporate.companyName,
            docName: req.docName,
            deadline: req.deadline,
            type: 'DEADLINE_WARNING'
          })
        }
      });

      // Mark the request as warned
      await prisma.documentRequest.update({
        where: { id: req.id },
        data: { deadlineWarned: true }
      });

      warnings.push({
        requestId: req.id,
        ngoId: req.ngoId,
        ngoName: ngo.orgName,
        docName: req.docName,
        deadline: req.deadline
      });
    }

    return NextResponse.json({
      message: `Sent ${warnings.length} deadline warning(s)`,
      warned: warnings.length,
      details: warnings
    });

  } catch (error) {
    console.error('Error checking document deadlines:', error);
    return NextResponse.json(
      { error: 'Failed to check deadlines' },
      { status: 500 }
    );
  }
}

/**
 * POST: Manually trigger warning for a specific request
 */
export async function POST(request) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const docRequest = await prisma.documentRequest.findUnique({
      where: { id: requestId }
    });

    if (!docRequest) {
      return NextResponse.json(
        { error: 'Document request not found' },
        { status: 404 }
      );
    }

    if (docRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Request is not pending' },
        { status: 400 }
      );
    }

    // Get corporate and NGO details
    const [corporate, ngo] = await Promise.all([
      prisma.corporate.findUnique({
        where: { id: docRequest.corporateId },
        select: { companyName: true }
      }),
      prisma.nGO.findUnique({
        where: { id: docRequest.ngoId },
        include: { user: true }
      })
    ]);

    if (!ngo || !corporate) {
      return NextResponse.json(
        { error: 'NGO or Corporate not found' },
        { status: 404 }
      );
    }

    const deadlineText = docRequest.deadline 
      ? ` (Deadline: ${new Date(docRequest.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})`
      : '';

    // Create reminder notification for NGO
    await prisma.notification.create({
      data: {
        userId: ngo.userId,
        userRole: 'NGO',
        type: 'DOCUMENT_REMINDER',
        title: '📋 Document Reminder',
        message: `Reminder: ${corporate.companyName} is waiting for "${docRequest.docName}"${deadlineText}. Please upload as soon as possible.`,
        link: '/ngo-portal/compliance',
        metadata: JSON.stringify({
          requestId: docRequest.id,
          corporateId: docRequest.corporateId,
          corporateName: corporate.companyName,
          docName: docRequest.docName,
          deadline: docRequest.deadline,
          type: 'DOCUMENT_REMINDER'
        })
      }
    });

    return NextResponse.json({
      message: 'Reminder sent successfully',
      requestId: requestId
    });

  } catch (error) {
    console.error('Error sending document reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
