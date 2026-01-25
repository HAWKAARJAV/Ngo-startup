# CorpoGN - Project Status Report
**Date:** January 18, 2026
**Current Version:** 0.8.0 (Beta / MVP+)

## 🚀 Executive Summary
The platform has evolved from a basic prototype to a functional MVP with core workflows for **NGO Onboarding**, **Project Management**, **AI Search**, and **Compliance Tracking**. The infrastructure supports both NGO and Corporate user roles. Recent updates have introduced Chat functionality and deepened the Compliance module.

---

## ✅ What is Built (Implemented & Functional)

### 1. User Onboarding & Authentication
- **Multi-Role System:** Distinct generic flows for `NGO` and `Corporate` users.
- **NGO Registration Wizard:** Captures crucial legal details:
    - Organization Type (Trust, Society, Section 8).
    - Compliance Identifiers (FCRA, CSR-1, PAN).
    - Basic Profile (Mission, Contact).
- **Corporate Registration:** Basic profile setup for CSR funders.

### 2. Core Dashboard System
- **Role-Based Views:**
    - **Corporate Dashboard:** Overview of impact, active projects (stubbed), and search capabilities.
    - **NGO Dashboard:** Project management and compliance visibility.
- **UI Components:** A library of reusable Shadcn/Tailwind components (`Accordion`, `Alert`, `Card`, `Table`, etc.) in `components/ui`.

### 3. AI & Search Capabilities (The "Brain")
- **AI CSR Scout:**
    - Located at `/dashboard/search`.
    - Integrated with Google Gemini API (`app/api/ai/scout/route.js`).
    - Allows natural language querying (e.g., "Find NGOs in Kerala working on Education").
- **AI Proposal Reviewer:**
    - Basic structure at `/dashboard/proposal-check`.
    - Analyzes text for grant probability.

### 4. Project Management
- **Project Structure:** Database models for `Project`, `Tranche`, and `Donation`.
- **Creation Flow:** NGOs can list projects with funding goals and locations.
- **Tranche System:** Basic database support for milestone-based fund release.

### 5. Compliance & Trust (The "Moat")
- **Compliance Dashboard:**
    - Located at `/dashboard/ngo/[id]`.
    - **Document Management:** New `ProjectComplianceDoc` model linked to Projects.
    - **Verification Flow:** UI for requesting and viewing documents.
    - **Trust Score:** Database field `trustScore` exists with basic calculation logic placeholders.

### 6. Interactive Features
- **Stories:** Public-facing success stories page (`/stories`).
- **Chat:** Recently added internal chat system (`/dashboard/chat`).
- **Live Needs:** A section for urgent functional requirements (`/live-needs`).

---

## 🚧 In Progress / Partially Implemented

### 1. Deep Impact Verification
- **Current State:** `ImpactReportGenerator` and `ImpactMap` components are present but likely relying on mock or static data.
- **Missing:** Real-time integration with `Tranche` unlock logic (uploading UCs to unlock funds automatically).

### 2. Advanced Trust Score Algorithm
- **Current State:** The database allows storing a score.
- **Missing:** The "Dynamic Trust Score Engine" (Sprint 1 item) that weighs financial health + volatility + compliance freshness real-time is not fully wired up.

### 3. Financial Integration
- **Current State:** Logic for "Tranches" exists in the DB.
- **Missing:** No actual Payment Gateway (Razorpay/Stripe) integration. Funds are "virtual" currently.

---

## 📅 Roadmap: What is Left (To Be Built)

### Priority 1: "The Vault" (Financial Security)
- [ ] **Escrow Logic:** automated blocking of funds until Milestones are marked 'Verified'.
- [ ] **Utilization Certificates (UC):** Formal workflow to generate/upload standardized UC PDFs.
- [ ] **Audit Exports:** "One-Click Big 4 Pack" to zip all compliance docs for external auditors.

### Priority 2: "The Hawk Eye" (Forensic AI)
- [ ] **Image Analysis:** Building the specific AI tool to detect manufactured/fake impact photos (reverse search, metadata checks).
- [ ] **Geo-Fencing:** Rigorous check of `geoTag` on tranche releases against project location.

### Priority 3: Enterprise Scale
- [ ] **RBAC Granularity:** Distinct sub-roles (Auditor vs. Finance Manager) within a Corporate account.
- [ ] **Portfolio Analytics:** Heatmaps for Corporates to see their total impact spread across India.

### Priority 4: Database Migration
- [ ] **Production DB:** Move from `sqlite` (dev) to `Supabase PostgreSQL` (production) for final deployment.

---

## 🛠 Technical Status
- **Database:** Prisma + SQLite (Need to migrate to Postgres for Production).
- **Styling:** Tailwind CSS v4 is active and working well.
- **Testing:** No comprehensive automated test suite (e.g., Jest/Cypress) observed.

---
**Summary Recommendation:**
The project is "Feature Complete" for a high-fidelity internal demo. To go to market (SaaS v1), priority should be the **Payment Gateway** and **Production Database Migration**.
