import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isValidUUID, sanitizeString } from '@/lib/security';

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
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    const whereClause = {};
    
    // Validate UUIDs if provided
    if (ngoId) {
      if (!isValidUUID(ngoId)) {
        return NextResponse.json({ error: 'Invalid ngoId format' }, { status: 400 });
      }
      whereClause.ngoId = ngoId;
    }
    if (corporateId) {
      if (!isValidUUID(corporateId)) {
        return NextResponse.json({ error: 'Invalid corporateId format' }, { status: 400 });
      }
      whereClause.corporateId = corporateId;
    }
    if (status) {
      // Whitelist allowed statuses
      const allowedStatuses = ['PENDING', 'UPLOADED', 'VERIFIED', 'REJECTED'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      whereClause.status = status;
    }

    const requests = await prisma.documentRequest.findMany({
      where: whereClause,
      orderBy: { requestedAt: 'desc' },
      take: limit
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
    console.error('[Documents API] Error fetching document requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document requests' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('[Documents API] Document request body received:', body);
    
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

    // ===== INPUT VALIDATION =====
    if (!corporateId || !ngoId || !requestType || !docName) {
      console.log('[Documents API] Missing fields:', { corporateId: !!corporateId, ngoId: !!ngoId, requestType: !!requestType, docName: !!docName });
      return NextResponse.json(
        { error: 'Missing required fields: corporateId, ngoId, requestType, docName' },
        { status: 400 }
      );
    }

    // Validate UUIDs
    if (!isValidUUID(corporateId)) {
      return NextResponse.json({ error: 'Invalid corporateId format' }, { status: 400 });
    }
    if (!isValidUUID(ngoId)) {
      return NextResponse.json({ error: 'Invalid ngoId format' }, { status: 400 });
    }
    if (projectId && !isValidUUID(projectId)) {
      return NextResponse.json({ error: 'Invalid projectId format' }, { status: 400 });
    }

    // Whitelist allowed request types
    const allowedTypes = ['COMPLIANCE_DOC', 'UTILIZATION_CERTIFICATE', 'IMPACT_REPORT', 'TRANCHE_EVIDENCE', 'OTHER'];
    if (!allowedTypes.includes(requestType)) {
      return NextResponse.json({ error: 'Invalid requestType' }, { status: 400 });
    }

    // Whitelist allowed priorities
    const allowedPriorities = ['HIGH', 'MEDIUM', 'LOW'];
    const validPriority = allowedPriorities.includes(priority) ? priority : 'MEDIUM';

    // Sanitize string inputs
    const sanitizedDocName = sanitizeString(docName, 200);
    const sanitizedDescription = description ? sanitizeString(description, 1000) : null;

    // Parse and validate deadline
    let deadlineDate = null;
    if (deadline) {
      const parsedDate = new Date(deadline);
      // Ensure deadline is in the future
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: 'Invalid deadline format' }, { status: 400 });
      }
      if (parsedDate < new Date()) {
        return NextResponse.json({ error: 'Deadline must be in the future' }, { status: 400 });
      }
      deadlineDate = parsedDate;
    }

    // Verify corporate and NGO exist
    const [corporate, ngo] = await Promise.all([
      prisma.corporate.findUnique({ where: { id: corporateId }, include: { user: true } }),
      prisma.nGO.findUnique({ where: { id: ngoId }, include: { user: true } })
    ]);

    if (!corporate) {
      return NextResponse.json({ error: 'Corporate not found' }, { status: 404 });
    }
    if (!ngo) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 404 });
    }

    // Create document request
    const docRequest = await prisma.documentRequest.create({
      data: {
        corporateId,
        ngoId,
        projectId: projectId || null,
        requestType,
        docName: sanitizedDocName,
        description: sanitizedDescription,
        priority: validPriority,
        status: 'PENDING',
        deadline: deadlineDate
      }
    });

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
        message: `${corporate.companyName} has requested: ${sanitizedDocName}${deadlineText}`,
        link: `/ngo-portal/compliance`,
        metadata: JSON.stringify({
          requestId: docRequest.id,
          corporateId,
          corporateName: corporate.companyName,
          docName: sanitizedDocName,
          priority: validPriority,
          deadline: deadline
        })
      }
    });

    return NextResponse.json({ 
      request: docRequest,
      notification: 'NGO notified via real-time channel'
    });

  } catch (error) {
    console.error('[Documents API] Error creating document request:', error);
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    );
  }
}
