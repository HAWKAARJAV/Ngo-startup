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
          select: { orgName: true, userId: true }
        })
      ]);

      // Create notification for corporate
      await prisma.notification.create({
        data: {
          userId: corporate.userId,
          userRole: 'CORPORATE',
          type: 'DOCUMENT_UPLOADED',
          title: '📄 Document Uploaded',
          message: `${ngo.orgName} has uploaded the requested document: ${updatedRequest.docName}`,
          link: `/dashboard/chat`,
          metadata: JSON.stringify({
            requestId,
            ngoId: updatedRequest.ngoId,
            ngoName: ngo.orgName,
            docName: updatedRequest.docName,
            fileUrl,
            uploadedAt: new Date().toISOString()
          })
        }
      });

      // Return with data for real-time notification
      return NextResponse.json({ 
        request: updatedRequest,
        notification: {
          corporateUserId: corporate.userId,
          ngoName: ngo.orgName,
          docName: updatedRequest.docName,
          fileUrl
        }
      });
    }

    // If document was verified by corporate
    if (status === 'VERIFIED') {
      const ngo = await prisma.nGO.findUnique({
        where: { id: updatedRequest.ngoId },
        select: { userId: true, orgName: true }
      });

      const corporate = await prisma.corporate.findUnique({
        where: { id: updatedRequest.corporateId },
        select: { companyName: true }
      });

      // Notify NGO that document was verified
      await prisma.notification.create({
        data: {
          userId: ngo.userId,
          userRole: 'NGO',
          type: 'DOCUMENT_VERIFIED',
          title: '✅ Document Verified',
          message: `${corporate.companyName} has verified your document: ${updatedRequest.docName}`,
          link: `/ngo-portal/compliance`,
          metadata: JSON.stringify({
            requestId,
            docName: updatedRequest.docName
          })
        }
      });
    }

    // If document was rejected by corporate
    if (status === 'REJECTED') {
      const ngo = await prisma.nGO.findUnique({
        where: { id: updatedRequest.ngoId },
        select: { userId: true }
      });

      const corporate = await prisma.corporate.findUnique({
        where: { id: updatedRequest.corporateId },
        select: { companyName: true }
      });

      // Notify NGO that document was rejected
      await prisma.notification.create({
        data: {
          userId: ngo.userId,
          userRole: 'NGO',
          type: 'DOCUMENT_REJECTED',
          title: '⚠️ Document Rejected',
          message: `${corporate.companyName} has rejected your document: ${updatedRequest.docName}. ${remarks ? `Reason: ${remarks}` : 'Please re-upload with corrections.'}`,
          link: `/ngo-portal/compliance`,
          metadata: JSON.stringify({
            requestId,
            docName: updatedRequest.docName,
            remarks
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
