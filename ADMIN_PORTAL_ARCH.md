# Super Admin Portal - Design & Architecture
**Version:** 1.0
**Target Role:** System Super Admin / Compliance Officer / Auditor

## 1. Core Philosophy
The Admin Portal is the "God View" of the platform. It must be isolated, secure, and logging-heavy.
*   **Isolation:** Admin users are distinct entities, not just "User" with a flag.
*   **Auditability:** "Who changed the Trust Score?" must be answerable in seconds.
*   **Non-Destuctive:** Admins never `DELETE`. They `SUSPEND` or `ARCHIVE`.

---

## 2. Information Architecture (Route Structure)

Base Route: `/admin` (Protected via custom Admin Auth Middleware)

| URL Path | Module Name | Primary Purpose |
| :--- | :--- | :--- |
| `/admin/dashboard` | **Global Cockpit** | High-level metrics. Breach alerts, Fund blocks, System Health. |
| `/admin/ngos` | **NGO Registry** | Master list. Search by Reg No, Name. Filters for Suspended/Verified. |
| `/admin/ngos/[id]` | **NGO 360 View** | Full Profile editor. Trust Score Override. Document invalidation. |
| `/admin/corporates` | **Donor Registry** | Master list of Funders. Restrict funding access. |
| `/admin/finance` | **Fund Control** | Ledger view. Force-freeze Tranches. View Escrow balance (virtual). |
| `/admin/audit-logs` | **System Blackbox** | Searchable history of all administrative actions. |
| `/admin/settings` | **System Config** | Manage Admin Users, Roles, and Global Flags (e.g., "Pause All Disbursals"). |

---

## 3. Database Schema Extensions (Prisma)

We need a dedicated `AdminUser` model to keep admins separate from the generic `User` table (Security Best Practice).

### A. New Model: `AdminUser`
```prisma
model AdminUser {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      String   @default("READ_ONLY") // SUPER_ADMIN, COMPLIANCE, FINANCE, READ_ONLY
  lastLogin DateTime?
  isActive  Boolean  @default(true)
  
  auditLogs AdminAuditLog[] // Reverse relation
}
```

### B. New Model: `AdminAuditLog`
*   **Purpose:** Immutable record of admin actions.
*   **Different from `ComplianceLog`:** `ComplianceLog` tracks NGO actions (uploads). `AdminAuditLog` tracks System actions.

```prisma
model AdminAuditLog {
  id          String   @id @default(uuid())
  adminId     String
  action      String   // "SUSPEND_NGO", "OVERRIDE_SCORE", "APPROVE_KYC"
  targetEntity String  // "NGO:123", "PROJECT:456"
  details     String?  // JSON: { reason: "Found fake docs", oldValue: "ACTIVE", newValue: "SUSPENDED" }
  ipAddress   String?
  timestamp   DateTime @default(now())

  admin       AdminUser @relation(fields: [adminId], references: [id])
}
```

### C. Updates to `NGO` & `Corporate`
*   Add `systemStatus`: String @default("ACTIVE") // ACTIVE, SUSPENDED, BLACKLISTED, UNDER_REVIEW
*   Add `adminNotes`: String? // Internal remarks

---

## 4. Key Security & Logic Principles

### A. "The Four-Eyes Principle" (Future V2)
For critical actions (e.g., Blacklisting a top-tier NGO), require approval from *another* admin.
*   *V1 Implementation:* Detailed Logging + "Reason" field mandatory for all state changes.

### B. Trust Score Override Logic
Admins can manually set a Trust Score, but:
1.  Must select "Manual Override" flag.
2.  Must input a valid expiry for the override (e.g., "Valid for 7 days until audit").
3.  This overrides the algorithmic calculation.

### C. Soft Deletes
*   **UI:** "Delete" button.
*   **Backend:** `UPDATE ngo SET systemStatus = 'ARCHIVED'`.
*   **Reason:** Financial trails cannot be broken.

---

## 5. UI Components required
*   `AdminSidebar`: Distinct dark-themed nav.
*   `StatusBadge`: Unified status colors (Active=Green, Suspended=Red, Review=Orange).
*   `AuditStream`: A component that renders the `AdminAuditLog` timeline.
*   `JsonViewer`: To safely view metadata of logs.
*   `ReasonDialog`: A forced modal that pops up whenever a user clicks "Reject" or "Suspend", demanding a text input.

---

## 6. Edge Cases
1.  **Admin Lockout:** Steps to seed the first Super Admin via CLI if all admins are locked out.
2.  **Concurrent Edits:** Two admins editing the same NGO. (Last write wins for V1, but logs show both).
3.  **Data Privacy:** Auditors should see financials but *not* perhaps beneficiary PII (Personal Identifiable Information).

## 7. Plan of Action
1.  Update Schema (`AdminUser`, `AdminAuditLog`, `systemStatus`).
2.  Create Admin Layout & Dashboard.
3.  Implement NGO Master View (List + Details).
4.  Implement "Action with Reason" pattern.
