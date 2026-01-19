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
          ngo
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
    const { 
      corporateId, 
      ngoId, 
      projectId, 
      requestType, 
      docName, 
      description, 
      priority = 'MEDIUM' 
    } = await request.json();

    if (!corporateId || !ngoId || !requestType || !docName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create document request
    const docRequest = await prisma.documentRequest.create({
      data: {
        corporateId,
        ngoId,
        projectId,
        requestType,
        docName,
        description,
        priority,
        status: 'PENDING'
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

    // Create notification for NGO
    await prisma.notification.create({
      data: {
        userId: ngo.userId,
        userRole: 'NGO',
        type: 'DOCUMENT_REQUEST',
        title: 'New Document Request',
        message: `${corporate.companyName} has requested: ${docName}`,
        link: `/ngo-portal/compliance`,
        metadata: JSON.stringify({
          requestId: docRequest.id,
          corporateId,
          corporateName: corporate.companyName,
          docName,
          priority
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
      { error: 'Failed to create document request' },
      { status: 500 }
    );
  }
}
