import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * PROTECTED: Seed API endpoint
 * This endpoint should NEVER be exposed in production without authentication
 */
export async function GET(request) {
    // ===== PRODUCTION GUARD =====
    // Block in production unless explicitly enabled
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
        console.error('[Seed API] Blocked seed attempt in production');
        return NextResponse.json(
            { error: 'Seed endpoint is disabled in production' },
            { status: 403 }
        );
    }

    // Optional: Check for admin secret header in development
    const seedSecret = request.headers.get('x-seed-secret');
    if (process.env.SEED_SECRET && seedSecret !== process.env.SEED_SECRET) {
        console.warn('[Seed API] Invalid or missing seed secret');
        return NextResponse.json(
            { error: 'Unauthorized: Invalid seed secret' },
            { status: 401 }
        );
    }

    try {
        console.log('[Seed API] Starting database seed...');
        
        // 1. Create Admin
        const admin = await prisma.user.upsert({
            where: { email: 'admin@ngoconnect.in' },
            update: {},
            create: {
                email: 'admin@ngoconnect.in',
                name: 'Admin User',
                role: 'ADMIN',
            },
        })

        // 2. Create Corporate: Tata CSR
        const tataUser = await prisma.user.upsert({
            where: { email: 'csr@tata.com' },
            update: {},
            create: {
                email: 'csr@tata.com',
                name: 'Tata Sustainability Group',
                role: 'CORPORATE',
                corporateProfile: {
                    create: {
                        companyName: 'Tata Sons',
                        industry: 'Conglomerate',
                        csrBudget: 50000000, // 5 Cr
                        mandateAreas: 'Education,Healthcare,Skill Development',
                    },
                },
            },
        })

        // 3. Create NGO: Vidya Trust (Verified)
        const vidyaUser = await prisma.user.upsert({
            where: { email: 'info@vidyatrust.org' },
            update: {},
            create: {
                email: 'info@vidyatrust.org',
                name: 'Vidya Trust',
                role: 'NGO',
                ngoProfile: {
                    create: {
                        orgName: 'Vidya Integrated Development for Youth and Adults',
                        city: 'New Delhi',
                        state: 'Delhi',
                        registrationNo: 'DEL/123/2005',
                        mission: 'Empowerment through education and skill training.',
                        is12AVerified: true,
                        is80GVerified: true,
                        fcraStatus: true,
                        trustScore: 95,
                        documents: {
                            create: [
                                { docType: '12A Certificate', url: 'https://placehold.co/600x400', status: 'VERIFIED' },
                                { docType: '80G Certificate', url: 'https://placehold.co/600x400', status: 'VERIFIED' },
                            ],
                        },
                        projects: {
                            create: [
                                {
                                    title: 'Digital Literacy for 500 Girls in Slums',
                                    description: 'Providing laptops and coding classes for girls in South Delhi slums.',
                                    targetAmount: 2500000,
                                    location: 'South Delhi',
                                    sector: 'Education',
                                    status: 'Fundraising',
                                },
                            ],
                        },
                    },
                },
            },
        })

        // 4. Create NGO: Goonj (Verified)
        const goonjUser = await prisma.user.upsert({
            where: { email: 'mail@goonj.org' },
            update: {},
            create: {
                email: 'mail@goonj.org',
                name: 'Goonj',
                role: 'NGO',
                ngoProfile: {
                    create: {
                        orgName: 'Goonj',
                        city: 'New Delhi',
                        state: 'Delhi',
                        registrationNo: 'DEL/456/1999',
                        mission: 'Using urban surplus as a tool for rural development.',
                        is12AVerified: true,
                        is80GVerified: true,
                        trustScore: 98,
                        projects: {
                            create: [
                                {
                                    title: 'Cloth for Work - Bihar Floods',
                                    description: 'Repairing roads in exchange for clothes and essential kits.',
                                    targetAmount: 5000000,
                                    location: 'Bihar',
                                    sector: 'Disaster Relief',
                                    status: 'Active',
                                },
                            ],
                        },
                    },
                },
            },
        })

        console.log('[Seed API] Database seeded successfully');
        return NextResponse.json({ 
            success: true, 
            message: 'Database seeded successfully',
            // Don't expose IDs in production
            seeded: process.env.NODE_ENV !== 'production' ? {
                adminEmail: admin.email,
                corporateEmail: tataUser.email,
                ngoEmails: [vidyaUser.email, goonjUser.email]
            } : undefined
        });
    } catch (error) {
        console.error('[Seed API] Seed error:', error);
        return NextResponse.json(
            { error: 'Seed failed', details: process.env.NODE_ENV !== 'production' ? error.message : undefined },
            { status: 500 }
        );
    }
}
