# Database Setup Guide - CorpoGN

## 🗄️ Real Delhi-NCR NGO Data Integration

Your CorpoGN platform now includes **real, verified NGO data** from Delhi and NCR region!

### 📊 What's Included in the Seed Data:

#### High-Credibility Verified NGOs (10)
1. **Salaam Baalak Trust** - Street children welfare (Trust Score: 98)
2. **Bal Raksha Bharat** - Child rights & nutrition (Trust Score: 97)
3. **Katha** - Urban literacy & education (Trust Score: 96)
4. **Goonj** - Disaster relief & development (Trust Score: 99)
5. **Navjyoti India Foundation** - Youth empowerment (Trust Score: 95)
6. **Pratham Education Foundation** - Pan-India education (Trust Score: 98)
7. **Akshaya Patra** - Mid-day meal program (Trust Score: 99)
8. Plus 8+ Delhi Minorities Commission verified NGOs

#### Corporate Partners (4)
- Tata Consultancy Services (₹5 Cr budget)
- Reliance Foundation (₹10 Cr budget)
- Infosys Foundation (₹7.5 Cr budget)
- Wipro Limited (₹4.5 Cr budget)

### 🚀 Setup Instructions:

#### Step 1: Configure Database Connection

Create a `.env` file in your project root:

```env
# Database Connection (Supabase PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME"

# Example for Supabase:
# DATABASE_URL="postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres"

# Optional: Direct database URL for migrations
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME"
```

#### Step 2: Run Prisma Migrations

This creates all the tables based on your schema:

```bash
npx prisma migrate dev --name init
```

#### Step 3: Seed the Database with Real NGO Data

```bash
npx prisma db seed
```

You should see output like:

```
🌱 Start seeding with REAL Delhi-NCR NGO data...
✅ Cleaned up database.
📝 Creating 16 verified NGO profiles...
   ✅ Created NGO: Salaam Baalak Trust (Trust Score: 98)
   ✅ Created NGO: Bal Raksha Bharat (Trust Score: 97)
   ...
🏢 Creating 4 corporate profiles...
   ✅ Created Corporate: Tata Consultancy Services CSR
   ...

📊 ===== SEED SUMMARY =====
   Total NGOs Created: 16
   12A Verified: 16
   80G Verified: 12
   FCRA Compliant: 5
   Active Projects: 14
   Corporate Partners: 4
============================
✅ Seeding completed successfully!
```

#### Step 4: Explore the Database (Optional)

Open Prisma Studio to view your data:

```bash
npx prisma studio
```

This opens a browser UI at `http://localhost:5555` where you can:
- View all NGOs, Corporates, Projects
- Edit data manually
- Test queries

### 📁 Database Schema Overview:

```
User (Authentication)
├── NGO Profile
│   ├── Projects
│   ├── Compliance Documents
│   └── Tranches
└── Corporate Profile
    └── Donations

Projects
├── Tranches (milestone-based funding)
└── Donations (corporate contributions)
```

### 🔍 Key Features in Seed Data:

**✅ Real NGOs from:**
- Delhi Minorities Commission (Government verified)
- High-credibility national NGOs (Goonj, Pratham, etc.)

**✅ All NGOs include:**
- Registration numbers
- 12A/80G verification status
- FCRA compliance status
- Trust Score (0-100)
- Active projects with funding details
- Complete contact information

**✅ Realistic Project Data:**
- Funding targets (₹15L - ₹2.5Cr)
- Raised amounts
- Sector classification
- Location details

### 🧪 Testing the API:

After seeding, test your NGO search API:

```bash
# Get all NGOs
curl http://localhost:3000/api/ngos

# Search by city
curl http://localhost:3000/api/ngos?q=Delhi

# Search by sector
curl http://localhost:3000/api/ngos?q=education
```

### 🔄 Re-seeding the Database:

If you need to reset and re-seed:

```bash
# Option 1: Using seed script (cleans first)
npx prisma db seed

# Option 2: Full reset (drops all data and re-migrates)
npx prisma migrate reset
```

**⚠️ Warning:** `migrate reset` will delete ALL data permanently!

### 📝 Adding More NGOs:

Edit `/prisma/seed.js` and add to the `verifiedNGOsData` array:

```javascript
{
    email: 'contact@yourngo.org',
    name: 'Your NGO Name',
    orgName: 'Your NGO Full Name',
    registrationNo: 'REG/12345/2020',
    city: 'Delhi',
    state: 'Delhi',
    mission: 'Your mission statement...',
    is12AVerified: true,
    is80GVerified: true,
    fcraStatus: false,
    trustScore: 85,
    projects: [
        {
            title: 'Project Name',
            description: 'Project description...',
            targetAmount: 3000000,
            raisedAmount: 1500000,
            location: 'Delhi',
            sector: 'Education',
            status: 'ACTIVE',
        }
    ]
}
```

Then re-run: `npx prisma db seed`

### 🐛 Troubleshooting:

**Error: "Can't reach database server"**
- Check your `DATABASE_URL` in `.env`
- Verify Supabase/PostgreSQL is running
- Check firewall/network settings

**Error: "prisma:seed command not found"**
Add to your `package.json`:
```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

**Error: "Unique constraint violation"**
- Database already has data
- Run `npx prisma migrate reset` to start fresh

### 📚 Next Steps:

1. ✅ Seed database with real NGO data
2. ✅ Test NGO search on `/dashboard/search`
3. ✅ View NGO profiles in the UI
4. ✅ Test AI chatbot matching
5. ✅ Generate sample CSR reports

### 🔗 Useful Commands:

```bash
# View database schema
npx prisma db pull

# Generate Prisma Client
npx prisma generate

# Format schema file
npx prisma format

# Check migration status
npx prisma migrate status
```

---

**🎉 Your CorpoGN platform is now loaded with real, verified Delhi-NCR NGO data!**

Ready to demo to investors and onboard corporates! 🚀
