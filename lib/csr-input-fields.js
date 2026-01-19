// CSR Input Fields Catalog
// Defines all input fields required for document generation

export const CSR_INPUT_FIELDS = [
    // Company Inputs
    {
        id: 'company-name',
        label: 'Company Name',
        type: 'text',
        category: 'company',
        required: true,
        placeholder: 'e.g., Reliance Foundation',
        usedByDocuments: ['csr-2-data-pack', 'board-report-csr', 'csr-policy', 'internal-compliance-cert', 'annual-csr-report', 'website-disclosure']
    },
    {
        id: 'cin',
        label: 'Corporate Identification Number (CIN)',
        type: 'text',
        category: 'company',
        required: true,
        placeholder: 'e.g., L12345MH2010PLC123456',
        usedByDocuments: ['csr-2-data-pack']
    },
    {
        id: 'fy',
        label: 'Financial Year',
        type: 'select',
        category: 'company',
        required: true,
        options: ['FY 2024-25', 'FY 2023-24', 'FY 2022-23'],
        usedByDocuments: ['csr-2-data-pack', 'board-report-csr', 'annual-action-plan', 'internal-compliance-cert', 'annual-csr-report']
    },
    {
        id: 'csr-obligation',
        label: 'CSR Obligation Amount (₹)',
        type: 'number',
        category: 'company',
        required: true,
        placeholder: 'e.g., 50000000',
        usedByDocuments: ['csr-2-data-pack', 'board-report-csr', 'internal-compliance-cert']
    },
    {
        id: 'csr-committee',
        label: 'CSR Committee Members',
        type: 'textarea',
        category: 'company',
        required: true,
        placeholder: 'Name, Designation\ne.g., John Doe, Chairperson\nJane Smith, Member',
        usedByDocuments: ['board-report-csr', 'csr-committee-charter']
    },
    {
        id: 'budget-approved',
        label: 'Approved CSR Budget (₹)',
        type: 'number',
        category: 'company',
        required: true,
        placeholder: 'e.g., 50000000',
        usedByDocuments: ['csr-2-data-pack', 'board-report-csr', 'annual-action-plan', 'funds-approved-vs-utilized', 'annual-csr-report']
    },
    {
        id: 'amount-disbursed',
        label: 'Amount Disbursed (₹)',
        type: 'number',
        category: 'company',
        required: true,
        placeholder: 'e.g., 48000000',
        usedByDocuments: ['csr-2-data-pack', 'funds-approved-vs-utilized', 'internal-compliance-cert', 'annual-csr-report']
    },
    {
        id: 'unspent-amount',
        label: 'Unspent Amount (₹)',
        type: 'number',
        category: 'company',
        required: false,
        placeholder: 'e.g., 2000000',
        usedByDocuments: ['csr-2-data-pack', 'unspent-csr-reason', 'unspent-account-summary']
    },
    {
        id: 'unspent-reason',
        label: 'Reason for Unspent Amount',
        type: 'textarea',
        category: 'company',
        required: false,
        placeholder: 'Explain why CSR budget was not fully utilized',
        usedByDocuments: ['unspent-csr-reason']
    },
    {
        id: 'csr-focus-areas',
        label: 'CSR Focus Areas',
        type: 'textarea',
        category: 'company',
        required: false,
        placeholder: 'e.g., Education, Healthcare, Environment',
        usedByDocuments: ['csr-policy']
    },
    {
        id: 'csr-policy',
        label: 'CSR Policy Document',
        type: 'file',
        category: 'company',
        required: false,
        accept: '.pdf',
        usedByDocuments: ['website-disclosure']
    },

    // Project Inputs
    {
        id: 'project-name',
        label: 'Project Name',
        type: 'text',
        category: 'project',
        required: true,
        placeholder: 'e.g., Rural Education Initiative',
        usedByDocuments: ['schedule-vii-mapping', 'ongoing-project-note', 'annual-action-plan', 'project-expenditure', 'uc-tracker', 'quarterly-progress', 'activity-output', 'baseline-endline', 'social-impact-kpi', 'project-completion', 'annual-csr-report', 'project-highlights']
    },
    {
        id: 'ngo-name',
        label: 'NGO Name',
        type: 'text',
        category: 'project',
        required: true,
        placeholder: 'e.g., Pratham Education Foundation',
        usedByDocuments: ['project-expenditure']
    },
    {
        id: 'ngo-registration',
        label: 'NGO Registration ID',
        type: 'text',
        category: 'project',
        required: false,
        placeholder: 'e.g., 12A/80G Certificate Number',
        usedByDocuments: ['project-expenditure']
    },
    {
        id: 'project-category',
        label: 'Schedule VII Category',
        type: 'select',
        category: 'project',
        required: true,
        options: [
            '(i) Eradicating hunger, poverty and malnutrition',
            '(ii) Promoting education',
            '(iii) Promoting gender equality',
            '(iv) Ensuring environmental sustainability',
            '(v) Protection of national heritage',
            '(vi) Armed forces veterans welfare',
            '(vii) Training to promote sports',
            '(viii) Rural development projects',
            '(ix) Slum area development',
            '(x) Disaster management'
        ],
        usedByDocuments: ['schedule-vii-mapping']
    },
    {
        id: 'project-location',
        label: 'Project Location (State/District)',
        type: 'text',
        category: 'project',
        required: false,
        placeholder: 'e.g., Maharashtra, Mumbai',
        usedByDocuments: []
    },
    {
        id: 'beneficiary-category',
        label: 'Beneficiary Category',
        type: 'select',
        category: 'project',
        required: false,
        options: ['Children', 'Women', 'Senior Citizens', 'Differently Abled', 'Economically Weaker Sections', 'Other'],
        usedByDocuments: []
    },
    {
        id: 'beneficiary-count',
        label: 'Number of Beneficiaries',
        type: 'number',
        category: 'project',
        required: false,
        placeholder: 'e.g., 5000',
        usedByDocuments: ['activity-output', 'social-impact-kpi']
    },
    {
        id: 'project-duration',
        label: 'Project Duration',
        type: 'text',
        category: 'project',
        required: false,
        placeholder: 'e.g., 12 months / April 2024 to March 2025',
        usedByDocuments: ['ongoing-project-note']
    },
    {
        id: 'project-status',
        label: 'Project Status',
        type: 'select',
        category: 'project',
        required: false,
        options: ['Ongoing', 'Completed', 'On Hold'],
        usedByDocuments: ['ongoing-project-note', 'project-completion']
    },
    {
        id: 'project-amount',
        label: 'Project Budget (₹)',
        type: 'number',
        category: 'project',
        required: true,
        placeholder: 'e.g., 5000000',
        usedByDocuments: ['schedule-vii-mapping', 'project-expenditure']
    },

    // Uploads
    {
        id: 'project-proposal-upload',
        label: 'NGO Project Proposal',
        type: 'file',
        category: 'upload',
        required: false,
        accept: '.pdf,.doc,.docx',
        usedByDocuments: []
    },
    {
        id: 'uc-upload',
        label: 'Utilization Certificate',
        type: 'file',
        category: 'upload',
        required: false,
        accept: '.pdf',
        usedByDocuments: ['uc-tracker']
    },
    {
        id: 'progress-report-upload',
        label: 'Progress Report',
        type: 'file',
        category: 'upload',
        required: false,
        accept: '.pdf,.doc,.docx',
        usedByDocuments: ['quarterly-progress']
    },
    {
        id: 'impact-assessment-upload',
        label: 'Impact Assessment Report',
        type: 'file',
        category: 'upload',
        required: false,
        accept: '.pdf',
        usedByDocuments: ['baseline-endline', 'impact-assessment-action']
    },
    {
        id: 'final-report-upload',
        label: 'Final Project Report',
        type: 'file',
        category: 'upload',
        required: false,
        accept: '.pdf,.doc,.docx',
        usedByDocuments: ['project-completion']
    },
    {
        id: 'auditor-cert-upload',
        label: 'Auditor-signed Certificate',
        type: 'file',
        category: 'upload',
        required: false,
        accept: '.pdf',
        readOnly: true,
        usedByDocuments: []
    }
];

// Helper functions
export const getInputsByCategory = (category) => {
    return CSR_INPUT_FIELDS.filter(field => field.category === category);
};

export const getRequiredInputsForDocuments = (documentIds) => {
    const requiredInputIds = new Set();

    documentIds.forEach(docId => {
        CSR_INPUT_FIELDS.forEach(field => {
            if (field.usedByDocuments.includes(docId)) {
                requiredInputIds.add(field.id);
            }
        });
    });

    return CSR_INPUT_FIELDS.filter(field => requiredInputIds.has(field.id));
};

export const INPUT_CATEGORIES = [
    { key: 'company', label: 'Corporate Information', icon: 'Building' },
    { key: 'project', label: 'Project Details', icon: 'FolderOpen' },
    { key: 'upload', label: 'Document Uploads', icon: 'Upload' }
];
