import { NextResponse } from 'next/server'

/**
 * Security-hardened middleware
 * Adds: Security headers, improved token validation, request logging
 */
export function middleware(request) {
    const path = request.nextUrl.pathname
    const response = NextResponse.next()

    // ===== SECURITY HEADERS (ADDITIVE) =====
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY')
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')
    // Enable XSS filter in browsers
    response.headers.set('X-XSS-Protection', '1; mode=block')
    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    // Permissions policy (disable sensitive features)
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')

    // ===== PUBLIC PATHS =====
    const publicPaths = [
        '/login',
        '/register', 
        '/',
        '/about',
        '/contact',
        '/stories',
        '/live-needs',
        '/privacy',
        '/terms'
    ]
    
    const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p + '/')) ||
                         path.startsWith('/api/') ||
                         path.startsWith('/_next/') ||
                         path.includes('.') // Static files

    // Check for a session token
    const token = request.cookies.get('token')?.value || ''

    // If trying to access a protected path without a token, redirect to login
    if (!isPublicPath && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', path) // Preserve intended destination
        return NextResponse.redirect(loginUrl)
    }

    // Role-based access control
    if (token) {
        try {
            const sessionData = JSON.parse(token)
            const userRole = sessionData.role
            
            // Validate session has required fields
            if (!sessionData.id || !sessionData.email || !userRole) {
                console.warn('[Middleware] Invalid session structure, clearing cookie')
                const logoutResponse = NextResponse.redirect(new URL('/login', request.url))
                logoutResponse.cookies.delete('token')
                return logoutResponse
            }
            
            // Validate role is a known value
            const validRoles = ['NGO', 'CORPORATE', 'ADMIN', 'DONOR']
            if (!validRoles.includes(userRole)) {
                console.warn('[Middleware] Unknown role detected:', userRole)
                const logoutResponse = NextResponse.redirect(new URL('/login', request.url))
                logoutResponse.cookies.delete('token')
                return logoutResponse
            }
            
            // Corporate users trying to access NGO portal → redirect to corporate dashboard
            if (path.startsWith('/ngo-portal') && userRole === 'CORPORATE') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
            
            // NGO users trying to access corporate dashboard → redirect to NGO portal
            if (path.startsWith('/dashboard') && userRole === 'NGO') {
                return NextResponse.redirect(new URL('/ngo-portal', request.url))
            }
            
            // Admin users can access /admin only
            if (path.startsWith('/admin') && userRole !== 'ADMIN') {
                return NextResponse.redirect(new URL(userRole === 'NGO' ? '/ngo-portal' : '/dashboard', request.url))
            }
            
        } catch (e) {
            // Invalid token JSON, clear it and redirect to login
            console.error('[Middleware] Token parse error:', e.message)
            const logoutResponse = NextResponse.redirect(new URL('/login', request.url))
            logoutResponse.cookies.delete('token')
            return logoutResponse
        }
    }

    return response
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/ngo-portal/:path*',
        '/admin/:path*',
        '/profile/:path*',
    ],
}
