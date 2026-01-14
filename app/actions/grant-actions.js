"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"; // In a real app, use auth() from session

export async function createOpportunity(formData) {
    try {
        const title = formData.get("title");
        const description = formData.get("description");
        const budget = parseFloat(formData.get("budget"));
        const deadline = new Date(formData.get("deadline"));
        // For demo, we assume the user is the seeded Corporate
        // In prod, get current user ID from session

        // Find the seeded corporate profile
        const corporate = await prisma.corporate.findFirst({
            where: { companyName: "Tech Giant India Pvt Ltd" } // For demo simplicity
        });

        if (!corporate) throw new Error("Corporate profile not found");

        await prisma.opportunity.create({
            data: {
                title,
                description,
                budget,
                deadline,
                corporateId: corporate.id,
                type: 'GRANT'
            }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Link Error:", error);
        return { error: error.message };
    }
}
