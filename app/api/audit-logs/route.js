import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Fetch compliance audit logs for a project, NGO, or corporate
 * POST: Create a new audit log entry
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const ngoId = searchParams.get('ngoId');
    const docType = searchParams.get('docType');
    const limit = parseInt(searchParams.get('limit') || '100');

    const whereClause = {};
    
    if (projectId) whereClause.projectId = projectId;
    if (ngoId) whereClause.ngoId = ngoId;
    if (docType) whereClause.docType = docType;

    const logs = await prisma.complianceLog.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        ngo: {
          select: { orgName: true }
        }
      }
    });

    // Enrich logs with actor details
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        let actorName = 'System';
        
        // Try to find actor in users table
        if (log.actorId) {
          const user = await prisma.user.findUnique({
            where: { id: log.actorId },
            select: { name: true, email: true }
          });
          if (user) {
            actorName = user.name || user.email || 'Unknown User';
          }
        }

        // Parse metadata if it's a JSON string
        let parsedMetadata = {};
        if (log.metadata) {
          try {
            parsedMetadata = JSON.parse(log.metadata);
          } catch (e) {
            parsedMetadata = { raw: log.metadata };
          }
        }

        return {
          ...log,
          actorName,
          parsedMetadata
        };
      })
    );

    return NextResponse.json({ logs: enrichedLogs });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { 
      ngoId, 
      projectId,
      docType, 
      action, 
      actorId, 
      metadata 
    } = await request.json();

    if (!ngoId || !action || !actorId) {
      return NextResponse.json(
        { error: 'Missing required fields (ngoId, action, actorId)' },
        { status: 400 }
      );
    }

    const log = await prisma.complianceLog.create({
      data: {
        ngoId,
        projectId,
        docType: docType || 'GENERAL',
        action,
        actorId,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });

    return NextResponse.json({ log });

  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
