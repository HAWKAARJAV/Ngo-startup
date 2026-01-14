'use server'

import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function login(formData) {
    const email = formData.get("email")

    // 1. Verify credentials (simplified: just check if email exists in our seeded DB)
    // In a real app, you would hash/compare passwords here.
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return { error: "User not found. Try 'csr@techgiant.com' or 'info@pratham.org'" }
    }

    // 2. Set Session Cookie
    // In a real app, this would be a signed JWT or session ID.
    const sessionData = JSON.stringify({ id: user.id, email: user.email, role: user.role })

    cookies().set("token", sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/"
    })

    // 3. Redirect to appropriate dashboard
    redirect("/dashboard")
}

export async function logout() {
    cookies().delete("token")
    redirect("/login")
}
