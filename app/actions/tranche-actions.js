'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function uploadTrancheDocument(formData) {
    const trancheId = formData.get("trancheId")
    const documentType = formData.get("documentType") // 'UC' or 'PHOTO'
    const file = formData.get("file")

    if (!trancheId || !file) {
        return { error: "Missing required fields" }
    }

    try {
        // Get tranche and project details
        const tranche = await prisma.tranche.findUnique({
            where: { id: trancheId },
            include: {
                project: {
                    include: {
                        ngo: {
                            include: { user: true }
                        }
                    }
                }
            }
        })

        if (!tranche) {
            return { error: "Tranche not found" }
        }

        // Upload actual file to Supabase Storage
        const fileName = `${trancheId}_${documentType}_${Date.now()}_${file.name}`
        const filePath = `tranche-documents/${fileName}`
        
        // Convert File to ArrayBuffer for upload
        const fileBuffer = await file.arrayBuffer()
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ngo documents')
            .upload(filePath, fileBuffer, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error("Supabase upload error:", uploadError)
            return { error: "Failed to upload file to storage" }
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('ngo documents')
            .getPublicUrl(filePath)
        
        const fileUrl = urlData.publicUrl
        
        // Create document upload record in database
        await prisma.documentUpload.create({
            data: {
                ngoId: tranche.project.ngoId,
                ngoName: tranche.project.ngo.orgName,
                projectId: tranche.projectId,
                projectName: tranche.project.title,
                documentType: documentType,
                fileName: file.name,
                fileUrl: fileUrl,
                fileSize: file.size,
                uploadedBy: tranche.project.ngo.userId,
                status: "PENDING"
            }
        })

        // Update tranche in database with actual file URL
        const updateData = {}
        
        if (documentType === 'UC') {
            updateData.proofDocUrl = fileUrl
            updateData.releaseRequested = true
        } else if (documentType === 'PHOTO') {
            updateData.geoTag = fileUrl // Store image URL in geoTag for now
        }

        await prisma.tranche.update({
            where: { id: trancheId },
            data: updateData
        })

        // Revalidate the page to show updated data
        revalidatePath('/ngo-portal/projects')
        
        return { success: true, message: `${documentType === 'UC' ? 'Utilization Certificate' : 'Photo'} uploaded successfully!` }
    } catch (error) {
        console.error("Upload error:", error)
        return { error: "Failed to upload document" }
    }
}

export async function requestTrancheRelease(trancheId) {
    if (!trancheId) {
        return { error: "Tranche ID is required" }
    }

    try {
        // Check if both documents are uploaded
        const tranche = await prisma.tranche.findUnique({
            where: { id: trancheId }
        })

        if (!tranche) {
            return { error: "Tranche not found" }
        }

        if (!tranche.proofDocUrl) {
            return { error: "Please upload Utilization Certificate first" }
        }

        // Update tranche to request release
        await prisma.tranche.update({
            where: { id: trancheId },
            data: {
                releaseRequested: true,
                isBlocked: false, // Unblock since documents are uploaded
                blockReason: null
            }
        })

        revalidatePath('/ngo-portal/projects')
        
        return { success: true, message: "Release request submitted! Pending corporate review." }
    } catch (error) {
        console.error("Request release error:", error)
        return { error: "Failed to submit release request" }
    }
}
