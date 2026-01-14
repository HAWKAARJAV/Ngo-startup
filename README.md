# NGO Connect - CSR Compliance & Impact Platform

**The Operating System for Transparent Corporate Social Responsibility (CSR).**

NGO Connect is a next-generation platform designed to bridge the gap between Corporate Funders and Verified NGOs in India. It solves the trust deficit by offering automated compliance checks, AI-powered matching, and milestone-based fund disbursal.

---

## 🚀 Key Features

### 1. Advanced Registration & Verification
- **Multi-Role Onboarding**: Dedicated flows for **NGOs** (Trusts, Societies, Section 8) and **Corporates**.
- **5-Step NGO Wizard**: Captures deep details including Legal Status, FCRA, CSR-1, and 3 years of audited financials.
- **Automated Compliance**: Real-time placeholders for checking 12A, 80G, and MCA status.
- **Document Vault**: Secure storage for verification documents (PAN, Trust Deeds, MOA).

### 2. Dashboard & Operations
- **Live Impact Map**: Interactive usage of `react-simple-maps` to visualize funding spread across Indian states.
- **Smart Tranche System**: Funds are released in milestones. The next tranche is locked until the NGO uploads a **Utilization Certificate**.
- **Real-Time Analytics**: Track *Total Impact*, *Active Projects*, and *Compliance Score*.

### 3. AI-Powered CSR Scout
- **Powered by Google Gemini**: Natural language search for corporates (e.g., *"Find me women empowerment NGOs in rural Rajasthan"*).
- **Smart Matching**: Ranks NGOs based on mandate alignment, trust score, and location.

### 4. Interactive Projects & Stories
- **Project Marketplace**: Detailed project cards with funding goals, progress bars, and beneficiary metrics.
- **Success Stories**: A public gallery (`/stories`) showcasing real-world impact with before/after visuals.
- **Needs Attention**: Alerts for pending approvals or compliance issues.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router)
- **Language**: JavaScript / React 19
- **Database**: PostgreSQL (via Supabase)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Shadcn/UI (Radix Primitives)
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Icons**: Lucide React

---

## � Project Structure

```
├── app/
│   ├── api/                # Backend API Routes (Auth, AI, Projects)
│   ├── dashboard/          # Protected User Dashboard (Server Components)
│   ├── register/           # Registration Workflows (NGO & Corporate)
│   ├── stories/            # Public Success Stories Page
│   └── login/              # Authentication Pages
├── components/
│   ├── ui/                 # Reusable UI Atoms (Buttons, Cards, Badges)
│   └── dashboard/          # Complex feature components (ImpactMap, NeedsAttention)
├── prisma/
│   ├── schema.prisma       # Database Schema
│   └── seed.js             # Seeding script with 50+ Verified NGOs & Projects
└── lib/                    # Utilities (Prisma Client, AI Helper)
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database (Supabase recommended)
- Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/HAWKAARJAV/startup.git
    cd startup
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/db"
    GOOGLE_API_KEY="your-gemini-key"
    ```

4.  **Setup Database**
    ```bash
    npx prisma db push
    ```

5.  **Seed Data (Optional)**
    Populates the DB with 55+ Verified NGOs and sample projects.
    ```bash
    npx prisma db seed
    ```

6.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000` to see the app.

---

## 🧪 Testing the Flow

1.  **Register as an NGO**: Go to `/register/ngo` and complete the form.
2.  **Corporate Login**: Use `csr@techgiant.com` (no password needed for demo).
3.  **AI Search**: On the dashboard, use the chatbot to ask *"Find education NGOs in Delhi"*.
4.  **View Profile**: Click on any NGO to see the deep-dive profile page.

---

## 🔮 Future Roadmap

- [ ] **Blockchain Integration**: For immutable fund tracking.
- [ ] **Payment Gateway**: Integration with Razorpay/Stripe for instant donations.
- [ ] **Mobile App**: Dedicated app for field volunteers to upload impact photos.
- [ ] **Social Graph**: Network visualization of how NGOs connect with Corporates.

---

Made with ❤️ for **Code For India**.
