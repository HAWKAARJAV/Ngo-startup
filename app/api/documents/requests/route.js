import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Fetch document requests
 * POST: Create a new document request from Corporate to NGO
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ngoId = searchParams.get('ngoId');
    const corporateId = searchParams.get('corporateId');
    const status = searchParams.get('status');

    const whereClause = {};
    
    if (ngoId) whereClause.ngoId = ngoId;
    if (corporateId) whereClause.corporateId = corporateId;
    if (status) whereClause.status = status;

    const requests = await prisma.documentRequest.findMany({
      where: whereClause,
      orderBy: { requestedAt: 'desc' }
    });

    // Enrich with related data
    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        const [corporate, ngo] = await Promise.all([
          prisma.corporate.findUnique({
            where: { id: req.corporateId },
            select: { companyName: true, industry: true }
          }),
          prisma.nGO.findUnique({
            where: { id: req.ngoId },
            select: { orgName: true, city: true }
          })
        ]);

        return {
          ...req,
          corporate,
          ngo,
          corporateName: corporate?.companyName || 'Unknown Corporate',
          ngoName: ngo?.orgName || 'Unknown NGO'
        };
      })
    );

    return NextResponse.json({ requests: enrichedRequests });

  } catch (error) {
    console.error('Error fetching document requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document requests' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Document request body received:', body);
    
    const { 
      corporateId, 
      ngoId, 
      projectId, 
      requestType, 
      docName, 
      description, 
      priority = 'MEDIUM',
      deadline = null
    } = body;

    console.log('Parsed values:', { corporateId, ngoId, projectId, requestType, docName, priority, deadline });

    if (!corporateId || !ngoId || !requestType || !docName) {
      console.log('Missing fields:', { corporateId: !!corporateId, ngoId: !!ngoId, requestType: !!requestType, docName: !!docName });
      return NextResponse.json(
        { error: 'Missing required fields', details: `corporateId: ${corporateId}, ngoId: ${ngoId}, requestType: ${requestType}, docName: ${docName}` },
        { status: 400 }
      );
    }

    // Parse deadline if provided
    const deadlineDate = deadline ? new Date(deadline) : null;

    // Create document request
    const docRequest = await prisma.documentRequest.create({
      data: {
        corporateId,
        ngoId,
        projectId: projectId || null,
        requestType,
        docName,
        description: description || null,
        priority,
        status: 'PENDING',
        deadline: deadlineDate
      }
    });

    // Get details for notification
    const [corporate, ngo] = await Promise.all([
      prisma.corporate.findUnique({
        where: { id: corporateId },
        include: { user: true }
      }),
      prisma.nGO.findUnique({
        where: { id: ngoId },
        include: { user: true }
      })
    ]);

    if (!corporate || !ngo) {
      // Document created but notification skipped due to missing data
      return NextResponse.json({ 
        request: docRequest,
        warning: 'Document request created but notification could not be sent - missing corporate or NGO data'
      });
    }

    // Format deadline for notification
    const deadlineText = deadlineDate 
      ? ` (Deadline: ${deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})`
      : '';

    // Create notification for NGO
    await prisma.notification.create({
      data: {
        userId: ngo.userId,
        userRole: 'NGO',
        type: 'DOCUMENT_REQUEST',
        title: 'New Document Request',
        message: `${corporate.companyName} has requested: ${docName}${deadlineText}`,
        link: `/ngo-portal/compliance`,
        metadata: JSON.stringify({
          requestId: docRequest.id,
          corporateId,
          corporateName: corporate.companyName,
          docName,
          priority,
          deadline: deadline
        })
      }
    });

    return NextResponse.json({ 
      request: docRequest,
      notification: 'NGO notified via real-time channel'
    });

  } catch (error) {
    console.error('Error creating document request:', error);
    return NextResponse.json(
      { error: 'Failed to create document request', details: error.message },
      { status: 500 }
    );
  }
}
