import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Fetch single project by ID
 * PATCH: Update project details
 * DELETE: Delete a project
 */

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        ngo: {
          select: {
            id: true,
            orgName: true,
            city: true,
            state: true,
            trustScore: true
          }
        },
        tranches: {
          orderBy: { status: 'asc' }
        },
        donations: {
          include: {
            corporate: {
              select: {
                companyName: true
              }
            }
          }
        },
        complianceDocs: true
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { title, description, targetAmount, location, sector, status } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(targetAmount && { targetAmount: parseFloat(targetAmount) }),
        ...(location && { location }),
        ...(sector && { sector }),
        ...(status && { status })
      },
      include: {
        ngo: true,
        tranches: true
      }
    });

    return NextResponse.json({ project });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Delete related records first
    await prisma.projectComplianceDoc.deleteMany({
      where: { projectId: id }
    });

    await prisma.tranche.deleteMany({
      where: { projectId: id }
    });

    await prisma.donation.deleteMany({
      where: { projectId: id }
    });

    // Delete the project
    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Project deleted' });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
