// CSR Documents Catalog
// Defines all available CSR documents with their properties and requirements

export const CSR_DOCUMENTS_CATALOG = [
    // A. Regulatory & MCA-Ready Documents
    {
        id: 'csr-2-data-pack',
        name: 'CSR-2 Data Pack',
        category: 'regulatory',
        type: 'Regulatory',
        description: 'MCA-ready tables and data points for Form CSR-2 filing',
        requiredTier: 'pro',
        requiredInputs: ['company-name', 'cin', 'fy', 'csr-obligation', 'budget-approved', 'amount-disbursed', 'unspent-amount'],
        legalRelevance: 'Required for MCA filing under Section 135 of Companies Act, 2013',
        mcaReady: true,
        auditorReady: true
    },
    {
        id: 'board-report-csr',
        name: "Board's Report – CSR Section",
        category: 'regulatory',
        type: 'Regulatory',
        description: 'Section 134(3)(o) compliant draft for annual report',
        requiredTier: 'pro',
        requiredInputs: ['company-name', 'fy', 'csr-committee', 'csr-obligation', 'budget-approved'],
        legalRelevance: 'Mandatory disclosure under Section 134 of Companies Act, 2013',
        mcaReady: true,
        auditorReady: false
    },
    {
        id: 'schedule-vii-mapping',
        name: 'Schedule VII Activity Mapping Note',
        category: 'regulatory',
        type: 'Regulatory',
        description: 'Compliance mapping to Schedule VII categories',
        requiredTier: 'pro',
        requiredInputs: ['project-name', 'project-category', 'project-amount'],
        legalRelevance: 'Ensures alignment with permitted CSR activities under Companies Act',
        mcaReady: true,
        auditorReady: true
    },
    {
        id: 'unspent-csr-reason',
        name: 'Reasons for Unspent CSR Amount',
        category: 'regulatory',
        type: 'Regulatory',
        description: 'Rule 10 compliant explanation note',
        requiredTier: 'pro',
        requiredInputs: ['unspent-amount', 'unspent-reason'],
        legalRelevance: 'Required when CSR budget is not fully utilized (Rule 10)',
        mcaReady: true,
        auditorReady: false
    },
    {
        id: 'ongoing-project-note',
        name: 'Ongoing Project Classification Note',
        category: 'regulatory',
        type: 'Regulatory',
        description: 'Classification and tracking of multi-year projects',
        requiredTier: 'pro',
        requiredInputs: ['project-name', 'project-duration', 'project-status'],
        legalRelevance: 'Defines ongoing vs completed projects per CSR Rules',
        mcaReady: true,
        auditorReady: false
    },

    // B. Governance & Internal Compliance
    {
        id: 'csr-policy',
        name: 'CSR Policy',
        category: 'governance',
        type: 'Governance',
        description: 'Company-customized CSR policy document',
        requiredTier: 'pro',
        requiredInputs: ['company-name', 'csr-focus-areas'],
        legalRelevance: 'Board-approved policy required under Section 135(5)',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'annual-action-plan',
        name: 'Annual CSR Action Plan',
        category: 'governance',
        type: 'Governance',
        description: 'Year-wise CSR implementation roadmap',
        requiredTier: 'pro',
        requiredInputs: ['fy', 'budget-approved', 'project-name'],
        legalRelevance: 'Best practice for structured CSR execution',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'csr-committee-charter',
        name: 'CSR Committee Charter',
        category: 'governance',
        type: 'Governance',
        description: 'Terms of reference for CSR Committee',
        requiredTier: 'free',
        requiredInputs: ['csr-committee'],
        legalRelevance: 'Defines committee roles per Section 135(1)',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'internal-compliance-cert',
        name: 'Internal CSR Compliance Certificate',
        category: 'governance',
        type: 'Governance',
        description: 'Draft certificate for internal audit',
        requiredTier: 'enterprise',
        requiredInputs: ['company-name', 'fy', 'csr-obligation', 'amount-disbursed'],
        legalRelevance: 'Internal control document for management review',
        mcaReady: false,
        auditorReady: true
    },

    // C. Financial & Utilization Reports
    {
        id: 'project-expenditure',
        name: 'Project-wise Expenditure Statement',
        category: 'financial',
        type: 'Financial',
        description: 'Detailed project-level spending breakdown',
        requiredTier: 'pro',
        requiredInputs: ['project-name', 'project-amount', 'ngo-name'],
        legalRelevance: 'Supports CSR-2 filing and audit trails',
        mcaReady: false,
        auditorReady: true
    },
    {
        id: 'funds-approved-vs-utilized',
        name: 'Funds Approved vs Utilized Summary',
        category: 'financial',
        type: 'Financial',
        description: 'Budget vs actual comparison report',
        requiredTier: 'pro',
        requiredInputs: ['budget-approved', 'amount-disbursed'],
        legalRelevance: 'Key metric for CSR accountability',
        mcaReady: false,
        auditorReady: true
    },
    {
        id: 'uc-tracker',
        name: 'Utilization Certificate Tracker',
        category: 'financial',
        type: 'Financial',
        description: 'UC submission and compliance status',
        requiredTier: 'free',
        requiredInputs: ['project-name', 'uc-upload'],
        legalRelevance: 'Tracks mandatory UC submissions from NGOs',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'unspent-account-summary',
        name: 'Unspent CSR Account Summary',
        category: 'financial',
        type: 'Financial',
        description: 'Separate bank account statement summary',
        requiredTier: 'pro',
        requiredInputs: ['unspent-amount'],
        legalRelevance: 'Required when funds transferred to Unspent CSR Account',
        mcaReady: true,
        auditorReady: true
    },

    // D. Monitoring & Impact Reports
    {
        id: 'quarterly-progress',
        name: 'Quarterly / Milestone Progress Report',
        category: 'monitoring',
        type: 'Impact',
        description: 'Periodic project progress tracking',
        requiredTier: 'pro',
        requiredInputs: ['project-name', 'progress-report-upload'],
        legalRelevance: 'Demonstrates active project monitoring',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'activity-output',
        name: 'Activity-wise Output Report',
        category: 'monitoring',
        type: 'Impact',
        description: 'Deliverables achieved per project activity',
        requiredTier: 'enterprise',
        requiredInputs: ['project-name', 'beneficiary-count'],
        legalRelevance: 'Shows tangible outputs delivered',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'baseline-endline',
        name: 'Baseline vs Endline Outcome Report',
        category: 'monitoring',
        type: 'Impact',
        description: 'Impact measurement with before-after comparison',
        requiredTier: 'enterprise',
        requiredInputs: ['project-name', 'impact-assessment-upload'],
        legalRelevance: 'Demonstrates measurable social impact',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'social-impact-kpi',
        name: 'Social Impact KPI Dashboard',
        category: 'monitoring',
        type: 'Impact',
        description: 'Key performance indicators visualization',
        requiredTier: 'enterprise',
        requiredInputs: ['project-name', 'beneficiary-count'],
        legalRelevance: 'Management tool for impact tracking',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'project-completion',
        name: 'Final Project Completion Report',
        category: 'monitoring',
        type: 'Impact',
        description: 'Comprehensive project closure document',
        requiredTier: 'pro',
        requiredInputs: ['project-name', 'project-status', 'final-report-upload'],
        legalRelevance: 'Required for project closure and learnings',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'impact-assessment-action',
        name: 'Action Taken Report on Impact Assessment',
        category: 'monitoring',
        type: 'Impact',
        description: 'Response to impact assessment findings',
        requiredTier: 'enterprise',
        requiredInputs: ['impact-assessment-upload'],
        legalRelevance: 'Shows continuous improvement based on findings',
        mcaReady: false,
        auditorReady: false
    },

    // E. Public Disclosure & Website Reports
    {
        id: 'annual-csr-report',
        name: 'Annual CSR Report (PDF)',
        category: 'disclosure',
        type: 'Regulatory',
        description: 'Public-facing annual CSR summary',
        requiredTier: 'pro',
        requiredInputs: ['company-name', 'fy', 'budget-approved', 'amount-disbursed', 'project-name'],
        legalRelevance: 'Best practice for transparency and stakeholder communication',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'website-disclosure',
        name: 'Website CSR Disclosure Content',
        category: 'disclosure',
        type: 'Regulatory',
        description: 'HTML/content for corporate website CSR section',
        requiredTier: 'free',
        requiredInputs: ['company-name', 'csr-policy'],
        legalRelevance: 'Section 135(5)(d) requires CSR policy on website',
        mcaReady: false,
        auditorReady: false
    },
    {
        id: 'project-highlights',
        name: 'Project Highlights Summary',
        category: 'disclosure',
        type: 'Impact',
        description: 'Success stories and case studies',
        requiredTier: 'free',
        requiredInputs: ['project-name'],
        legalRelevance: 'Marketing and PR tool for CSR initiatives',
        mcaReady: false,
        auditorReady: false
    }
];

// Helper functions
export const getDocumentsByCategory = (category) => {
    return CSR_DOCUMENTS_CATALOG.filter(doc => doc.category === category);
};

export const getDocumentsByTier = (tier) => {
    const tierHierarchy = { free: 0, pro: 1, enterprise: 2 };
    const userTierLevel = tierHierarchy[tier];

    return CSR_DOCUMENTS_CATALOG.filter(doc => {
        const docTierLevel = tierHierarchy[doc.requiredTier];
        return docTierLevel <= userTierLevel;
    });
};

export const DOCUMENT_CATEGORIES = [
    { key: 'regulatory', label: 'Regulatory & MCA-Ready Documents', icon: 'Shield' },
    { key: 'governance', label: 'Governance & Internal Compliance', icon: 'FileCheck' },
    { key: 'financial', label: 'Financial & Utilization Reports', icon: 'DollarSign' },
    { key: 'monitoring', label: 'Monitoring & Impact Reports', icon: 'TrendingUp' },
    { key: 'disclosure', label: 'Public Disclosure & Website Reports', icon: 'Globe' }
];
