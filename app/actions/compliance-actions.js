'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// NGO Compliance Documents (12A, 80G, FCRA, etc.)
export async function uploadNGOComplianceDocument(formData) {
    const ngoId = formData.get("ngoId")
    const docType = formData.get("docType") // '12A', '80G', 'FCRA', etc.
    const file = formData.get("file")

    if (!ngoId || !docType || !file) {
        return { error: "Missing required fields" }
    }

    try {
        // In a real app, upload to cloud storage
        const mockFileUrl = `https://storage.example.com/compliance/${file.name}`
        
        // Create or update compliance document
        await prisma.complianceDoc.create({
            data: {
                ngoId: ngoId,
                docType: docType,
                url: mockFileUrl,
                status: "PENDING" // Will be reviewed by admin/corporate
            }
        })

        // Create audit log
        await prisma.complianceLog.create({
            data: {
                ngoId: ngoId,
                docType: docType,
                action: "UPLOAD",
                actorId: ngoId, // In real app, get from session
                metadata: JSON.stringify({ 
                    fileName: file.name,
                    fileSize: file.size,
                    uploadedAt: new Date().toISOString()
                })
            }
        })

        // Update NGO compliance status if it's a certificate
        if (docType === '12A' || docType === '80G') {
            const updateData = {}
            const validityDate = new Date()
            validityDate.setFullYear(validityDate.getFullYear() + 5) // Valid for 5 years

            if (docType === '12A') {
                updateData.validity12A = validityDate
            } else if (docType === '80G') {
                updateData.validity80G = validityDate
            }

            await prisma.nGO.update({
                where: { id: ngoId },
                data: {
                    ...updateData,
                    lastComplianceCheck: new Date()
                }
            })
        }

        revalidatePath('/ngo-portal/compliance')
        
        return { success: true, message: `${docType} document uploaded successfully! Pending verification.` }
    } catch (error) {
        console.error("Upload error:", error)
        return { error: "Failed to upload document" }
    }
}

export async function getNGOComplianceDocuments(ngoId) {
    if (!ngoId) return []
    
    try {
        const documents = await prisma.complianceDoc.findMany({
            where: { ngoId },
            orderBy: { id: 'desc' }
        })
        
        return documents
    } catch (error) {
        console.error("Fetch error:", error)
        return []
    }
}

// Project Compliance Documents (existing functions)
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

// Upload compliance document with file to Supabase Storage
export async function uploadComplianceDocWithFile(formData) {
    try {
        const projectId = formData.get('projectId');
        const category = formData.get('category');
        const docName = formData.get('docName');
        const file = formData.get('file');

        console.log("uploadComplianceDocWithFile called:", { projectId, category, docName, fileName: file?.name });

        if (!projectId || !category || !docName || !file) {
            return { success: false, error: "Missing required fields" };
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            return { success: false, error: "File size exceeds 2MB limit" };
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp'
        ];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: "Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed" };
        }

        // Get project and NGO details for tracking
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                ngo: {
                    include: { user: true }
                }
            }
        });

        if (!project) {
            return { success: false, error: "Project not found" };
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${project.ngo.orgName}_${project.title}_${category}_${docName}_${Date.now()}.${fileExt}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ngo documents')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return { success: false, error: "Failed to upload file to storage" };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('ngo documents')
            .getPublicUrl(fileName);

        console.log("File uploaded to Supabase:", publicUrl);

        // Upsert compliance document
        const existingDoc = await prisma.projectComplianceDoc.findFirst({
            where: { projectId, category, docName }
        });

        if (existingDoc) {
            await prisma.projectComplianceDoc.update({
                where: { id: existingDoc.id },
                data: {
                    url: publicUrl,
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
                    url: publicUrl,
                    status: 'SUBMITTED'
                }
            });
        }

        // Track upload in DocumentUpload table
        await prisma.documentUpload.create({
            data: {
                ngoId: project.ngoId,
                ngoName: project.ngo.orgName,
                projectId: projectId,
                projectName: project.title,
                documentType: `${category}_${docName}`,
                fileName: file.name,
                fileUrl: publicUrl,
                uploadedBy: project.ngo.userId,
                status: "SUBMITTED"
            }
        });

        // Also update any matching DocumentRequest (if corporate requested this doc)
        const matchingRequest = await prisma.documentRequest.findFirst({
            where: {
                ngoId: project.ngoId,
                docName: docName,
                status: 'PENDING'
            }
        });

        if (matchingRequest) {
            await prisma.documentRequest.update({
                where: { id: matchingRequest.id },
                data: {
                    status: 'UPLOADED',
                    fileUrl: publicUrl,
                    uploadedAt: new Date()
                }
            });

            // Notify the corporate that document was uploaded
            const corporate = await prisma.corporate.findUnique({
                where: { id: matchingRequest.corporateId },
                include: { user: true }
            });

            if (corporate) {
                await prisma.notification.create({
                    data: {
                        userId: corporate.userId,
                        userRole: 'CORPORATE',
                        type: 'DOCUMENT_UPLOADED',
                        title: '📄 Document Uploaded',
                        message: `${project.ngo.orgName} has uploaded: ${docName}`,
                        link: `/dashboard/projects/${projectId}`,
                        metadata: JSON.stringify({
                            requestId: matchingRequest.id,
                            ngoId: project.ngoId,
                            ngoName: project.ngo.orgName,
                            docName,
                            fileUrl: publicUrl
                        })
                    }
                });
            }
        }

        revalidatePath(`/dashboard/projects/${projectId}`);
        console.log("Upload successful!");
        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Error uploading document:", error);
        return { success: false, error: error.message || "Upload failed" };
    }
}

// Keep old function for backward compatibility
export async function uploadComplianceDoc(projectId, category, docName, fileUrl) {
    console.log("uploadComplianceDoc called with:", { projectId, category, docName, fileUrl });
    
    try {
        // Get project and NGO details for tracking
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                ngo: {
                    include: { user: true }
                }
            }
        });

        if (!project) {
            console.error("Project not found:", projectId);
            return { success: false, error: "Project not found" };
        }

        console.log("Project found:", project.title);

        // Upsert logic: if exists for this project + docName, update it. Else create.
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
            console.log("Updated existing doc:", existingDoc.id);
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
            console.log("Created new compliance doc");
        }

        // Track upload in DocumentUpload table
        const trackingRecord = await prisma.documentUpload.create({
            data: {
                ngoId: project.ngoId,
                ngoName: project.ngo.orgName,
                projectId: projectId,
                projectName: project.title,
                documentType: `${category}_${docName}`,
                fileName: docName,
                fileUrl: fileUrl,
                uploadedBy: project.ngo.userId,
                status: "SUBMITTED"
            }
        });
        console.log("Created tracking record:", trackingRecord.id);

        revalidatePath(`/dashboard/projects/${projectId}`);
        console.log("Upload successful!");
        return { success: true };
    } catch (error) {
        console.error("Error uploading document:", error);
        return { success: false, error: error.message || "Upload failed" };
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
