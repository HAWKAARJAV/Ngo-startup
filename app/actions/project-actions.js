'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function approveTranche(projectId) {
    try {
        // 1. Get current project
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        })

        if (!project) throw new Error("Project not found")

        // 2. Simulate "Unlocking" a tranche (Adding 25% of target to raised)
        // In a real app, this would update a specific Tranche record.
        // For this demo, we just boost the raised amount to show progress.
        const boostAmount = project.targetAmount * 0.25

        // Ensure we don't exceed target by too much logic (optional)
        const newRaised = Math.min(project.raisedAmount + boostAmount, project.targetAmount)

        await prisma.project.update({
            where: { id: projectId },
            data: { raisedAmount: newRaised }
        })

        // 3. Revalidate dashboard to show updated progress bars/stats
        revalidatePath('/dashboard')

        return { success: true, newRaised }
    } catch (error) {
        console.error("Tranche Error:", error)
        return { success: false, error: error.message }
    }
}
