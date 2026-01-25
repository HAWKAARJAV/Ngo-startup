const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Start seeding CorpoGN with comprehensive demo data...')
    console.log('═══════════════════════════════════════════════════════════════')

    // 1. Cleanup existing data (order matters for foreign keys)
    console.log('\n🧹 Cleaning up existing data...')
    await prisma.chatMessage.deleteMany()
    await prisma.chatRoom.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.documentRequest.deleteMany()
    await prisma.donation.deleteMany()
    await prisma.tranche.deleteMany()
    await prisma.projectComplianceDoc.deleteMany()
    await prisma.project.deleteMany()
    await prisma.complianceDoc.deleteMany()
    await prisma.complianceLog.deleteMany()
    await prisma.documentUpload.deleteMany()
    await prisma.nGO.deleteMany()
    await prisma.corporate.deleteMany()
    await prisma.opportunity.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ Database cleaned successfully!')

    // ═══════════════════════════════════════════════════════════════
    // 2. CREATE CORPORATE USERS (Multiple for demo)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🏢 Creating Corporate Users...')
    
    const corporatesData = [
        {
            email: 'csr@techgiant.com',
            name: 'Rajesh Kumar',
            company: 'Tech Giant India Pvt Ltd',
            industry: 'Technology',
            csrBudget: 50000000,
            mandateAreas: 'Education, Healthcare, Environment',
            password: 'corporate123'
        },
        {
            email: 'csr@reliancefoundation.org',
            name: 'Priya Sharma',
            company: 'Reliance Foundation',
            industry: 'Conglomerate',
            csrBudget: 200000000,
            mandateAreas: 'Education, Healthcare, Rural Development, Sports',
            password: 'corporate123'
        },
        {
            email: 'csr@tatasteel.com',
            name: 'Amit Verma',
            company: 'Tata Steel CSR',
            industry: 'Manufacturing',
            csrBudget: 80000000,
            mandateAreas: 'Education, Livelihood, Environment',
            password: 'corporate123'
        }
    ];

    const createdCorporates = [];
    for (const corp of corporatesData) {
        const user = await prisma.user.create({
            data: {
                email: corp.email,
                name: corp.name,
                role: 'CORPORATE',
                corporateProfile: {
                    create: {
                        companyName: corp.company,
                        industry: corp.industry,
                        csrBudget: corp.csrBudget,
                        mandateAreas: corp.mandateAreas,
                    }
                }
            },
            include: { corporateProfile: true }
        });
        createdCorporates.push(user);
        console.log(`   ✅ Created Corporate: ${corp.company}`);
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. CREATE ADMIN USER
    // ═══════════════════════════════════════════════════════════════
    console.log('\n👨‍💼 Creating Admin User...')
    await prisma.user.create({
        data: {
            email: 'admin@ngoconnect.com',
            name: 'Super Admin',
            role: 'ADMIN',
        }
    });
    console.log('   ✅ Created Admin: admin@ngoconnect.com');

    // ═══════════════════════════════════════════════════════════════
    // 4. CREATE FEATURED NGOs (Demo NGOs with complete data)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🏛️ Creating Featured NGOs with Full Demo Data...')

    // 2. HIGH-CREDIBILITY CHAMPIONS (Keep these for top-tier display)
    const champions = [
        {
            email: 'info@deepalaya.org',
            name: 'Deepalaya',
            orgName: 'Deepalaya',
            registrationNo: 'S/10323/1979',
            city: 'New Delhi',
            state: 'Delhi',
            mission: 'Empowering children and women through education and health since 1979.',
            is12AVerified: true,
            is80GVerified: true,
            fcraStatus: true,
            trustScore: 99,
            projects: [{
                title: 'Education for Slum Children',
                description: 'Quality education for 5,000+ underprivileged children in South Delhi.',
                targetAmount: 8000000,
                raisedAmount: 5200000,
                location: 'Okhla, Delhi',
                sector: 'Education',
                status: 'ACTIVE',
            }]
        },
        {
            email: 'contact@smilefoundation.org',
            name: 'Smile Foundation',
            orgName: 'Smile Foundation',
            registrationNo: 'E/2002/Delhi',
            city: 'New Delhi',
            state: 'Delhi',
            mission: 'Education, healthcare ("Smile on Wheels"), and livelihood programs.',
            is12AVerified: true,
            is80GVerified: true,
            fcraStatus: true,
            trustScore: 98,
            projects: [{
                title: 'Smile on Wheels Mobile Healthcare',
                description: 'Mobile hospital providing doorstep primary healthcare to slums.',
                targetAmount: 6000000,
                raisedAmount: 4800000,
                location: 'Delhi NCR',
                sector: 'Healthcare',
                status: 'ACTIVE',
            }]
        },
        {
            email: 'info@goonj.org',
            name: 'Goonj',
            orgName: 'Goonj',
            registrationNo: 'S/29876/1999',
            city: 'New Delhi',
            state: 'Delhi',
            mission: 'Disaster relief and circular economy (Cloth for Work).',
            is12AVerified: true,
            is80GVerified: true,
            fcraStatus: true,
            trustScore: 99,
            projects: [{
                title: 'Rahat: Disaster Relief',
                description: 'Immediate relief kits for flood-affected families.',
                targetAmount: 15000000,
                raisedAmount: 14200000,
                location: 'Pan-India',
                sector: 'Disaster Relief',
                status: 'ACTIVE',
            }]
        }
    ]

    // 3. DELHI MINORITIES COMMISSION LIST (50+ Entries)
    // Processed from user provided official list. Emails synthesized where missing.
    const dmcList = [
        { name: "Sadik Masih Medical Social Servant Society", reg: "DMC-001", city: "Delhi", area: "Vasundhara Enclave" },
        { name: "Christian Social Welfare Trust", reg: "DMC-002", city: "Delhi", area: "I.P. Extn.", email: "cswt2014@gmail.com" },
        { name: "Blue Birds Social Welfare Society", reg: "DMC-003", city: "Delhi", area: "Mayur Vihar" },
        { name: "Ganga Social Foundation", reg: "DMC-004", city: "Delhi", area: "Gokulpuri" },
        { name: "Swadeshi Movement Foundation", reg: "DMC-005", city: "Delhi", area: "Patparganj" },
        { name: "Samanvit Shiksha Sansthan", reg: "DMC-006", city: "Delhi", area: "Shahdara" },
        { name: "Sustainable Development Foundation", reg: "DMC-007", city: "Delhi", area: "Dwarka" },
        { name: "AVN College of Management & Technology", reg: "DMC-008", city: "Delhi", area: "Dwarka" },
        { name: "Novlok Welfare Society", reg: "DMC-009", city: "New Delhi", area: "Uttam Nagar" },
        { name: "Aident Social Welfare Organization", reg: "DMC-010", city: "Delhi", area: "Gazipur" },
        { name: "Youth Track Society for Education", reg: "DMC-011", city: "New Delhi", area: "Tilak Nagar" },
        { name: "Nari Jagrati Ki Ore", reg: "DMC-012", city: "Delhi", area: "Peera Garhi" },
        { name: "Al Hind Youva Sangh", reg: "DMC-013", city: "Delhi", area: "Kirari Nangloi" },
        { name: "Noble Cause Social & Health Care", reg: "DMC-014", city: "New Delhi", area: "Devli Village" },
        { name: "PURN Foundation", reg: "DMC-015", city: "Delhi", area: "Hari Nagar" },
        { name: "Sur Nirman Educational Society", reg: "DMC-016", city: "New Delhi", area: "Bahadur Shah Zafar Marg" },
        { name: "Mahilayen Pragati Ki Ore", reg: "DMC-017", city: "New Delhi", area: "Tilak Nagar" },
        { name: "Guru Daani Foundation", reg: "DMC-018", city: "New Delhi", area: "Vishnu Garden" },
        { name: "Mother of Life Trust", reg: "DMC-019", city: "Delhi", area: "Shastri Park" },
        { name: "Parivartan Sandesh", reg: "DMC-020", city: "New Delhi", area: "Subhash Nagar" },
        { name: "Misbah", reg: "DMC-021", city: "New Delhi", area: "Madanpur Khadar" },
        { name: "Samrasta Foundation", reg: "DMC-022", city: "Delhi", area: "Shahdara" },
        { name: "Rama Devi Association", reg: "DMC-023", city: "Delhi", area: "Sonia Vihar" },
        { name: "Saraswati Educational Society", reg: "DMC-024", city: "Delhi", area: "Laxmi Nagar" },
        { name: "Women Self Help Groups Federation", reg: "DMC-025", city: "Delhi", area: "Nand Nagri" },
        { name: "Society For Social Welfare", reg: "DMC-026", city: "Delhi", area: "Khichripur" },
        { name: "Ek Ehsaas Foundation", reg: "DMC-027", city: "Delhi", area: "Model Town" },
        { name: "Sawjan", reg: "DMC-028", city: "Delhi", area: "Burari" },
        { name: "Jamia Islamia Delhi", reg: "DMC-029", city: "Delhi", area: "Maujpur" },
        { name: "Dr. Abdul Kalam Social Welfare Trust", reg: "DMC-030", city: "Delhi", area: "Mustafabad" },
        { name: "Right Way Women & Children Welfare", reg: "DMC-031", city: "Delhi", area: "Jafrabad" },
        { name: "Welfare Association For Handicapped", reg: "DMC-032", city: "Delhi", area: "Khichripur" },
        { name: "Sakaar Outreach", reg: "DMC-033", city: "New Delhi", area: "Chittaranjan Park" },
        { name: "Sai Kripa Seva Sansthan", reg: "DMC-034", city: "New Delhi", area: "Mahipalpur" },
        { name: "Society For Promotion Of Women", reg: "DMC-035", city: "New Delhi", area: "Dwarka" },
        { name: "Viklang Sahara Samiti Delhi", reg: "DMC-036", city: "New Delhi", area: "Mangolpuri" },
        { name: "Women and Rural Development", reg: "DMC-037", city: "New Delhi", area: "Uttam Nagar" },
        { name: "S.K. Foundation", reg: "DMC-038", city: "Delhi", area: "Bawana" },
        { name: "Lajwanti Welfare Society", reg: "DMC-039", city: "Delhi", area: "Geeta Colony" },
        { name: "Family of Shirdi Sai Baba", reg: "DMC-040", city: "New Delhi", area: "Sultanpuri" },
        { name: "Kriti Foundation", reg: "DMC-041", city: "New Delhi", area: "Dwarka" },
        { name: "Aashalata Victoria Charitable Trust", reg: "DMC-042", city: "New Delhi", area: "Saket" },
        { name: "Safe Approach for Social Hazard", reg: "DMC-043", city: "New Delhi", area: "Bhagwati Garden" },
        { name: "Nisha Social Welfare Society", reg: "DMC-044", city: "Delhi", area: "Bawana" },
        { name: "Gurudwara Hargobindsar Trust", reg: "DMC-045", city: "Delhi", area: "Nangli Poona" },
        { name: "Shiksha Jyoti Foundation", reg: "DMC-046", city: "Delhi", area: "Sunder Nagri" },
        { name: "Shiksha Abhiyan", reg: "DMC-047", city: "New Delhi", area: "Chanakya Place" },
        { name: "Janhit", reg: "DMC-048", city: "Delhi", area: "Sunder Nagar" },
        { name: "Samkalp Education Foundation", reg: "DMC-049", city: "New Delhi", area: "Burari" },
        { name: "Maa Astha Samajik Vikas", reg: "DMC-050", city: "New Delhi", area: "Mahipalpur" },
        { name: "Dagar Rural Development", reg: "DMC-051", city: "Delhi", area: "Vasundhra Enclave" },
        { name: "Aasra Al Hind Educational", reg: "DMC-052", city: "New Delhi", area: "Khyala" }
    ]

    const allNGOs = [...champions]

    // Helper to generate a realistic project based on area
    const getProjectForNGO = (ngoName, area) => {
        const sectors = [
            { title: "Vocational Training", desc: "Skill development for youth", type: "Education", amt: 1200000 },
            { title: "Community Health Camp", desc: "Free medical checkups for Slum dwellers", type: "Healthcare", amt: 500000 },
            { title: "Safe Drinking Water", desc: "Installing RO plants in community centers", type: "Healthcare", amt: 800000 },
            { title: "Women's Self Help Group", desc: "Micro-finance and livelihood training", type: "Livelihood", amt: 1500000 },
            { title: "Digital Literacy Drive", desc: "Computer education for underprivileged kids", type: "Education", amt: 1000000 },
            { title: "Winter Relief Distribution", desc: "Blanket and clothing distribution", type: "Disaster Relief", amt: 400000 }
        ];

        // Pick random sector
        const sector = sectors[Math.floor(Math.random() * sectors.length)];

        return {
            title: `${sector.title} in ${area}`,
            description: `${sector.desc} organized by ${ngoName}. Targeting 500+ beneficiaries in the ${area} locality.`,
            targetAmount: sector.amt,
            raisedAmount: Math.floor(Math.random() * (sector.amt * 0.8)), // Random raised amount
            location: `${area}, Delhi`,
            sector: sector.type,
            status: 'ACTIVE',
        };
    };

    // Convert DMC List to Full Objects
    dmcList.forEach(ngo => {
        // Generate synthetic email if missing
        const sanitizedName = ngo.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        const email = ngo.email || `contact@${sanitizedName}.org.in`

        // Generate 1 or 2 random projects per NGO
        const numProjects = Math.random() > 0.6 ? 2 : 1;
        const projects = [];
        for (let i = 0; i < numProjects; i++) {
            projects.push(getProjectForNGO(ngo.name, ngo.area));
        }

        allNGOs.push({
            email: email,
            name: ngo.name,
            orgName: ngo.name,
            registrationNo: ngo.reg,
            city: ngo.city,
            state: "Delhi",
            mission: `Registered social welfare organization operating in ${ngo.area}, focusing on community development.`,
            is12AVerified: true, // Assuming DMC verification implies some level of validity
            is80GVerified: false,
            fcraStatus: false,
            trustScore: 80 + Math.floor(Math.random() * 10), // Random score 80-90 for these valid NGOs
            projects: projects
        })
    })

    console.log(`📝 Creating ${allNGOs.length} total NGO profiles...`)

    const createdNGOs = [];
    for (const data of allNGOs) {
        try {
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    role: 'NGO',
                    ngoProfile: {
                        create: {
                            orgName: data.orgName,
                            registrationNo: data.registrationNo,
                            city: data.city,
                            state: data.state,
                            mission: data.mission,
                            is12AVerified: data.is12AVerified,
                            is80GVerified: data.is80GVerified,
                            fcraStatus: data.fcraStatus,
                            trustScore: data.trustScore,
                            trustBreakdown: data.trustBreakdown,
                            expenseRatio: data.expenseRatio,
                            csr1Number: data.csr1Number,
                            projects: {
                                create: data.projects.map(p => ({
                                    ...p,
                                    tranches: {
                                        create: [
                                            { amount: p.targetAmount * 0.3, unlockCondition: "Project Kickoff", status: "DISBURSED", releaseRequested: false },
                                            { amount: p.targetAmount * 0.3, unlockCondition: "Mid-Term Assessment", status: "LOCKED", releaseRequested: true, proofDocUrl: "https://example.com/uc.pdf" },
                                            { amount: p.targetAmount * 0.4, unlockCondition: "Final Impact Report", status: "LOCKED", releaseRequested: false }
                                        ]
                                    }
                                }))
                            }
                        }
                    }
                },
                include: { ngoProfile: true }
            });
            createdNGOs.push(user);
            console.log(`   ✅ Created NGO: ${data.name} (Trust: ${data.trustScore})`)
        } catch (e) {
            console.log(`   ⚠️ Skipped (likely duplicate): ${data.name}`)
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. CREATE DEMO PROJECTS WITH VARIOUS STATUSES
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📊 Creating Demo Projects with Various Statuses...')

    // Get Smile Foundation for demo projects
    const smileNGO = await prisma.nGO.findFirst({
        where: { orgName: 'Smile Foundation' }
    });

    if (smileNGO) {
        // Project 1: COMPLETED Project (for showing success stories)
        const completedProject = await prisma.project.create({
            data: {
                ngoId: smileNGO.id,
                title: 'Girl Child Education Initiative 2024',
                description: 'Successfully provided quality education to 2000 girl children in rural Delhi. Included school supplies, uniforms, and scholarship programs.',
                targetAmount: 5000000,
                raisedAmount: 5000000,
                location: 'Rural Delhi NCR',
                sector: 'Education',
                status: 'COMPLETED',
                tranches: {
                    create: [
                        { amount: 1500000, unlockCondition: "Enrollment Complete", status: "DISBURSED", releaseRequested: false },
                        { amount: 1500000, unlockCondition: "Mid-Year Assessment", status: "DISBURSED", releaseRequested: false },
                        { amount: 2000000, unlockCondition: "Annual Report Submitted", status: "DISBURSED", releaseRequested: false }
                    ]
                }
            }
        });
        console.log('   ✅ Created COMPLETED project: Girl Child Education Initiative 2024');

        // Project 2: ACTIVE with PENDING Tranche Release Request
        const activeProjectWithPending = await prisma.project.create({
            data: {
                ngoId: smileNGO.id,
                title: 'Clean Water for Schools',
                description: 'Installing water purification systems in 50 government schools across East Delhi. Each school serves 500+ students.',
                targetAmount: 3000000,
                raisedAmount: 1800000,
                location: 'East Delhi',
                sector: 'Healthcare',
                status: 'ACTIVE',
                tranches: {
                    create: [
                        { amount: 900000, unlockCondition: "Equipment Procurement", status: "DISBURSED", releaseRequested: false },
                        { amount: 900000, unlockCondition: "Installation in 25 Schools", status: "LOCKED", releaseRequested: true, proofDocUrl: "https://storage.ngoconnect.com/proofs/installation-report-jan2026.pdf" },
                        { amount: 1200000, unlockCondition: "All 50 Schools Completed", status: "LOCKED", releaseRequested: false }
                    ]
                }
            }
        });
        console.log('   ✅ Created ACTIVE project with PENDING tranche: Clean Water for Schools');

        // Project 3: PROPOSED (Waiting for approval)
        const proposedProject = await prisma.project.create({
            data: {
                ngoId: smileNGO.id,
                title: 'Digital Literacy for Women',
                description: 'Proposed program to train 1000 women in basic computer skills and digital financial literacy. Targets housewives and domestic workers.',
                targetAmount: 2500000,
                raisedAmount: 0,
                location: 'South Delhi',
                sector: 'Education',
                status: 'PROPOSED',
                tranches: {
                    create: [
                        { amount: 750000, unlockCondition: "Training Center Setup", status: "LOCKED", releaseRequested: false },
                        { amount: 875000, unlockCondition: "500 Women Trained", status: "LOCKED", releaseRequested: false },
                        { amount: 875000, unlockCondition: "Program Completion", status: "LOCKED", releaseRequested: false }
                    ]
                }
            }
        });
        console.log('   ✅ Created PROPOSED project: Digital Literacy for Women');
    }

    // Get Goonj for more demo projects
    const goonjNGO = await prisma.nGO.findFirst({
        where: { orgName: 'Goonj' }
    });

    if (goonjNGO) {
        // Project with multiple pending tranches
        const multiTrancheProject = await prisma.project.create({
            data: {
                ngoId: goonjNGO.id,
                title: 'Flood Relief Bihar 2026',
                description: 'Emergency relief operations for flood-affected families in Bihar. Providing food kits, clothing, and temporary shelter materials.',
                targetAmount: 10000000,
                raisedAmount: 7000000,
                location: 'Bihar',
                sector: 'Disaster Relief',
                status: 'ACTIVE',
                tranches: {
                    create: [
                        { amount: 2500000, unlockCondition: "Emergency Response Phase", status: "DISBURSED", releaseRequested: false },
                        { amount: 2500000, unlockCondition: "Relief Distribution Phase 1", status: "DISBURSED", releaseRequested: false },
                        { amount: 2500000, unlockCondition: "Relief Distribution Phase 2", status: "LOCKED", releaseRequested: true, proofDocUrl: "https://storage.ngoconnect.com/proofs/bihar-relief-phase2.pdf" },
                        { amount: 2500000, unlockCondition: "Rehabilitation Support", status: "LOCKED", releaseRequested: false }
                    ]
                }
            }
        });
        console.log('   ✅ Created ACTIVE disaster relief project: Flood Relief Bihar 2026');
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. CREATE COMPLIANCE DOCUMENTS FOR NGOs
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📄 Creating Compliance Documents...')

    if (smileNGO) {
        const complianceDocs = [
            { docType: '12A_CERTIFICATE', url: 'https://storage.ngoconnect.com/docs/smile-12a.pdf', status: 'VERIFIED' },
            { docType: '80G_CERTIFICATE', url: 'https://storage.ngoconnect.com/docs/smile-80g.pdf', status: 'VERIFIED' },
            { docType: 'FCRA_CERTIFICATE', url: 'https://storage.ngoconnect.com/docs/smile-fcra.pdf', status: 'VERIFIED' },
            { docType: 'PAN_CARD', url: 'https://storage.ngoconnect.com/docs/smile-pan.pdf', status: 'VERIFIED' },
            { docType: 'ANNUAL_REPORT', url: 'https://storage.ngoconnect.com/docs/smile-annual-2024.pdf', status: 'VERIFIED' },
            { docType: 'AUDIT_REPORT', url: 'https://storage.ngoconnect.com/docs/placeholder.pdf', status: 'PENDING' },
            { docType: 'BOARD_RESOLUTION', url: 'https://storage.ngoconnect.com/docs/placeholder.pdf', status: 'PENDING' }
        ];

        for (const doc of complianceDocs) {
            await prisma.complianceDoc.create({
                data: {
                    ngoId: smileNGO.id,
                    docType: doc.docType,
                    url: doc.url,
                    status: doc.status
                }
            });
        }
        console.log('   ✅ Created 7 compliance documents for Smile Foundation');
    }

    // ═══════════════════════════════════════════════════════════════
    // 7. CREATE CHAT ROOMS AND CONVERSATIONS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n💬 Creating Chat Rooms and Conversations...')

    const techGiantCorp = await prisma.corporate.findFirst({
        where: { companyName: 'Tech Giant India Pvt Ltd' }
    });

    const relianceCorp = await prisma.corporate.findFirst({
        where: { companyName: 'Reliance Foundation' }
    });

    const smileFoundation = await prisma.nGO.findFirst({
        where: { orgName: 'Smile Foundation' }
    });

    const deepalaya = await prisma.nGO.findFirst({
        where: { orgName: 'Deepalaya' }
    });

    // Chat 1: Tech Giant ↔ Smile Foundation (Active conversation)
    if (techGiantCorp && smileFoundation) {
        const chatRoom1 = await prisma.chatRoom.create({
            data: {
                corporateId: techGiantCorp.id,
                ngoId: smileFoundation.id,
                messages: {
                    create: [
                        {
                            senderId: techGiantCorp.userId,
                            senderRole: 'CORPORATE',
                            senderName: 'Tech Giant CSR Team',
                            message: 'Hello Smile Foundation! We reviewed your Smile on Wheels program and are very impressed. We would like to discuss a potential CSR partnership.',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-15T10:00:00')
                        },
                        {
                            senderId: smileFoundation.userId,
                            senderRole: 'NGO',
                            senderName: 'Smile Foundation',
                            message: 'Thank you so much for reaching out! We would be delighted to partner with Tech Giant. Our mobile healthcare units currently serve 5000+ beneficiaries monthly in Delhi NCR.',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-15T10:15:00')
                        },
                        {
                            senderId: techGiantCorp.userId,
                            senderRole: 'CORPORATE',
                            senderName: 'Tech Giant CSR Team',
                            message: 'That\'s excellent! Could you share your latest impact report and financial statements? We need these for our CSR committee review.',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-15T10:30:00')
                        },
                        {
                            senderId: smileFoundation.userId,
                            senderRole: 'NGO',
                            senderName: 'Smile Foundation',
                            message: 'Of course! I\'ll upload them to our compliance section right away. You should have access within the hour. Is there anything else you need?',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-15T11:00:00')
                        },
                        {
                            senderId: techGiantCorp.userId,
                            senderRole: 'CORPORATE',
                            senderName: 'Tech Giant CSR Team',
                            message: 'Perfect! Also, we\'d like to propose funding for a new Clean Water initiative. Can we schedule a video call this week?',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-16T09:00:00')
                        },
                        {
                            senderId: smileFoundation.userId,
                            senderRole: 'NGO',
                            senderName: 'Smile Foundation',
                            message: 'Absolutely! I\'m available Thursday 3 PM or Friday 11 AM. Which works better for your team?',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-16T09:30:00')
                        }
                    ]
                }
            }
        });
        console.log('   ✅ Created chat room: Tech Giant ↔ Smile Foundation (6 messages)');
    }

    // Chat 2: Reliance ↔ Deepalaya
    if (relianceCorp && deepalaya) {
        const chatRoom2 = await prisma.chatRoom.create({
            data: {
                corporateId: relianceCorp.id,
                ngoId: deepalaya.id,
                messages: {
                    create: [
                        {
                            senderId: relianceCorp.userId,
                            senderRole: 'CORPORATE',
                            senderName: 'Reliance Foundation',
                            message: 'Namaste! Reliance Foundation is looking to expand our education initiatives in Delhi. We\'ve heard great things about Deepalaya\'s work.',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-18T14:00:00')
                        },
                        {
                            senderId: deepalaya.userId,
                            senderRole: 'NGO',
                            senderName: 'Deepalaya',
                            message: 'Namaste! Thank you for considering us. We have been working in education since 1979 and currently support 5000+ children in South Delhi.',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-18T14:30:00')
                        }
                    ]
                }
            }
        });
        console.log('   ✅ Created chat room: Reliance ↔ Deepalaya (2 messages)');
    }

    // Chat 3: Tech Giant ↔ Goonj (for disaster relief)
    const goonj = await prisma.nGO.findFirst({
        where: { orgName: 'Goonj' }
    });

    if (techGiantCorp && goonj) {
        const chatRoom3 = await prisma.chatRoom.create({
            data: {
                corporateId: techGiantCorp.id,
                ngoId: goonj.id,
                messages: {
                    create: [
                        {
                            senderId: techGiantCorp.userId,
                            senderRole: 'CORPORATE',
                            senderName: 'Tech Giant CSR Team',
                            message: 'We want to contribute to your Bihar Flood Relief efforts. What\'s the most urgent need right now?',
                            messageType: 'TEXT',
                            createdAt: new Date('2026-01-19T08:00:00')
                        }
                    ]
                }
            }
        });
        console.log('   ✅ Created chat room: Tech Giant ↔ Goonj (1 message)');
    }

    // ═══════════════════════════════════════════════════════════════
    // 8. CREATE DOCUMENT REQUESTS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 Creating Document Requests...')

    if (techGiantCorp && smileFoundation) {
        await prisma.documentRequest.create({
            data: {
                corporateId: techGiantCorp.id,
                ngoId: smileFoundation.id,
                requestType: 'COMPLIANCE_DOC',
                docName: 'Latest Audit Report (2024-25)',
                description: 'Please upload your audited financial statements for FY 2024-25. This is required for our CSR committee approval.',
                priority: 'HIGH',
                status: 'PENDING'
            }
        });

        await prisma.documentRequest.create({
            data: {
                corporateId: techGiantCorp.id,
                ngoId: smileFoundation.id,
                requestType: 'PROJECT_REPORT',
                docName: 'Clean Water Project - Progress Report',
                description: 'Monthly progress report for the Clean Water for Schools initiative.',
                priority: 'MEDIUM',
                status: 'PENDING'
            }
        });

        console.log('   ✅ Created 2 document requests from Tech Giant to Smile Foundation');
    }

    if (relianceCorp && deepalaya) {
        await prisma.documentRequest.create({
            data: {
                corporateId: relianceCorp.id,
                ngoId: deepalaya.id,
                requestType: 'COMPLIANCE_DOC',
                docName: 'FCRA Certificate Copy',
                description: 'Need your FCRA registration certificate for partnership documentation.',
                priority: 'HIGH',
                status: 'PENDING'
            }
        });
        console.log('   ✅ Created 1 document request from Reliance to Deepalaya');
    }

    // ═══════════════════════════════════════════════════════════════
    // 9. CREATE NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🔔 Creating Notifications...')

    // Notifications for Smile Foundation
    if (smileFoundation) {
        const notifications = [
            {
                type: 'NEW_MESSAGE',
                title: 'New Message from Tech Giant',
                message: 'Tech Giant CSR Team sent you a message about the Clean Water initiative.',
                link: '/ngo-portal/chat',
                isRead: false
            },
            {
                type: 'DOCUMENT_REQUEST',
                title: 'Document Requested',
                message: 'Tech Giant India Pvt Ltd has requested: Latest Audit Report (2024-25)',
                link: '/ngo-portal/compliance',
                isRead: false
            },
            {
                type: 'TRANCHE_APPROVED',
                title: 'Tranche Released! 🎉',
                message: 'Your tranche request for "Emergency Response Phase" has been approved. ₹25,00,000 released.',
                link: '/ngo-portal/projects',
                isRead: true
            },
            {
                type: 'PARTNERSHIP_INTEREST',
                title: 'New Partnership Interest',
                message: 'Reliance Foundation has shown interest in your Education programs.',
                link: '/ngo-portal/chat',
                isRead: false
            }
        ];

        for (const notif of notifications) {
            await prisma.notification.create({
                data: {
                    userId: smileFoundation.userId,
                    userRole: 'NGO',
                    ...notif
                }
            });
        }
        console.log('   ✅ Created 4 notifications for Smile Foundation');
    }

    // Notifications for Tech Giant
    if (techGiantCorp) {
        const corpNotifications = [
            {
                type: 'TRANCHE_REQUEST',
                title: 'Tranche Release Requested',
                message: 'Smile Foundation has requested release of Tranche 2 for Clean Water project. Review required.',
                link: '/dashboard/projects',
                isRead: false
            },
            {
                type: 'NEW_MESSAGE',
                title: 'Reply from Smile Foundation',
                message: 'Smile Foundation replied to your message.',
                link: '/dashboard/chat',
                isRead: true
            },
            {
                type: 'DOCUMENT_UPLOADED',
                title: 'Document Uploaded',
                message: 'Smile Foundation uploaded: Annual Report 2024-25',
                link: '/dashboard/projects',
                isRead: false
            }
        ];

        for (const notif of corpNotifications) {
            await prisma.notification.create({
                data: {
                    userId: techGiantCorp.userId,
                    userRole: 'CORPORATE',
                    ...notif
                }
            });
        }
        console.log('   ✅ Created 3 notifications for Tech Giant');
    }

    // ═══════════════════════════════════════════════════════════════
    // 10. CREATE DONATIONS (for financial tracking)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n💰 Creating Donation Records...')

    // Find some projects to link donations
    const smileProjects = await prisma.project.findMany({
        where: { ngo: { orgName: 'Smile Foundation' } }
    });

    if (techGiantCorp && smileProjects.length > 0) {
        await prisma.donation.create({
            data: {
                corporateId: techGiantCorp.id,
                projectId: smileProjects[0].id,
                amount: 3000000
            }
        });
        console.log('   ✅ Created donation: Tech Giant → Smile Foundation (₹30,00,000)');
    }

    // ═══════════════════════════════════════════════════════════════
    // SEEDING COMPLETE - SUMMARY
    // ═══════════════════════════════════════════════════════════════
    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('🎉 SEEDING COMPLETE! Demo Data Summary:')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('👥 Users:')
    console.log('   • 3 Corporate Users (Tech Giant, Reliance, Tata Steel)')
    console.log('   • 55 NGO Users (3 Featured + 52 Delhi-based)')
    console.log('   • 1 Admin User')
    console.log('')
    console.log('📊 Projects:')
    console.log('   • Multiple ACTIVE projects with tranches')
    console.log('   • COMPLETED projects (success stories)')
    console.log('   • PROPOSED projects (pending approval)')
    console.log('   • Projects with PENDING tranche release requests')
    console.log('')
    console.log('💬 Communications:')
    console.log('   • 3 Active chat rooms with message history')
    console.log('   • Document requests between corporates and NGOs')
    console.log('   • Notifications for both parties')
    console.log('')
    console.log('🔑 TEST CREDENTIALS:')
    console.log('   Corporate: csr@techgiant.com (any password)')
    console.log('   NGO: contact@smilefoundation.org (any password)')
    console.log('   Admin: admin@ngoconnect.com (any password)')
    console.log('═══════════════════════════════════════════════════════════════')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
