import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isValidUUID, sanitizeString, isPositiveNumber } from '@/lib/security';

/**
 * GET: Fetch single project by ID
 * PATCH: Update project details
 * DELETE: Delete a project (SOFT DELETE recommended)
 */

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Validate UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

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
    console.error('[Projects API] Error fetching project:', error);
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

    // Validate UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Verify project exists
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const { title, description, targetAmount, location, sector, status } = body;

    // Build update data with validation
    const updateData = {};
    
    if (title) updateData.title = sanitizeString(title, 200);
    if (description !== undefined) updateData.description = sanitizeString(description, 2000);
    if (location) updateData.location = sanitizeString(location, 200);
    if (sector) updateData.sector = sanitizeString(sector, 100);
    
    if (targetAmount !== undefined) {
      if (!isPositiveNumber(targetAmount)) {
        return NextResponse.json(
          { error: 'targetAmount must be a positive number' },
          { status: 400 }
        );
      }
      updateData.targetAmount = parseFloat(targetAmount);
    }
    
    if (status) {
      const allowedStatuses = ['ACTIVE', 'COMPLETED', 'PENDING', 'SUSPENDED', 'Fundraising', 'Active'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        ngo: true,
        tranches: true
      }
    });

    return NextResponse.json({ project });

  } catch (error) {
    console.error('[Projects API] Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Soft delete a project
 * CAUTION: This is a destructive operation
 * TODO: Implement soft delete (status = 'DELETED') instead of hard delete
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Validate UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // ===== PRODUCTION SAFETY GUARD =====
    // Require explicit confirmation header for destructive operations
    const confirmDelete = request.headers.get('x-confirm-delete');
    if (confirmDelete !== 'true') {
      return NextResponse.json(
        { error: 'Delete requires confirmation. Set x-confirm-delete: true header' },
        { status: 400 }
      );
    }

    // Verify project exists
    const existingProject = await prisma.project.findUnique({ 
      where: { id },
      include: { donations: true, tranches: true }
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Prevent deletion if project has active donations
    const hasDisbursedFunds = existingProject.tranches?.some(
      t => t.status === 'RELEASED' || t.status === 'DISBURSED'
    );
    
    if (hasDisbursedFunds) {
      return NextResponse.json(
        { error: 'Cannot delete project with disbursed funds. Consider archiving instead.' },
        { status: 400 }
      );
    }

    // Use transaction for safety
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.projectComplianceDoc.deleteMany({
        where: { projectId: id }
      });

      await tx.tranche.deleteMany({
        where: { projectId: id }
      });

      await tx.donation.deleteMany({
        where: { projectId: id }
      });

      // Delete the project
      await tx.project.delete({
        where: { id }
      });
    });

    console.log(`[Projects API] Project ${id} deleted by user`);
    
    return NextResponse.json({ success: true, message: 'Project deleted' });

  } catch (error) {
    console.error('[Projects API] Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
