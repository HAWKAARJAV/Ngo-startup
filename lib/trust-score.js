/**
 * Calculates a dynamic Trust Score (0-100) for an NGO.
 * 
 * Formula:
 * - Compliance (40%): 12A, 80G, FCRA, CSR-1
 * - Financial Health (30%): Expense Ratio (<20% is good), Volatility
 * - Impact/Ops (30%): Project count, Document verified count
 */
export function calculateTrustScore(ngo, projects = [], docs = []) {
    let score = 0;
    let breakdown = {
        compliance: 0,
        financial: 0,
        impact: 0
    };

    // 1. Compliance (Max 40)
    if (ngo.is12AVerified) breakdown.compliance += 10;
    if (ngo.is80GVerified) breakdown.compliance += 10;
    if (ngo.fcraStatus) breakdown.compliance += 10;
    if (ngo.csr1Number) breakdown.compliance += 5;
    if (ngo.darpanId) breakdown.compliance += 5;

    // 2. Financial Health (Max 30)
    // Expense Ratio: Lower is better. <10% = 30pts, >30% = 0pts
    const ratio = ngo.expenseRatio || 15;
    if (ratio <= 10) breakdown.financial = 30;
    else if (ratio <= 20) breakdown.financial = 20;
    else if (ratio <= 30) breakdown.financial = 10;
    else breakdown.financial = 5;

    // 3. Impact & Ops (Max 30)
    // Active Projects
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    breakdown.impact += Math.min(activeProjects * 5, 15); // Max 15 pts for projects

    // Verified Docs
    const verifiedDocs = docs.filter(d => d.status === 'VERIFIED').length;
    breakdown.impact += Math.min(verifiedDocs * 5, 15); // Max 15 pts for docs

    score = breakdown.compliance + breakdown.financial + breakdown.impact;

    return {
        score: Math.min(score, 100), // Cap at 100
        breakdown
    };
}
