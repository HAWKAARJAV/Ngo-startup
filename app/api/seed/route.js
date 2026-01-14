import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
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

        return NextResponse.json({ success: true, message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed error', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
