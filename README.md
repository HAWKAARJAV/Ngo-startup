# NGO Connect - The Operating System for CSR Impact 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Transforming Corporate Social Responsibility from "Good Faith" to "Good Governance"**

NGO Connect is India's first AI-powered CSR compliance and impact measurement platform that automates NGO verification, tracks fund disbursement in real-time, and generates board-ready reports — all while ensuring 100% regulatory compliance.

---

## 🎯 The Problem

Corporate India spends **₹30,000+ Crores** annually on CSR, yet:

- **60% of NGOs** lack proper 12A/80G documentation
- **Corporates face penalties** due to incomplete compliance reporting
- **Zero visibility** into fund utilization post-disbursal
- **Manual verification** of NGOs takes 2-3 weeks minimum
- **Board reporting** requires aggregating data from 15+ spreadsheets

**The result?** Genuine NGOs struggle to get funding, and corporates can't prove impact to stakeholders.

---

## 💡 Our Solution

NGO Connect is a **SaaS platform** that connects verified NGOs with corporate funders through:

### For Corporates
✅ **Automated NGO Verification** - Real-time MCA/Income Tax database checks  
✅ **Milestone-Based Disbursals** - Release funds in tranches tied to deliverables  
✅ **One-Click CSR Reports** - Generate MCA Form CSR-2 compliant reports  
✅ **AI-Powered Matching** - Find NGOs aligned with your mandate (99% accuracy)  
✅ **Compliance Alerts** - Instant notifications if partner NGO loses 12A/80G status  

### For NGOs
✅ **Verified Badge** - Stand out with automated compliance certification  
✅ **Faster Onboarding** - 3-step registration wizard (10 minutes)  
✅ **Project Showcasing** - Create impact portfolios with media-rich descriptions  
✅ **Transparent Funding** - Get paid faster when milestones are met  
✅ **Trust Score™** - Build credibility through our proprietary scoring system  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19, TailwindCSS |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL (Supabase) |
| **AI/ML** | Google Gemini AI for smart matching |
| **UI Components** | Radix UI, Shadcn/ui |
| **Authentication** | NextAuth.js (Planned) |
| **Payments** | Razorpay (Planned) |
| **File Storage** | Supabase Storage |

---

## 🚀 Key Features

### 1. **Automated Compliance Engine**
Pings MCA and Income Tax databases every 48 hours to verify:
- 12A Registration Status
- 80G Certification
- FCRA Compliance (for international funding)
- CSR-1 Form filing

### 2. **Smart Tranche System**
Instead of lump-sum transfers:
- Funds locked until milestone completion
- NGO uploads Utilization Certificate
- Auto-release on approval
- Audit trail for every rupee

### 3. **AI Scout Chatbot**
Natural language queries like:
> "Find verified education NGOs in rural Maharashtra with 80G"

Returns ranked matches with explanation.

### 4. **Board-Ready Dashboards**
Real-time visibility into:
- CSR budget utilization (%)
- Partner compliance health
- Sector-wise allocation
- Impact metrics (beneficiaries reached)

### 5. **NGO Trust Score™**
Proprietary algorithm scoring NGOs on:
- Document completeness (30%)
- Historical impact (25%)
- Financial transparency (20%)
- Response time (15%)
- Community ratings (10%)

---

## 📊 Business Model

| Plan | Target | Pricing | Features |
|------|--------|---------|----------|
| **Free** | Small NGOs | ₹0/year | Basic listing, 1 project |
| **Pro** | Established NGOs | ₹12,000/year | Unlimited projects, verified badge |
| **Corporate Basic** | Mid-sized firms | ₹50,000/year | Up to 10 NGO partnerships |
| **Corporate Enterprise** | Large corporates | Custom | Unlimited partners, white-label reports |

**Revenue Channels:**
1. SaaS subscriptions (NGOs + Corporates)
2. Transaction fee (0.5% on disbursals >₹10L)
3. API access for third-party platforms

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase account

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ngo-connect.git
cd ngo-connect
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:5432/ngo_connect"
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

4. **Run database migrations**
```bash
npx prisma migrate dev
npx prisma db seed  # Optional: Populate sample data
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
ngo-connect/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Corporate dashboard
│   ├── api/               # Backend API routes
│   └── page.js            # Landing page
├── components/            # Reusable React components
│   ├── ui/               # Shadcn UI primitives
│   └── ai-chatbot.jsx    # AI Scout widget
├── prisma/               # Database schema & migrations
├── lib/                  # Utilities & helpers
└── public/               # Static assets
```

---

## 🎯 Roadmap

### Phase 1 (Current - MVP)
- [x] NGO registration wizard
- [x] Corporate dashboard
- [x] AI-powered search
- [x] Basic compliance checks

### Phase 2 (Q2 2026)
- [ ] Real-time MCA API integration
- [ ] Payment gateway (Razorpay)
- [ ] WhatsApp notifications
- [ ] Mobile app (React Native)

### Phase 3 (Q3 2026)
- [ ] Impact measurement SDK
- [ ] Blockchain-based audit trail
- [ ] Multi-language support
- [ ] Government partnership (NITI Aayog)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by passionate developers committed to social impact.

**Founder:** [Your Name]  
**Contact:** support@ngoconnect.in  
**Website:** [www.ngoconnect.in](https://ngoconnect.in)

---

## 🙏 Acknowledgments

- Ministry of Corporate Affairs (MCA) for CSR guidelines
- Income Tax Department for compliance frameworks
- All NGO partners who trusted our vision

---

**⭐ Star this repo if you believe in transparent CSR!**
