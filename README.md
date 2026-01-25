<div align="center">

# 🤝 CorpoGN

### The Operating System for Transparent Corporate Social Responsibility

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Production-success?style=for-the-badge)](https://ngo-connect-production-005a.up.railway.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-316192?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![AI Powered](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

**Bridging the gap between Corporate Funders and Verified NGOs in India through automated compliance, AI-powered matching, and transparent fund tracking.**

[🚀 View Live Demo](https://ngo-connect-production-005a.up.railway.app/) • [📖 Documentation](#-getting-started) • [🎯 Features](#-key-features) • [🛠️ Tech Stack](#-tech-stack)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Usage Guide](#-usage-guide)
- [Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CorpoGN** is a next-generation SaaS platform that revolutionizes CSR (Corporate Social Responsibility) in India by solving the critical **trust deficit** between corporates and NGOs.

### The Problem 🎯
- Corporates struggle to find verified, compliant NGOs
- Manual verification of 12A, 80G, and FCRA certifications is time-consuming
- Lack of transparency in fund utilization
- No standardized system for impact tracking

### Our Solution ✨
A comprehensive platform that offers:
- ✅ **Automated Compliance Verification** - Real-time validation of legal registrations
- 🤖 **AI-Powered NGO Discovery** - Natural language search using Google Gemini
- 💰 **Smart Tranche Management** - Milestone-based fund disbursement
- 📊 **Real-Time Impact Analytics** - Live dashboards and geographic visualization
- 🔐 **Document Vault** - Secure storage for compliance documents

---

## 🚀 Key Features

<table>
<tr>
<td width="50%">

### 🏢 For Corporates

#### AI-Powered CSR Scout
- **Natural Language Search**: "Find women empowerment NGOs in rural Rajasthan"
- **Smart Matching Algorithm**: Ranks by mandate alignment, trust score, location
- **Instant Verification**: Auto-check 12A, 80G, FCRA compliance

#### Transparent Fund Management
- **Milestone-Based Disbursement**: Funds released in tranches
- **Utilization Certificate Tracking**: Next tranche locked until UC uploaded
- **Real-Time Impact Dashboard**: Live project progress and metrics

</td>
<td width="50%">

### 🏛️ For NGOs

#### Comprehensive Registration
- **5-Step Wizard**: Captures legal status, certifications, financials
- **Multi-Entity Support**: Trusts, Societies, Section 8 companies
- **Document Vault**: Secure PAN, Trust Deeds, MOA storage

#### Operational Excellence
- **Project Marketplace**: Showcase projects with funding goals
- **Compliance Dashboard**: Track certificate validity dates
- **Success Stories**: Public gallery with impact visuals

</td>
</tr>
</table>

### 🌐 Live Impact Map
Interactive visualization powered by `react-simple-maps` showing:
- Funding distribution across Indian states
- Active projects by region
- Real-time impact metrics overlay

### 📱 Real-Time Notifications
WebSocket-based live updates for:
- New project approvals
- Tranche disbursements
- Compliance alerts
- Document verification status

---

## 🛠 Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_16.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/UI](https://img.shields.io/badge/Shadcn/UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### AI & Integrations
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

### Deployment
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

### Key Dependencies

```json
{
  "framework": "Next.js 16.1 (App Router)",
  "language": "JavaScript/JSX",
  "database": "PostgreSQL via Supabase",
  "orm": "Prisma 5.10",
  "styling": "Tailwind CSS v4 + Shadcn/UI (Radix Primitives)",
  "ai": "Google Generative AI (@google/generative-ai)",
  "maps": "react-simple-maps",
  "realtime": "Socket.io",
  "icons": "Lucide React"
}
```

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CorpoGN Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │   Prisma     │  │  Socket.io   │      │
│  │  App Router  │──│     ORM      │──│   Server     │      │
│  │ (SSR/Client) │  │              │  │  (Realtime)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         ├──────────────────┴──────────────────┤              │
│         │                                     │              │
│  ┌──────▼─────────────────────────────────────▼──────┐      │
│  │         Supabase PostgreSQL Database             │      │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐           │      │
│  │  │   NGO   │ │Corporate│ │ Project  │           │      │
│  │  │  Table  │ │  Table  │ │  Table   │           │      │
│  │  └─────────┘ └─────────┘ └──────────┘           │      │
│  └──────────────────────────────────────────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────┐       │
│  │          External Integrations                   │       │
│  │  • Google Gemini AI (Semantic Search)           │       │
│  │  • Supabase Storage (Document Vault)            │       │
│  └──────────────────────────────────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
corpogn/
├── 📁 app/                     # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── ai/                 # Gemini AI endpoints
│   │   ├── auth/               # Authentication
│   │   └── projects/           # Project CRUD
│   ├── dashboard/              # Protected dashboards
│   │   ├── corporate/          # Corporate views
│   │   └── ngo/                # NGO management
│   ├── register/               # Multi-step registration
│   │   ├── ngo/                # NGO onboarding wizard
│   │   └── corporate/          # Corporate signup
│   ├── stories/                # Public success stories
│   └── login/                  # Auth pages
│
├── 📁 components/              # React Components
│   ├── ui/                     # Shadcn/UI primitives
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   └── dialog.jsx
│   ├── dashboard/              # Feature components
│   │   ├── impact-map.jsx      # Geographic visualization
│   │   ├── ai-scout.jsx        # Gemini chatbot
│   │   └── tranche-tracker.jsx # Fund management
│   └── registration/           # Wizard steps
│
├── 📁 prisma/                  # Database Layer
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # 55+ NGO/project seeds
│
├── 📁 lib/                     # Utilities
│   ├── prisma.js               # DB client
│   ├── gemini.js               # AI helpers
│   └── utils.js                # Common functions
│
├── 📁 public/                  # Static assets
├── server.js                   # Custom Express + Socket.io
├── middleware.js               # Auth & routing guards
└── next.config.mjs             # Next.js configuration
```

---

## ⚡ Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **PostgreSQL** database (or Supabase account)
- **Google Gemini API Key** ([Get it here](https://ai.google.dev/))
- **Git** for version control

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/HAWKAARJAV/Ngo-startup.git
cd Ngo-startup
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/ngo_connect?schema=public"

# AI
GOOGLE_API_KEY="your_gemini_api_key_here"

# Optional: Supabase (if using Supabase Storage)
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

> 💡 **Tip**: A `.env.example` file is provided with all required variables.

#### 4️⃣ Database Setup

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

#### 5️⃣ Seed Sample Data (Optional)

Populates your database with **55+ verified NGOs** and **sample projects**:

```bash
npx prisma db seed
```

#### 6️⃣ Run Development Server

```bash
npm run dev
```

🎉 **Success!** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

### Live Production Deployment

🚀 **Frontend + Backend**: [https://ngo-connect-production-005a.up.railway.app/](https://ngo-connect-production-005a.up.railway.app/)

### Deploy Your Own Instance

<details>
<summary><b>Deploy to Railway (Recommended)</b></summary>

1. **Fork this repository**

2. **Create a Railway project**:
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and initialize
   railway login
   railway init
   ```

3. **Add PostgreSQL database**:
   - Go to Railway dashboard → Add Service → PostgreSQL
   - Copy `DATABASE_URL` from variables

4. **Configure environment variables**:
   ```bash
   railway variables set GOOGLE_API_KEY=your_key
   railway variables set DATABASE_URL=your_db_url
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

📖 **Detailed guide**: See [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)

</details>

<details>
<summary><b>Deploy with Docker</b></summary>

```bash
# Build image
docker build -t corpogn .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your_db_url" \
  -e GOOGLE_API_KEY="your_key" \
  corpogn
```

</details>

<details>
<summary><b>Deploy to Vercel</b></summary>

⚠️ **Note**: Vercel doesn't support custom WebSocket servers. Use Railway for full functionality.

```bash
npm install -g vercel
vercel --prod
```

</details>

---

## 📸 Screenshots

<div align="center">

### 🏠 Homepage & Landing
*Modern, responsive landing page with CTA for NGOs and Corporates*

### 🤖 AI-Powered Search
*Ask questions like "Find education NGOs in Delhi" - powered by Google Gemini*

### 📊 Corporate Dashboard
*Real-time analytics, active projects, and compliance monitoring*

### 🗺️ Impact Map
*Geographic visualization of NGO distribution and funding across India*

### 📝 5-Step NGO Registration
*Comprehensive wizard capturing legal status, certifications, and financials*

### 💼 Project Marketplace
*Browse and fund projects with detailed metrics and progress tracking*

### ✅ Smart Tranche System
*Milestone-based fund release with Utilization Certificate verification*

</div>

> 📌 *Screenshots showcase the production deployment at [ngo-connect-production-005a.up.railway.app](https://ngo-connect-production-005a.up.railway.app/)*

---

## 📖 Usage Guide

### For Corporates

1. **🔍 Discover NGOs**
   - Use the AI Scout chatbot on the dashboard
   - Example: *"Find women empowerment NGOs in urban Karnataka with 80G certification"*
   - Filter by mandate, location, trust score, and compliance status

2. **💰 Fund Projects**
   - Browse the Project Marketplace
   - Review NGO profiles with deep-dive compliance data
   - Fund projects with milestone-based tranche release

3. **📈 Track Impact**
   - Monitor real-time project progress
   - View utilization certificates and proofs
   - Access geographic impact visualization

### For NGOs

1. **📋 Complete Registration**
   - Navigate to `/register/ngo`
   - 5-step wizard: Basic Info → Legal Status → Certifications → Financials → Review
   - Upload documents (PAN, Trust Deed, 12A/80G certificates)

2. **🚀 Create Projects**
   - After verification, access NGO Dashboard
   - Create projects with funding goals and milestones
   - Define expected beneficiary outcomes

3. **📤 Manage Funds**
   - Upload Utilization Certificates after each tranche
   - Track disbursement history
   - View trust score improvements

### Demo Accounts

```
🔑 Corporate Demo:
   Email: csr@techgiant.com
   Password: (demo mode - no password required)

🔑 NGO Demo:
   Register at: /register/ngo
   Or explore seeded NGO: contact@akshayapatra.org
```

---

## 🔮 Future Roadmap

### 🎯 Phase 1 (Q2 2026)
- [ ] **Blockchain Integration**: Immutable fund tracking on Polygon
- [ ] **Payment Gateway**: Razorpay/Stripe for instant CSR donations
- [ ] **Advanced Analytics**: Predictive impact scoring using ML

### 🎯 Phase 2 (Q3 2026)
- [ ] **Mobile App**: React Native app for field volunteers
- [ ] **WhatsApp Bot**: Status updates and UC submission via WhatsApp
- [ ] **Social Graph**: Network visualization of NGO-Corporate connections

### 🎯 Phase 3 (Q4 2026)
- [ ] **Government Integration**: Auto-fetch data from MCA/DARPAN APIs
- [ ] **Multi-Language Support**: Hindi, Tamil, Bengali interfaces
- [ ] **Impact Verification AI**: Computer vision for field visit validation

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/Ngo-startup.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add blockchain transaction tracking"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Style

- **JavaScript**: Use ES6+ syntax
- **Components**: Functional components with hooks
- **Styling**: Tailwind utility classes (avoid inline styles)
- **Naming**: Kebab-case for files, PascalCase for components

### Areas for Contribution

- 🐛 **Bug Fixes**: Check [Issues](https://github.com/HAWKAARJAV/Ngo-startup/issues)
- ✨ **Features**: Implement roadmap items
- 📖 **Documentation**: Improve guides and API docs
- 🎨 **UI/UX**: Enhance design and accessibility
- 🧪 **Testing**: Add unit/integration tests

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - You are free to use, modify, and distribute this software.
```

---

## 🙏 Acknowledgments

- **Built for**: Code For India Initiative
- **AI Partner**: Google Gemini API
- **Database**: Supabase for PostgreSQL hosting
- **Deployment**: Railway for seamless deployments
- **UI Components**: Shadcn/UI and Radix Primitives
- **Inspiration**: India's CSR ecosystem and the 2% mandate

---

## 📞 Contact & Support

<div align="center">

**Have questions or need support?**

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/HAWKAARJAV/Ngo-startup/issues)
[![Live Demo](https://img.shields.io/badge/🌐_Try-Live_Demo-success?style=for-the-badge)](https://ngo-connect-production-005a.up.railway.app/)

---

### ⭐ If this project helped you, please consider giving it a star!

**Made with ❤️ for transparent CSR in India**

</div>
