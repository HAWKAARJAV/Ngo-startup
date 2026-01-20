import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST: Create or update an NGO document record
 * GET: Fetch documents for an NGO
 */

export async function POST(request) {
    try {
        const { ngoId, docType, fileUrl, status = 'PENDING_VERIFICATION' } = await request.json();

        if (!ngoId || !docType || !fileUrl) {
            return NextResponse.json(
                { error: 'ngoId, docType, and fileUrl are required' },
                { status: 400 }
            );
        }

        // Check if document already exists
        const existingDoc = await prisma.document.findFirst({
            where: { ngoId, docType }
        });

        let document;
        if (existingDoc) {
            // Update existing document
            document = await prisma.document.update({
                where: { id: existingDoc.id },
                data: {
                    url: fileUrl,
                    status,
                    uploadedAt: new Date()
                }
            });
        } else {
            // Create new document record
            document = await prisma.document.create({
                data: {
                    ngoId,
                    docType,
                    url: fileUrl,
                    status,
                    uploadedAt: new Date()
                }
            });
        }

        // Create audit log entry
        const ngo = await prisma.nGO.findUnique({
            where: { id: ngoId },
            select: { userId: true, orgName: true }
        });

        if (ngo) {
            await prisma.auditLog.create({
                data: {
                    userId: ngo.userId,
                    entityType: 'DOCUMENT',
                    entityId: document.id,
                    action: existingDoc ? 'UPDATE' : 'CREATE',
                    changes: JSON.stringify({
                        docType,
                        fileUrl,
                        status,
                        ngoName: ngo.orgName
                    }),
                    ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
                }
            });
        }

        return NextResponse.json({ document, message: 'Document uploaded successfully' });

    } catch (error) {
        console.error('Error updating NGO document:', error);
        return NextResponse.json(
            { error: 'Failed to update document record' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const ngoId = searchParams.get('ngoId');

        if (!ngoId) {
            return NextResponse.json(
                { error: 'ngoId is required' },
                { status: 400 }
            );
        }

        const documents = await prisma.document.findMany({
            where: { ngoId },
            orderBy: { uploadedAt: 'desc' }
        });

        return NextResponse.json({ documents });

    } catch (error) {
        console.error('Error fetching NGO documents:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        );
    }
}
