"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * NGO calls this to request funds from the Escrow.
 * Requires Proof of work (UC / Photos).
 */
export async function requestFundRelease(trancheId, proofUrl, geoTag) {
    try {
        await prisma.tranche.update({
            where: { id: trancheId },
            data: {
                releaseRequested: true,
                proofDocUrl: proofUrl,
                geoTag: geoTag,
                // Status remains LOCKED until approved
            }
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

/**
 * Corporate calls this to verify proof and unlock the escrow.
 */
export async function approveTrancheRelease(trancheId) {
    try {
        const tranche = await prisma.tranche.findUnique({
            where: { id: trancheId },
            include: { project: true }
        });

        if (!tranche) throw new Error("Tranche not found");

        // 1. Update Tranche Status
        await prisma.tranche.update({
            where: { id: trancheId },
            data: {
                status: 'DISBURSED',
                releaseRequested: false, // Request processed
            }
        });

        // 2. Update Project Raised Amount
        await prisma.project.update({
            where: { id: tranche.projectId },
            data: {
                raisedAmount: { increment: tranche.amount }
            }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}
