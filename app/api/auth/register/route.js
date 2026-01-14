import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            email,
            orgName,
            registrationNo,
            city,
            state,
            mission,
            sector
        } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
        }

        // Create User and NGO Profile
        const newUser = await prisma.user.create({
            data: {
                email,
                name: orgName, // Use Org Name as User Name for now
                role: 'NGO',
                ngoProfile: {
                    create: {
                        orgName,
                        registrationNo,
                        city,
                        state,
                        mission,
                        // Automatically assign trust score for demo
                        trustScore: 75,
                        is12AVerified: false,
                        is80GVerified: false,
                    }
                }
            },
            include: {
                ngoProfile: true
            }
        });

        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        console.error('Registration error', error);
        return NextResponse.json({ error: 'Error creating account' }, { status: 500 });
    }
}
