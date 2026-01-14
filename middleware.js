import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname

    // Define paths that are public
    const isPublicPath = path === '/login' || path === '/register' || path === '/' || path.startsWith('/api/')

    // Check for a session token (this is a basic check, verify with your auth provider)
    // Adjust 'session_token' to whatever cookie name your auth uses
    const token = request.cookies.get('token')?.value || ''

    // If trying to access a protected path without a token, redirect to login
    if (!isPublicPath && !token) {
        // allow dashboard for now to verify data if auth isn't fully set up yet
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // For now, we are just logging or doing a pass-through because 
    // robust auth wasn't part of the immediate scope, but the file is here.
    // Uncomment the redirect above when auth cookie logic is confirmed.

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
    ],
}
