import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

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
            take: 20
        });

        return NextResponse.json(ngos);
    } catch (error) {
        console.error('Request error', error);
        return NextResponse.json({ error: 'Error fetching NGOs' }, { status: 500 });
    }
}
