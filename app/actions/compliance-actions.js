'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjectComplianceDocs(projectId) {
    try {
        const docs = await prisma.projectComplianceDoc.findMany({
            where: { projectId },
            orderBy: { lastUpdated: 'desc' } // or whatever order makes sense
        });
        return { success: true, data: docs };
    } catch (error) {
        console.error("Error fetching compliance docs:", error);
        return { success: false, error: "Failed to fetch documents" };
    }
}

export async function uploadComplianceDoc(projectId, category, docName, fileUrl) {
    try {
        // Upsert logic: if exists for this project + docName, update it. Else create.
        // We use docName + projectId as a quasi-unique key for upserting content if we wanted, 
        // but Prisma upsert requires a unique constraint. 
        // For simplicity, we'll check if it exists first or use findFirst.

        const existingDoc = await prisma.projectComplianceDoc.findFirst({
            where: {
                projectId,
                category,
                docName
            }
        });

        if (existingDoc) {
            await prisma.projectComplianceDoc.update({
                where: { id: existingDoc.id },
                data: {
                    url: fileUrl,
                    status: 'SUBMITTED',
                    lastUpdated: new Date()
                }
            });
        } else {
            await prisma.projectComplianceDoc.create({
                data: {
                    projectId,
                    category,
                    docName,
                    url: fileUrl,
                    status: 'SUBMITTED'
                }
            });
        }

        revalidatePath(`/dashboard/projects/${projectId}`);
        return { success: true };
    } catch (error) {
        console.error("Error uploading document:", error);
        return { success: false, error: "Upload failed" };
    }
}

export async function verifyComplianceDoc(docId, status, userId, remarks = "") {
    try {
        await prisma.projectComplianceDoc.update({
            where: { id: docId },
            data: {
                status,
                verifiedBy: userId,
                remarks
            }
        });

        // We need to know project ID to revalidate
        const doc = await prisma.projectComplianceDoc.findUnique({
            where: { id: docId },
            select: { projectId: true }
        });

        if (doc) {
            revalidatePath(`/dashboard/projects/${doc.projectId}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Error verifying document:", error);
        return { success: false, error: "Verification failed" };
    }
}
