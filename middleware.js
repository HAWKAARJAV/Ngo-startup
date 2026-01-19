import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname

    // Define paths that are public
    const isPublicPath = path === '/login' || path === '/register' || path === '/' || path.startsWith('/api/') || path.startsWith('/about') || path.startsWith('/contact') || path.startsWith('/stories') || path.startsWith('/live-needs')

    // Check for a session token
    const token = request.cookies.get('token')?.value || ''

    // If trying to access a protected path without a token, redirect to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based access control
    if (token) {
        try {
            const sessionData = JSON.parse(token)
            const userRole = sessionData.role
            
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
            // Invalid token, let the page handle it
            console.error('Middleware: Invalid token', e)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/ngo-portal/:path*',
        '/admin/:path*',
        '/profile/:path*',
    ],
}
