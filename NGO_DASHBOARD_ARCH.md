yes built# NGO Command Center - Design & Architecture Specification
**Version:** 1.0
**Target Role:** NGO Admin / Operations Head

## 1. Context & Philosophy
The NGO Dashboard is not just a data entry form; it is an **Operational Operating System**. It must shift the NGO's mental model from "Passive Receiver" to "Compliant Partner".
*   **Core Driver:** "Compliance Freshness directly correlates to Fund Unlock."
*   **Visual Language:** Clean, high-contrast, urgent but not alarming. Green = Safe, Amber = Action Needed, Red = Funding Blocked.

---

## 2. Information Architecture (Route Structure)

New Dashboard Base Route: `/dashboard/my-organization` (distinct from public profile `/dashboard/ngo/[id]`)

| URL Path | Module Name | Primary Purpose |
| :--- | :--- | :--- |
| `/dashboard/my-organization` | **Command Center** | High-level health check. Trust Score, At-Risk Funding, Deadline Ticker. |
| `/dashboard/my-organization/compliance` | **Compliance Ops** | The "Vault". Document uploads, expiry tracking (12A, 80G, FCRA), History. |
| `/dashboard/my-organization/projects` | **Project Execution** | List of running projects. Tranche unlocking status. |
| `/dashboard/my-organization/projects/[id]` | **Project Workbench** | Milestone management, Evidence upload, UC generation. |
| `/dashboard/my-organization/finance` | **Funding Visibility** | Ledger view. Committed vs. Disbursed funds. Blocked funds navigator. |
| `/dashboard/my-organization/trust-score` | **Trust Explainability** | Deep dive into *why* the score is what it is. "Next Best Action" list. |

---

## 3. Database Schema Extensions (Prisma)

To support "Freshness," "History," and "Audit Logs", we need to extend the current schema.

### A. Enhanced NGO Model (Freshness Tracking)
Fields to add to `NGO` model:
- `validity12A`: `DateTime` (Expiry date)
- `validity80G`: `DateTime` (Expiry date)
- `validityCSR1`: `DateTime` (Expiry date)
- `lastComplianceCheck`: `DateTime` (Auto-updated system check)

### B. New Model: `ComplianceLog` (Audit Trail)
*Requirement: "Immutable history for compliance uploads"*

```prisma
model ComplianceLog {
  id          String   @id @default(uuid())
  ngoId       String
  docType     String   // "12A", "80G", "UC", "PROJECT_EVIDENCE"
  action      String   // "UPLOAD", "VERIFY", "REJECT", "EXPIRE"
  actorId     String   // Who did it? (User ID)
  timestamp   DateTime @default(now())
  metadata    String?  // JSON: { "oldVal": "...", "newVal": "...", "reason": "..." }
  
  ngo         NGO      @relation(fields: [ngoId], references: [id])
}
```

### C. Enhanced Tranche Model (Funding Blocks)
Fields to add to `Tranche` model:
- `isBlocked`: `Boolean` @default(true)
- `blockReason`: `String?` // "MISSING_UC", "COMPLIANCE_EXPIRED_12A", "GEO_MISMATCH"
- `expectedEvidenceType`: `String` // "PHOTO_GEO", "VIDEO", "DOC_PDF"

---

## 4. Key UI Modules & Components

### A. The "Compliance Freshness Meter" (Component)
*   **Visual:** A segmented gauge or traffic light system.
*   **Logic:**
    *   **Green:** All certs valid > 90 days.
    *   **Amber:** Any cert expiring < 60 days.
    *   **Red:** Any cert expired OR Compliance Score < 500.
*   **Placement:** Fixed usage in Top Navbar or Prominent Header Card.

### B. "Funding at Risk" Widget
*   **Visual:** Large Metric with 'Lock' Icon.
*   **Data:** Sum of all `LOCKED` tranches where `releaseRequested` is TRUE but `status` is not `RELEASED`.
*   **Interaction:** Clicking it deep-links to the specific blocking item (e.g., "Upload UC for Project X").

### C. Trust Score "Next Best Action" (AI/Logic)
*   **Concept:** Don't just show the score. Show how to fix it.
*   **UI:** List of actionable cards.
    *   *Example:* "+20 Points: Upload renewed FCRA certificate (Expiring in 10 days)."
    *   *Example:* "+50 Points: Upload Impact Photos for 'School Project' (Overdue)."

### D. The "Tranche Unlocker" (Project View)
*   **Workflow:**
    1.  **Step 1:** Upload Evidence (Drag & Drop).
    2.  **Step 2:** Geo-tag verification (Map view confirming location match).
    3.  **Step 3:** Generate UC (Button triggers Server Action to generate PDF template).
    4.  **Step 4:** Sign & Re-upload UC.
    5.  **Result:** Tranche status -> `REVIEW_PENDING`.

---

## 5. Critical Edge Cases

1.  **"The Dead Zone":** NGO uploads document, but Corporate takes 2 weeks to verify.
    *   *Solution:* Display "Verification Pending" status clearly so NGO knows ball is in Corporate court. Pause "Time Decay" on Trust Score during this window.
2.  **Certificate Renewal Overlap:** NGO gets new 12A while old one is valid.
    *   *Logic:* System must accept "Future Valid" dates and auto-switch when old one expires.
3.  **Non-Digital NGO Staff:** Staff forgets password or can't navigate.
    *   *Feature:* "Magic Link" login for specific tasks (e.g., "Click here to just upload the photo").

## 6. Anti-Patterns (What NOT to do)
*   **Hidden Penalties:** Never drop Trust Score without an alert explanation.
*   **Infinite Forms:** Do not ask for the same data twice. If 80G is in profile, don't ask for it in Project.
*   **"Generic" Uploads:** Never just verify "File Uploaded". Verify "File is a PDF" and "Size is reasonable".

## 7. Phasing (V1 - What NOT to build yet)
*   **Automated OCR verification of 12A/80G:** Too complex. Rely on Corporate Admin manual verify for V1.
*   **Real-time Bank Integration:** Just a manual "Mark as Paid" button for Corporate Finance for now.
*   **Blockchain Ledger:** Overkill. Internal `ComplianceLog` table is sufficient immutable proof for V1.
