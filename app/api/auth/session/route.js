import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET: Debug endpoint to check current session
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ 
                authenticated: false, 
                message: 'No session token found. Please log in.' 
            });
        }

        const session = JSON.parse(token);
        
        return NextResponse.json({ 
            authenticated: true,
            session: {
                id: session.id,
                email: session.email,
                role: session.role
            },
            expectedDashboard: session.role === 'NGO' ? '/ngo-portal' : 
                              session.role === 'CORPORATE' ? '/dashboard' : 
                              session.role === 'ADMIN' ? '/admin/dashboard' : 'unknown'
        });
    } catch (error) {
        return NextResponse.json({ 
            authenticated: false, 
            error: 'Invalid session token',
            details: error.message 
        });
    }
}
