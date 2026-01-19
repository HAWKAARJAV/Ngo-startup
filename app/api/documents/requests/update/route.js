import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * PATCH: Update document request status (upload, verify, reject)
 */

export async function PATCH(request) {
  try {
    const { requestId, status, fileUrl, remarks } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'requestId and status are required' },
        { status: 400 }
      );
    }

    const updateData = { status, remarks };
    
    if (status === 'UPLOADED' && fileUrl) {
      updateData.fileUrl = fileUrl;
      updateData.uploadedAt = new Date();
    }

    // Update request
    const updatedRequest = await prisma.documentRequest.update({
      where: { id: requestId },
      data: updateData
    });

    // If document was uploaded, notify corporate
    if (status === 'UPLOADED') {
      const [corporate, ngo] = await Promise.all([
        prisma.corporate.findUnique({
          where: { id: updatedRequest.corporateId },
          include: { user: true }
        }),
        prisma.nGO.findUnique({
          where: { id: updatedRequest.ngoId },
          select: { orgName: true }
        })
      ]);

      await prisma.notification.create({
        data: {
          userId: corporate.userId,
          userRole: 'CORPORATE',
          type: 'DOCUMENT_UPLOADED',
          title: 'Document Uploaded',
          message: `${ngo.orgName} has uploaded: ${updatedRequest.docName}`,
          link: `/dashboard/ngo/${updatedRequest.ngoId}`,
          metadata: JSON.stringify({
            requestId,
            ngoId: updatedRequest.ngoId,
            docName: updatedRequest.docName,
            fileUrl
          })
        }
      });
    }

    return NextResponse.json({ request: updatedRequest });

  } catch (error) {
    console.error('Error updating document request:', error);
    return NextResponse.json(
      { error: 'Failed to update document request' },
      { status: 500 }
    );
  }
}
