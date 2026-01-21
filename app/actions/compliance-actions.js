'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('[Compliance] Supabase credentials not configured');
}

const supabase = supabaseUrl && supabaseKey 
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// ===== VALIDATION HELPERS =====
const isValidUUID = (id) => {
    if (typeof id !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const sanitizeString = (str, maxLength = 1000) => {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, maxLength).replace(/[<>]/g, '');
};

// Allowed file types for uploads
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// NGO Compliance Documents (12A, 80G, FCRA, etc.)
export async function uploadNGOComplianceDocument(formData) {
    const ngoId = formData.get("ngoId")
    const docType = formData.get("docType") // '12A', '80G', 'FCRA', etc.
    const file = formData.get("file")

    // ===== INPUT VALIDATION =====
    if (!ngoId || !docType || !file) {
        return { error: "Missing required fields: ngoId, docType, file" }
    }

    if (!isValidUUID(ngoId)) {
        return { error: "Invalid ngoId format" }
    }

    // Whitelist allowed document types
    const allowedDocTypes = ['12A', '80G', 'FCRA', 'PAN', 'AUDIT_REPORT', 'REGISTRATION', 'CSR1', 'OTHER'];
    if (!allowedDocTypes.includes(docType)) {
        return { error: "Invalid document type" }
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
        return { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` }
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { error: "Invalid file type. Allowed: PDF, JPEG, PNG, GIF, WebP" }
    }

    try {
        // Verify NGO exists
        const ngo = await prisma.nGO.findUnique({ where: { id: ngoId } });
        if (!ngo) {
            return { error: "NGO not found" }
        }

        // In a real app, upload to cloud storage
        const mockFileUrl = `https://storage.example.com/compliance/${sanitizeString(file.name, 200)}`
        
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
                    fileName: sanitizeString(file.name, 200),
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
        console.error("[Compliance] Upload error:", error)
        return { error: "Failed to upload document" }
    }
}

export async function getNGOComplianceDocuments(ngoId) {
    if (!ngoId) return []
    
    // Validate UUID
    if (!isValidUUID(ngoId)) {
        console.warn('[Compliance] Invalid ngoId format in getNGOComplianceDocuments');
        return []
    }
    
    try {
        const documents = await prisma.complianceDoc.findMany({
            where: { ngoId },
            orderBy: { id: 'desc' }
        })
        
        return documents
    } catch (error) {
        console.error("[Compliance] Fetch error:", error)
        return []
    }
}

// Project Compliance Documents (existing functions)
export async function getProjectComplianceDocs(projectId) {
    // ===== INPUT VALIDATION =====
    if (!projectId) {
        return { success: false, error: "projectId is required" };
    }
    
    if (!isValidUUID(projectId)) {
        return { success: false, error: "Invalid projectId format" };
    }

    try {
        const docs = await prisma.projectComplianceDoc.findMany({
            where: { projectId },
            orderBy: { lastUpdated: 'desc' }
        });
        return { success: true, data: docs };
    } catch (error) {
        console.error("[Compliance] Error fetching compliance docs:", error);
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

        console.log("[Compliance] uploadComplianceDocWithFile called:", { projectId, category, docName, fileName: file?.name });

        // ===== INPUT VALIDATION =====
        if (!projectId || !category || !docName || !file) {
            return { success: false, error: "Missing required fields: projectId, category, docName, file" };
        }

        if (!isValidUUID(projectId)) {
            return { success: false, error: "Invalid projectId format" };
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return { success: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
        }

        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return { success: false, error: "Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed" };
        }

        // Check Supabase client
        if (!supabase) {
            return { success: false, error: "Storage service not configured" };
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

        // Sanitize inputs for file naming
        const sanitizedOrgName = sanitizeString(project.ngo.orgName, 50).replace(/[^a-zA-Z0-9]/g, '_');
        const sanitizedTitle = sanitizeString(project.title, 50).replace(/[^a-zA-Z0-9]/g, '_');
        const sanitizedCategory = sanitizeString(category, 20);
        const sanitizedDocName = sanitizeString(docName, 50).replace(/[^a-zA-Z0-9]/g, '_');

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
        const fileName = `${sanitizedOrgName}_${sanitizedTitle}_${sanitizedCategory}_${sanitizedDocName}_${Date.now()}.${fileExt}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ngo documents')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("[Compliance] Supabase upload error:", uploadError);
            return { success: false, error: "Failed to upload file to storage" };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('ngo documents')
            .getPublicUrl(fileName);

        console.log("[Compliance] File uploaded to Supabase:", publicUrl);

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
        console.log("[Compliance] Upload successful!");
        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("[Compliance] Error uploading document:", error);
        return { success: false, error: error.message || "Upload failed" };
    }
}

// Keep old function for backward compatibility
export async function uploadComplianceDoc(projectId, category, docName, fileUrl) {
    console.log("[Compliance] uploadComplianceDoc called with:", { projectId, category, docName, fileUrl });
    
    // ===== INPUT VALIDATION =====
    if (!projectId || !category || !docName) {
        return { success: false, error: "Missing required fields" };
    }

    if (!isValidUUID(projectId)) {
        return { success: false, error: "Invalid projectId format" };
    }

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
            console.error("[Compliance] Project not found:", projectId);
            return { success: false, error: "Project not found" };
        }

        console.log("[Compliance] Project found:", project.title);

        // Sanitize inputs
        const sanitizedCategory = sanitizeString(category, 50);
        const sanitizedDocName = sanitizeString(docName, 200);
        const sanitizedFileUrl = sanitizeString(fileUrl || '', 2000);

        // Upsert logic: if exists for this project + docName, update it. Else create.
        const existingDoc = await prisma.projectComplianceDoc.findFirst({
            where: {
                projectId,
                category: sanitizedCategory,
                docName: sanitizedDocName
            }
        });

        if (existingDoc) {
            await prisma.projectComplianceDoc.update({
                where: { id: existingDoc.id },
                data: {
                    url: sanitizedFileUrl,
                    status: 'SUBMITTED',
                    lastUpdated: new Date()
                }
            });
            console.log("[Compliance] Updated existing doc:", existingDoc.id);
        } else {
            await prisma.projectComplianceDoc.create({
                data: {
                    projectId,
                    category: sanitizedCategory,
                    docName: sanitizedDocName,
                    url: sanitizedFileUrl,
                    status: 'SUBMITTED'
                }
            });
            console.log("[Compliance] Created new compliance doc");
        }

        // Track upload in DocumentUpload table
        const trackingRecord = await prisma.documentUpload.create({
            data: {
                ngoId: project.ngoId,
                ngoName: project.ngo.orgName,
                projectId: projectId,
                projectName: project.title,
                documentType: `${sanitizedCategory}_${sanitizedDocName}`,
                fileName: sanitizedDocName,
                fileUrl: sanitizedFileUrl,
                uploadedBy: project.ngo.userId,
                status: "SUBMITTED"
            }
        });
        console.log("[Compliance] Created tracking record:", trackingRecord.id);

        revalidatePath(`/dashboard/projects/${projectId}`);
        console.log("[Compliance] Upload successful!");
        return { success: true };
    } catch (error) {
        console.error("[Compliance] Error uploading document:", error);
        return { success: false, error: error.message || "Upload failed" };
    }
}

export async function verifyComplianceDoc(docId, status, userId, remarks = "") {
    // ===== INPUT VALIDATION =====
    if (!docId || !status || !userId) {
        return { success: false, error: "Missing required fields: docId, status, userId" };
    }

    if (!isValidUUID(docId)) {
        return { success: false, error: "Invalid docId format" };
    }

    // Whitelist allowed statuses
    const allowedStatuses = ['PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'];
    if (!allowedStatuses.includes(status)) {
        return { success: false, error: "Invalid status value" };
    }

    try {
        // Verify document exists
        const doc = await prisma.projectComplianceDoc.findUnique({
            where: { id: docId },
            select: { projectId: true }
        });

        if (!doc) {
            return { success: false, error: "Document not found" };
        }

        await prisma.projectComplianceDoc.update({
            where: { id: docId },
            data: {
                status,
                verifiedBy: userId,
                remarks: sanitizeString(remarks, 500)
            }
        });

        if (doc.projectId) {
            revalidatePath(`/dashboard/projects/${doc.projectId}`);
        }

        return { success: true };
    } catch (error) {
        console.error("[Compliance] Error verifying document:", error);
        return { success: false, error: "Verification failed" };
    }
}
