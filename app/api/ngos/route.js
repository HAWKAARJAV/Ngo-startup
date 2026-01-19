import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    try {
        const where = {};
        if (query) {
            where.OR = [
                { orgName: { contains: query, mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } },
                { mission: { contains: query, mode: 'insensitive' } },
            ];
        }

        const ngos = await prisma.nGO.findMany({
            where: {
                ...where,
                // user: { role: 'NGO' } // Implicit via relations
            },
            include: {
                projects: true,
                documents: true,
            },
            take: limit
        });

        // Add project count to each NGO
        const ngosWithCount = ngos.map(ngo => ({
            ...ngo,
            projectCount: ngo.projects?.length || 0,
            ngoProfile: {
                id: ngo.id,
                city: ngo.city,
                trustScore: ngo.trustScore,
                is12AVerified: ngo.is12AVerified,
                is80GVerified: ngo.is80GVerified,
                fcraStatus: ngo.fcraStatus,
                mission: ngo.mission
            }
        }));

        return NextResponse.json(ngosWithCount);
    } catch (error) {
        console.error('Request error', error);
        return NextResponse.json({ error: 'Error fetching NGOs' }, { status: 500 });
    }
}
