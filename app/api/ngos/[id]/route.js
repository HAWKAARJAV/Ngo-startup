import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Fetch single NGO by ID with full details
 * PATCH: Update NGO details
 */

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const ngo = await prisma.nGO.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        },
        projects: {
          include: {
            tranches: true,
            donations: true
          }
        },
        complianceDocs: true,
        complianceLogs: {
          orderBy: { timestamp: 'desc' },
          take: 20
        }
      }
    });

    if (!ngo) {
      return NextResponse.json(
        { error: 'NGO not found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalProjects = ngo.projects.length;
    const activeProjects = ngo.projects.filter(p => p.status === 'ACTIVE').length;
    const totalFundsReceived = ngo.projects.reduce((sum, p) => sum + p.raisedAmount, 0);
    const totalFundsTarget = ngo.projects.reduce((sum, p) => sum + p.targetAmount, 0);

    return NextResponse.json({ 
      ngo,
      stats: {
        totalProjects,
        activeProjects,
        totalFundsReceived,
        totalFundsTarget,
        trustScore: ngo.trustScore
      }
    });

  } catch (error) {
    console.error('Error fetching NGO:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NGO' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { 
      orgName, 
      city, 
      state, 
      regNumber, 
      focusAreas,
      panNumber,
      validity12A,
      validity80G
    } = body;

    const ngo = await prisma.nGO.update({
      where: { id },
      data: {
        ...(orgName && { orgName }),
        ...(city && { city }),
        ...(state && { state }),
        ...(regNumber && { regNumber }),
        ...(focusAreas && { focusAreas }),
        ...(panNumber && { panNumber }),
        ...(validity12A && { validity12A: new Date(validity12A) }),
        ...(validity80G && { validity80G: new Date(validity80G) })
      }
    });

    return NextResponse.json({ ngo });

  } catch (error) {
    console.error('Error updating NGO:', error);
    return NextResponse.json(
      { error: 'Failed to update NGO' },
      { status: 500 }
    );
  }
}
