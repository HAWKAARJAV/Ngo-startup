'use server'

import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Login action with security hardening
 * TODO: Add proper password hashing in production (bcrypt)
 * TODO: Add rate limiting
 */
export async function login(formData) {
    const email = formData.get("email")

    // ===== INPUT VALIDATION =====
    if (!email || typeof email !== 'string') {
        return { error: "Email is required" }
    }

    // Normalize and validate email
    const normalizedEmail = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
        return { error: "Invalid email format" }
    }

    // Prevent email injection (basic)
    if (normalizedEmail.length > 254) {
        return { error: "Email too long" }
    }

    try {
        // 1. Verify credentials (simplified: just check if email exists in our seeded DB)
        // TODO: In production, hash/compare passwords with bcrypt
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })

        if (!user) {
            // Use generic error to prevent email enumeration
            return { error: "Invalid credentials. Please check your email." }
        }

        // 2. Set Session Cookie
        // TODO: In production, use signed JWT with expiry validation
        const sessionData = JSON.stringify({ 
            id: user.id, 
            email: user.email, 
            role: user.role,
            // Add timestamp for potential session validation
            iat: Date.now()
        })

        const cookieStore = await cookies()
        cookieStore.set("token", sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax', // CSRF protection
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/"
        })

        // 3. Redirect to appropriate dashboard based on role
        if (user.role === "NGO") {
            redirect("/ngo-portal")
        } else if (user.role === "ADMIN") {
            redirect("/admin/dashboard")
        } else {
            // Corporate users
            redirect("/dashboard")
        }
    } catch (error) {
        // Don't expose internal errors
        console.error("[Auth] Login error:", error)
        
        // Re-throw redirect errors (they're expected)
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }
        
        return { error: "An error occurred. Please try again." }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("token")
    redirect("/login")
}
