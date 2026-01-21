import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Fetch single corporate by ID with full details
 * PATCH: Update corporate details
 */

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const corporate = await prisma.corporate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        },
        donations: {
          include: {
            project: {
              include: {
                ngo: {
                  select: {
                    orgName: true
                  }
                }
              }
            }
          }
        },
        opportunities: true,
        chatRooms: {
          include: {
            ngo: {
              select: {
                orgName: true
              }
            }
          }
        }
      }
    });

    if (!corporate) {
      return NextResponse.json(
        { error: 'Corporate not found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalDonated = corporate.donations.reduce((sum, d) => sum + d.amount, 0);
    const projectsFunded = new Set(corporate.donations.map(d => d.projectId)).size;
    const ngoPartnerships = new Set(corporate.chatRooms.map(r => r.ngoId)).size;

    return NextResponse.json({ 
      corporate,
      stats: {
        totalDonated,
        projectsFunded,
        ngoPartnerships,
        csrBudget: corporate.csrBudget,
        budgetUtilization: (totalDonated / corporate.csrBudget) * 100
      }
    });

  } catch (error) {
    console.error('Error fetching corporate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch corporate' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { 
      companyName, 
      industry, 
      csrBudget,
      mandateAreas,
      systemStatus
    } = body;

    const corporate = await prisma.corporate.update({
      where: { id },
      data: {
        ...(companyName && { companyName }),
        ...(industry && { industry }),
        ...(csrBudget && { csrBudget: parseFloat(csrBudget) }),
        ...(mandateAreas && { mandateAreas }),
        ...(systemStatus && { systemStatus })
      }
    });

    return NextResponse.json({ corporate });

  } catch (error) {
    console.error('Error updating corporate:', error);
    return NextResponse.json(
      { error: 'Failed to update corporate' },
      { status: 500 }
    );
  }
}
