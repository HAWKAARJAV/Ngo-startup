// Comprehensive CSR Input Fields by Document
// Each document has its own set of specific inputs with tooltips and validation

export const DOCUMENT_INPUT_SCHEMAS = {
    'csr-2-data-pack': {
        documentName: 'CSR-2 Data Pack',
        fields: [
            {
                id: 'financial-year',
                label: 'Financial Year',
                type: 'select',
                required: true,
                tooltip: 'Select the financial year for CSR-2 filing (April to March)',
                options: ['FY 2024-25', 'FY 2023-24', 'FY 2022-23', 'FY 2021-22']
            },
            {
                id: 'cin',
                label: 'Corporate Identification Number (CIN)',
                type: 'text',
                required: true,
                tooltip: 'MCA-issued 21-character unique company identification number',
                placeholder: 'e.g., L17110MH1973PLC019786',
                pattern: '[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}',
                validation: 'Must be 21 characters (MCA format)'
            },
            {
                id: 'company-name',
                label: 'Company Name',
                type: 'text',
                required: true,
                tooltip: 'Official registered name as per MCA records',
                placeholder: 'e.g., Reliance Industries Limited'
            },
            {
                id: 'csr-obligation',
                label: 'CSR Obligation (₹)',
                type: 'number',
                required: true,
                tooltip: '2% of average net profit of preceding 3 financial years',
                placeholder: 'e.g., 50000000',
                min: 0
            },
            {
                id: 'avg-net-profit',
                label: 'Average Net Profit (₹)',
                type: 'number',
                required: true,
                tooltip: 'Average net profit of preceding 3 years as per Section 198',
                placeholder: 'e.g., 2500000000',
                min: 0
            },
            {
                id: 'project-name',
                label: 'Project Name',
                type: 'text',
                required: true,
                tooltip: 'Descriptive name of the CSR project',
                placeholder: 'e.g., Rural Education Initiative - Phase 2'
            },
            {
                id: 'project-state',
                label: 'Project State',
                type: 'select',
                required: true,
                tooltip: 'State where project is being implemented',
                options: ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']
            },
            {
                id: 'project-district',
                label: 'Project District',
                type: 'text',
                required: true,
                tooltip: 'District(s) where project activities are conducted',
                placeholder: 'e.g., Pune, Satara'
            },
            {
                id: 'implementing-agency',
                label: 'Implementing Agency Name',
                type: 'text',
                required: true,
                tooltip: 'NGO/Trust/Foundation executing the CSR project',
                placeholder: 'e.g., Pratham Education Foundation'
            },
            {
                id: 'ngo-reg-type',
                label: 'NGO Registration Type',
                type: 'select',
                required: true,
                tooltip: 'Legal structure of the implementing agency',
                options: ['Trust', 'Society', 'Section 8 Company']
            },
            {
                id: 'ngo-pan',
                label: 'NGO PAN',
                type: 'text',
                required: true,
                tooltip: 'Permanent Account Number of the NGO',
                placeholder: 'e.g., AAACT1234F',
                pattern: '[A-Z]{5}[0-9]{4}[A-Z]',
                validation: 'Must be 10 characters (PAN format)'
            },
            {
                id: 'ngo-darpan-id',
                label: 'NGO DARPAN ID',
                type: 'text',
                required: false,
                tooltip: 'Unique ID issued by NITI Aayog for registered NGOs',
                placeholder: 'e.g., MH/2012/0012345'
            },
            {
                id: 'amount-approved',
                label: 'Amount Approved (₹)',
                type: 'number',
                required: true,
                tooltip: 'Total project budget approved by CSR Committee',
                placeholder: 'e.g., 5000000',
                min: 0
            },
            {
                id: 'amount-disbursed',
                label: 'Amount Disbursed (₹)',
                type: 'number',
                required: true,
                tooltip: 'Funds transferred to implementing agency',
                placeholder: 'e.g., 5000000',
                min: 0
            },
            {
                id: 'amount-spent',
                label: 'Amount Spent (₹)',
                type: 'number',
                required: true,
                tooltip: 'Actual expenditure incurred by implementing agency',
                placeholder: 'e.g., 4800000',
                min: 0
            },
            {
                id: 'amount-unspent',
                label: 'Amount Unspent (₹)',
                type: 'number',
                required: false,
                tooltip: 'Auto-calculated: Approved - Spent',
                autoCalculate: true,
                formula: (values) => (values['amount-approved'] || 0) - (values['amount-spent'] || 0),
                readOnly: true
            },
            {
                id: 'beneficiaries',
                label: 'Number of Beneficiaries',
                type: 'number',
                required: true,
                tooltip: 'Direct beneficiaries impacted by the project',
                placeholder: 'e.g., 5000',
                min: 1
            },
            {
                id: 'schedule-vii-category',
                label: 'Schedule VII Category',
                type: 'select',
                required: true,
                tooltip: 'CSR activity as per Schedule VII of Companies Act 2013',
                options: [
                    '(i) Eradicating hunger, poverty and malnutrition',
                    '(ii) Promoting education',
                    '(iii) Promoting gender equality',
                    '(iv) Environmental sustainability',
                    '(v) National heritage protection',
                    '(vi) Armed forces veterans welfare',
                    '(vii) Training to promote sports',
                    '(viii) Rural development',
                    '(ix) Slum area development',
                    '(x) Disaster management'
                ]
            }
        ]
    },

    'board-report-csr': {
        documentName: "Board's Report – CSR Section",
        fields: [
            {
                id: 'financial-year',
                label: 'Financial Year',
                type: 'select',
                required: true,
                tooltip: 'FY for which Board Report is being prepared',
                options: ['FY 2024-25', 'FY 2023-24', 'FY 2022-23']
            },
            {
                id: 'csr-committee-members',
                label: 'CSR Committee Members',
                type: 'repeatable',
                required: true,
                tooltip: 'Board members constituting the CSR Committee',
                subFields: [
                    { id: 'member-name', label: 'Member Name', type: 'text', required: true },
                    { id: 'member-din', label: 'DIN', type: 'text', required: true, pattern: '[0-9]{8}' }
                ]
            },
            {
                id: 'csr-policy-url',
                label: 'CSR Policy URL',
                type: 'url',
                required: true,
                tooltip: 'Website link where CSR policy is disclosed (Section 135(5)(d))',
                placeholder: 'https://company.com/csr-policy.pdf'
            },
            {
                id: 'total-csr-obligation',
                label: 'Total CSR Obligation (₹)',
                type: 'number',
                required: true,
                tooltip: '2% of average net profit',
                min: 0
            },
            {
                id: 'amount-spent-fy',
                label: 'Amount Spent During FY (₹)',
                type: 'number',
                required: true,
                tooltip: 'Total CSR expenditure in the financial year',
                min: 0
            },
            {
                id: 'amount-unspent-fy',
                label: 'Amount Unspent (₹)',
                type: 'number',
                required: false,
                tooltip: 'Auto-calculated: Obligation - Spent',
                autoCalculate: true,
                formula: (values) => (values['total-csr-obligation'] || 0) - (values['amount-spent-fy'] || 0),
                readOnly: true
            },
            {
                id: 'reason-unspent',
                label: 'Reason for Unspent Amount',
                type: 'textarea',
                required: false,
                tooltip: 'Required if unspent amount > 0 (Rule 10)',
                conditional: (values) => (values['amount-unspent-fy'] || 0) > 0,
                placeholder: 'Explain why CSR budget was not fully utilized'
            },
            {
                id: 'impact-assessment-applicable',
                label: 'Impact Assessment Applicable',
                type: 'radio',
                required: true,
                tooltip: 'Required for projects with outlay ≥ ₹1 crore and duration ≥ 1 year',
                options: ['Yes', 'No']
            }
        ]
    },

    'schedule-vii-mapping': {
        documentName: 'Schedule VII Activity Mapping Note',
        fields: [
            {
                id: 'project-name',
                label: 'Project Name',
                type: 'text',
                required: true,
                tooltip: 'Name of the CSR project',
                placeholder: 'e.g., Skill Development Program'
            },
            {
                id: 'project-description',
                label: 'Project Description',
                type: 'textarea',
                required: true,
                tooltip: 'Brief overview of project objectives and activities',
                rows: 4
            },
            {
                id: 'schedule-vii-category',
                label: 'Schedule VII Category',
                type: 'select',
                required: true,
                tooltip: 'Primary Schedule VII category',
                options: [
                    '(i) Eradicating hunger, poverty and malnutrition',
                    '(ii) Promoting education',
                    '(iv) Environmental sustainability',
                    '(viii) Rural development'
                ]
            },
            {
                id: 'schedule-vii-subcategory',
                label: 'Sub-category',
                type: 'text',
                required: false,
                tooltip: 'Specific sub-category if applicable',
                placeholder: 'e.g., Vocational Training'
            },
            {
                id: 'target-beneficiary-group',
                label: 'Target Beneficiary Group',
                type: 'checkbox-group',
                required: true,
                tooltip: 'Select all applicable beneficiary categories',
                options: ['Children', 'Women', 'Elderly', 'Differently-abled', 'SC/ST', 'OBC', 'EWS']
            },
            {
                id: 'project-geography',
                label: 'Project Geography',
                type: 'text',
                required: true,
                tooltip: 'States/Districts where project operates',
                placeholder: 'e.g., Maharashtra (Pune, Nashik)'
            }
        ]
    },

    'unspent-csr-reason': {
        documentName: 'Reasons for Unspent CSR Amount',
        fields: [
            {
                id: 'financial-year',
                label: 'Financial Year',
                type: 'select',
                required: true,
                options: ['FY 2024-25', 'FY 2023-24']
            },
            {
                id: 'total-csr-obligation',
                label: 'Total CSR Obligation (₹)',
                type: 'number',
                required: true,
                min: 0
            },
            {
                id: 'amount-spent',
                label: 'Amount Spent (₹)',
                type: 'number',
                required: true,
                min: 0
            },
            {
                id: 'unspent-amount',
                label: 'Unspent Amount (₹)',
                type: 'number',
                required: false,
                autoCalculate: true,
                formula: (values) => (values['total-csr-obligation'] || 0) - (values['amount-spent'] || 0),
                readOnly: true
            },
            {
                id: 'nature-of-project',
                label: 'Nature of Project',
                type: 'radio',
                required: true,
                tooltip: 'Ongoing projects have multi-year implementation timelines',
                options: ['Ongoing', 'Non-Ongoing']
            },
            {
                id: 'reason-for-unspent',
                label: 'Reason for Unspent Amount',
                type: 'select',
                required: true,
                tooltip: 'Select primary reason per Rule 10',
                options: [
                    'Ongoing Project - Multi-year implementation',
                    'Project Delay due to COVID-19',
                    'Regulatory Approval Pending',
                    'NGO Capacity Constraints',
                    'Fund Transfer Delays',
                    'Other (specify)'
                ]
            },
            {
                id: 'action-plan-timeline',
                label: 'Action Plan & Timeline',
                type: 'textarea',
                required: true,
                tooltip: 'Steps to ensure full utilization with timelines',
                rows: 4,
                placeholder: 'Describe action plan and expected completion date'
            }
        ]
    },

    // Adding more document schemas...
    'activity-output-report': {
        documentName: 'Activity-wise Output Report',
        fields: [
            {
                id: 'activity-name',
                label: 'Activity Name',
                type: 'text',
                required: true
            },
            {
                id: 'output-indicator',
                label: 'Output Indicator',
                type: 'text',
                required: true,
                tooltip: 'Measurable output metric (e.g., students trained, wells constructed)'
            },
            {
                id: 'target-output',
                label: 'Target Output',
                type: 'number',
                required: true,
                min: 0
            },
            {
                id: 'achieved-output',
                label: 'Achieved Output',
                type: 'number',
                required: true,
                min: 0
            },
            {
                id: 'activity-start-date',
                label: 'Activity Start Date',
                type: 'date',
                required: true
            },
            {
                id: 'activity-end-date',
                label: 'Activity End Date',
                type: 'date',
                required: true
            },
            {
                id: 'remarks',
                label: 'Remarks',
                type: 'textarea',
                required: false,
                rows: 3
            }
        ]
    },

    'geo-tagged-evidence': {
        documentName: 'Photographs / Geo-tagged Evidence',
        fields: [
            {
                id: 'project-name',
                label: 'Project Name',
                type: 'text',
                required: true
            },
            {
                id: 'activity-name',
                label: 'Activity Name',
                type: 'text',
                required: true
            },
            {
                id: 'photo-uploads',
                label: 'Photo Upload (Multiple)',
                type: 'file-multiple',
                required: true,
                accept: 'image/*',
                tooltip: 'Upload JPG/PNG with EXIF data for geo-tagging'
            },
            {
                id: 'geo-tag-enabled',
                label: 'Geo-tag Enabled',
                type: 'radio',
                required: true,
                options: ['Yes', 'No']
            },
            {
                id: 'activity-date',
                label: 'Activity Date',
                type: 'date',
                required: true
            },
            {
                id: 'location',
                label: 'Location',
                type: 'text',
                required: true,
                placeholder: 'Village, District, State'
            },
            {
                id: 'short-description',
                label: 'Short Description',
                type: 'textarea',
                required: true,
                rows: 2,
                maxLength: 200
            }
        ]
    }

    // Continue with remaining schemas in similar format...
};

// Helper to check if all required fields are filled
export function getDocumentStatus(documentId, formData = {}) {
    const schema = DOCUMENT_INPUT_SCHEMAS[documentId];
    if (!schema) return 'unknown';

    const requiredFields = schema.fields.filter(f => {
        if (!f.required) return false;
        if (f.conditional && !f.conditional(formData)) return false;
        return true;
    });

    const filledFields = requiredFields.filter(f => {
        return formData[f.id] !== undefined && formData[f.id] !== '' && formData[f.id] !== null;
    });

    return filledFields.length === requiredFields.length ? 'ready' : 'needs-inputs';
}

// Common fields that auto-fill across documents
export const COMMON_FIELD_MAPPINGS = {
    'financial-year': 'financial-year',
    'cin': 'cin',
    'company-name': 'company-name',
    'project-name': 'project-name',
    'csr-obligation': ['total-csr-obligation', 'csr-obligation'],
    'schedule-vii-category': 'schedule-vii-category'
};
