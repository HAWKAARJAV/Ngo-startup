const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Start seeding with 50+ Verified Delhi-NCR NGO data...')

    // 1. Cleanup existing data
    await prisma.donation.deleteMany()
    await prisma.tranche.deleteMany()
    await prisma.project.deleteMany()
    await prisma.complianceDoc.deleteMany()
    await prisma.nGO.deleteMany()
    await prisma.corporate.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ Cleaned up database.')

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

    // Convert DMC List to Full Objects
    dmcList.forEach(ngo => {
        // Generate synthetic email if missing
        const sanitizedName = ngo.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        const email = ngo.email || `contact@${sanitizedName}.org.in`

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
            projects: [] // No active projects by default for bulk entries
        })
    })

    console.log(`📝 Creating ${allNGOs.length} total NGO profiles...`)

    for (const data of allNGOs) {
        // Check for duplicate emails in our list to avoid crash (though simplified logic here)
        // Prisma create will fail if duplicate, so we use upsert or just try/catch
        try {
            await prisma.user.create({
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
                            projects: {
                                create: data.projects
                            }
                        }
                    }
                }
            })
            console.log(`   ✅ Created NGO: ${data.name} (Trust: ${data.trustScore})`)
        } catch (e) {
            console.log(`   ⚠️ Skipped (likely duplicate): ${data.name}`)
        }
    }

    // 4. Create Corporate User
    await prisma.user.create({
        data: {
            email: 'csr@techgiant.com',
            name: 'Tech Giant CSR',
            role: 'CORPORATE',
            corporateProfile: {
                create: {
                    companyName: 'Tech Giant India Pvt Ltd',
                    industry: 'Technology',
                    csrBudget: 50000000,
                    mandateAreas: 'Education, Healthcare, Environment',
                }
            }
        }
    })
    console.log(`Created Corporate: Tech Giant CSR`)

    console.log('Seeding finished.')
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
