import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Fetch list of corporates with their CSR details and donation stats
 * Accessible by NGOs to discover potential funders
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const minBudget = searchParams.get('minBudget');
    const mandateArea = searchParams.get('mandateArea');
    const search = searchParams.get('search');

    // Build where clause
    const whereClause = {
      systemStatus: 'ACTIVE' // Only show active corporates
    };

    if (industry) {
      whereClause.industry = industry;
    }

    if (minBudget) {
      whereClause.csrBudget = {
        gte: parseFloat(minBudget)
      };
    }

    if (mandateArea) {
      whereClause.mandateAreas = {
        contains: mandateArea,
        mode: 'insensitive'
      };
    }

    if (search) {
      whereClause.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { mandateAreas: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch corporates with donations and opportunities
    const corporates = await prisma.corporate.findMany({
      where: whereClause,
      include: {
        donations: {
          select: {
            amount: true,
            date: true
          }
        },
        opportunities: {
          where: { status: 'OPEN' },
          select: {
            id: true,
            title: true,
            budget: true,
            deadline: true,
            type: true
          }
        }
      },
      orderBy: { csrBudget: 'desc' }
    });

    // Enrich with computed stats
    const enrichedCorporates = corporates.map(corp => {
      const totalDonated = corp.donations.reduce((sum, d) => sum + d.amount, 0);
      const donationCount = corp.donations.length;
      const activeOpportunities = corp.opportunities.length;
      const totalOpportunityBudget = corp.opportunities.reduce((sum, o) => sum + o.budget, 0);

      // Parse mandate areas into array
      const mandateAreasArray = corp.mandateAreas
        .split(',')
        .map(area => area.trim())
        .filter(area => area.length > 0);

      return {
        id: corp.id,
        companyName: corp.companyName,
        industry: corp.industry,
        csrBudget: corp.csrBudget,
        mandateAreas: mandateAreasArray,
        mandateAreasRaw: corp.mandateAreas,
        stats: {
          totalDonated,
          donationCount,
          activeOpportunities,
          totalOpportunityBudget
        },
        opportunities: corp.opportunities
      };
    });

    // Get unique industries and mandate areas for filters
    const allCorporates = await prisma.corporate.findMany({
      where: { systemStatus: 'ACTIVE' },
      select: { industry: true, mandateAreas: true }
    });

    const industries = [...new Set(allCorporates.map(c => c.industry))].sort();
    const allMandateAreas = [...new Set(
      allCorporates
        .flatMap(c => c.mandateAreas.split(',').map(a => a.trim()))
        .filter(a => a.length > 0)
    )].sort();

    return NextResponse.json({
      corporates: enrichedCorporates,
      filters: {
        industries,
        mandateAreas: allMandateAreas
      },
      total: enrichedCorporates.length
    });

  } catch (error) {
    console.error('Error fetching corporates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch corporates' },
      { status: 500 }
    );
  }
}
