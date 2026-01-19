# 🌐 NGO-CONNECT | Complete Platform Documentation

> **India's First Real-Time CSR-NGO Matching & Fund Management Platform**

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?logo=tailwindcss)

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Quick Start](#-quick-start)
4. [Project Structure](#-project-structure)
5. [Color Palette & Design System](#-color-palette--design-system)
6. [All Pages & Routes](#-all-pages--routes)
7. [All Buttons & Actions](#-all-buttons--actions)
8. [All Components](#-all-components)
9. [Database Schema](#-database-schema)
10. [API Endpoints](#-api-endpoints)
11. [Real-Time Socket Events](#-real-time-socket-events)
12. [User Flows](#-user-flows)
13. [Test Credentials](#-test-credentials)

---

## 🎯 Overview

NGO-CONNECT is a **dual-sided SaaS platform** that bridges:

| **Corporates (CSR Teams)** | **NGOs (Non-Profits)** |
|---------------------------|------------------------|
| Find verified NGOs | Showcase projects |
| Track fund utilization | Upload compliance docs |
| Request documents | Receive tranche releases |
| Real-time chat | Real-time notifications |
| AI-powered matching | Trust score analytics |

### Key Features
- ✅ **Real-Time Chat** - Socket.IO powered instant messaging
- ✅ **Trust Score System** - AI-calculated NGO credibility (0-100)
- ✅ **Tranche-Based Funding** - Milestone-linked fund releases
- ✅ **Document Management** - 12A, 80G, FCRA, UC uploads
- ✅ **Live Notifications** - Instant alerts for all actions
- ✅ **Geo-Tagged Evidence** - Photo proof with location
- ✅ **Compliance Dashboard** - Track all regulatory documents
- ✅ **Admin Portal** - Super admin controls

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16.1, React 19, TailwindCSS 4.0 |
| **UI Components** | Radix UI, Lucide Icons, shadcn/ui |
| **Backend** | Next.js API Routes, Server Actions |
| **Real-Time** | Socket.IO 4.x |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 5.10 |
| **Storage** | Supabase Storage |
| **AI** | Google Gemini API |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Setup environment variables
# Edit .env with your credentials

# 3. Push database schema
npx prisma db push

# 4. Seed database with dummy data
npx prisma db seed

# 5. Start development server (Socket.IO enabled)
npm run dev
```

### Access URLs

| Dashboard | URL |
|-----------|-----|
| **Homepage** | http://localhost:3000 |
| **Corporate Dashboard** | http://localhost:3000/dashboard |
| **NGO Portal** | http://localhost:3000/ngo-portal |
| **Admin Panel** | http://localhost:3000/admin/dashboard |
| **Corporate Chat** | http://localhost:3000/dashboard/chat |
| **NGO Chat** | http://localhost:3000/ngo-portal/chat |

---

## 📁 Project Structure

```
ngo-connect/
├── app/                          # Next.js App Router
│   ├── page.js                   # Homepage
│   ├── layout.js                 # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── login/                    # Login page
│   ├── register/                 # Registration pages
│   │   ├── corporate/            # Corporate signup
│   │   └── ngo/                  # NGO signup
│   │
│   ├── dashboard/                # 🏢 CORPORATE DASHBOARD
│   │   ├── layout.js             # Dashboard layout with sidebar
│   │   ├── page.js               # Main dashboard
│   │   ├── chat/                 # Real-time chat
│   │   ├── corporate/            # Company profile
│   │   ├── projects/             # Browse NGO projects
│   │   ├── search/               # AI NGO search
│   │   ├── reports/              # Impact reports
│   │   └── ngo/[id]/             # NGO detail view
│   │
│   ├── ngo-portal/               # 🌱 NGO DASHBOARD
│   │   ├── layout.js             # Portal layout
│   │   ├── page.js               # NGO home
│   │   ├── chat/                 # Chat with corporates
│   │   ├── projects/             # My projects
│   │   │   └── [id]/             # Project workbench
│   │   ├── compliance/           # Document management
│   │   └── trust-score/          # Trust analytics
│   │
│   ├── admin/                    # 👑 ADMIN PANEL
│   │   ├── dashboard/            # Admin overview
│   │   ├── ngos/                 # Manage NGOs
│   │   ├── corporates/           # Manage corporates
│   │   ├── finance/              # Financial overview
│   │   └── audit-logs/           # System logs
│   │
│   ├── api/                      # 🔌 API ROUTES
│   │   ├── chat/                 # Chat APIs
│   │   │   ├── rooms/route.js
│   │   │   └── messages/route.js
│   │   ├── notifications/        # Notification APIs
│   │   ├── documents/            # Document APIs
│   │   ├── ngos/                 # NGO APIs
│   │   └── ai/                   # AI Scout API
│   │
│   └── actions/                  # ⚡ SERVER ACTIONS
│       ├── tranche-actions.js
│       ├── project-actions.js
│       └── compliance-actions.js
│
├── components/                   # 🧩 REUSABLE COMPONENTS
│   ├── ui/                       # Base UI (shadcn)
│   ├── chat-interface.jsx        # Chat component
│   ├── notification-center.jsx   # Notifications
│   ├── ngo-chat-page.jsx         # NGO chat view
│   └── corporate-chat-page.jsx   # Corporate chat view
│
├── lib/                          # 📚 UTILITIES
│   ├── prisma.js                 # Database client
│   ├── socket.js                 # Socket.IO client
│   └── utils.js                  # Helpers
│
├── prisma/                       # 🗄️ DATABASE
│   ├── schema.prisma             # Schema definition
│   └── seed.js                   # Seed data
│
└── server.js                     # 🚀 SOCKET.IO SERVER
```

---

## 🎨 Color Palette & Design System

### Primary Colors

| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 🔵 **Blue 600** | `#2563eb` | `bg-blue-600` | Primary buttons, links |
| 🔵 **Blue 700** | `#1d4ed8` | `hover:bg-blue-700` | Hover states |
| 🔵 **Blue 50** | `#eff6ff` | `bg-blue-50` | Light backgrounds |
| 🔵 **Blue 100** | `#dbeafe` | `bg-blue-100` | Badges, highlights |

### Secondary Colors

| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| ⬛ **Slate 900** | `#0f172a` | `text-slate-900` | Headings |
| ⬛ **Slate 700** | `#334155` | `text-slate-700` | Body text |
| ⬛ **Slate 500** | `#64748b` | `text-slate-500` | Muted text |
| ⬛ **Slate 200** | `#e2e8f0` | `border-slate-200` | Borders |
| ⬛ **Slate 50** | `#f8fafc` | `bg-slate-50` | Backgrounds |

### Status Colors

| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 🟢 **Green 600** | `#16a34a` | `bg-green-600` | Success, verified |
| 🟢 **Green 100** | `#dcfce7` | `bg-green-100` | Success bg |
| 🔴 **Red 600** | `#dc2626` | `bg-red-600` | Errors, blocked |
| 🔴 **Red 50** | `#fef2f2` | `bg-red-50` | Error bg |
| 🟡 **Amber 600** | `#d97706` | `bg-amber-600` | Warnings |
| 🟠 **Orange 600** | `#ea580c` | `bg-orange-600` | Urgent/High priority |

### Trust Score Colors

| Score Range | Color | Badge Class |
|-------------|-------|-------------|
| 90-100 | 🟢 Green | `bg-green-100 text-green-700` |
| 70-89 | 🔵 Blue | `bg-blue-100 text-blue-700` |
| 50-69 | 🟡 Yellow | `bg-yellow-100 text-yellow-700` |
| 0-49 | 🔴 Red | `bg-red-100 text-red-700` |

### Typography

| Element | Tailwind Class | Size |
|---------|----------------|------|
| H1 | `text-4xl font-bold` | 36px |
| H2 | `text-3xl font-bold` | 30px |
| H3 | `text-2xl font-bold` | 24px |
| H4 | `text-xl font-semibold` | 20px |
| Body | `text-base` | 16px |
| Small | `text-sm` | 14px |
| Tiny | `text-xs` | 12px |

### Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-md` | 6px | Buttons, inputs |
| `rounded-lg` | 8px | Cards |
| `rounded-xl` | 12px | Large cards |
| `rounded-2xl` | 16px | Modals |
| `rounded-full` | 50% | Avatars, badges |

### Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation |
| `shadow-md` | Cards |
| `shadow-lg` | Dropdowns |
| `shadow-xl` | Modals |
| `shadow-2xl` | Hero sections |

---

## 📄 All Pages & Routes

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, features |
| `/about` | About company |
| `/contact` | Contact form |
| `/login` | User login |
| `/register` | Choose role |
| `/register/corporate` | Corporate signup |
| `/register/ngo` | NGO signup |
| `/stories` | Impact stories |
| `/live-needs` | Urgent requirements |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Corporate Dashboard (`/dashboard/*`)

| Route | Description |
|-------|-------------|
| `/dashboard` | Main overview, stats |
| `/dashboard/chat` | 💬 Real-time NGO chat |
| `/dashboard/search` | 🔍 AI-powered NGO search |
| `/dashboard/projects` | Browse all projects |
| `/dashboard/projects/[id]` | Project details |
| `/dashboard/ngo/[id]` | NGO profile view |
| `/dashboard/corporate` | Company profile settings |
| `/dashboard/reports` | Impact reports |

### NGO Portal (`/ngo-portal/*`)

| Route | Description |
|-------|-------------|
| `/ngo-portal` | NGO dashboard home |
| `/ngo-portal/chat` | 💬 Chat with corporates |
| `/ngo-portal/projects` | My projects list |
| `/ngo-portal/projects/[id]` | 🔧 Project workbench |
| `/ngo-portal/compliance` | 📑 Document management |
| `/ngo-portal/trust-score` | ⭐ Trust score breakdown |

### Admin Panel (`/admin/*`)

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Admin overview |
| `/admin/ngos` | Manage all NGOs |
| `/admin/ngos/[id]` | Edit NGO |
| `/admin/corporates` | Manage corporates |
| `/admin/finance` | Financial overview |
| `/admin/audit-logs` | System activity |

---

## 🔘 All Buttons & Actions

### Header/Navigation Buttons

| Button | Style | Action |
|--------|-------|--------|
| **Login** | `bg-slate-900 text-white px-4 py-2 rounded-md` | Go to /login |
| **Register** | `bg-blue-600 text-white px-4 py-2 rounded-md` | Go to /register |
| **🔔 Notification Bell** | Ghost button with badge | Open notification panel |

### Homepage Buttons

| Button | Style | Action |
|--------|-------|--------|
| **Get Started** | `bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg` | Go to /register |
| **Learn More** | `border border-white text-white px-6 py-3 rounded-lg` | Scroll to features |
| **For Corporates** | `bg-white text-blue-600 px-4 py-2 rounded-md` | /register/corporate |
| **For NGOs** | `bg-blue-600 text-white px-4 py-2 rounded-md` | /register/ngo |

### Corporate Dashboard Buttons

| Button | Location | Style | Action |
|--------|----------|-------|--------|
| **Search NGOs** | Header | `bg-blue-600` | Open AI search |
| **View Profile** | NGO Card | `variant="outline"` | View /dashboard/ngo/[id] |
| **Chat Now** | NGO Card | `bg-green-600` | Start chat |
| **New Conversation** | Chat page | `bg-blue-600` | Select NGO dialog |
| **Request Doc** | Chat header | `variant="outline"` | Open request dialog |
| **Send** | Chat input | `bg-blue-600` (icon button) | Send message |
| **Save Changes** | Profile | `bg-slate-900` | Update profile |

### NGO Portal Buttons

| Button | Location | Style | Action |
|--------|----------|-------|--------|
| **Create Project** | Projects list | `bg-blue-600` | New project form |
| **Manage Tranches** | Project card | `variant="outline"` | Go to workbench |
| **Upload UC** | Workbench | `variant="outline" size="sm"` | Upload dialog |
| **Upload Photo** | Workbench | `variant="outline" size="sm"` | Upload dialog |
| **Request Release** | Workbench | `bg-blue-600 w-full` | Submit release request |
| **Upload** | Doc request alert | `bg-orange-600 size="sm"` | Upload requested doc |

### Chat Interface Buttons

| Button | Style | Action |
|--------|-------|--------|
| **Send** | `bg-blue-600` + Send icon | Send message |
| **Request Doc** | `variant="outline" gap-2` | Open request dialog |
| **📞 Phone** | `variant="ghost" size="sm"` | Voice call (placeholder) |
| **📹 Video** | `variant="ghost" size="sm"` | Video call (placeholder) |
| **⋮ More** | `variant="ghost" size="sm"` | More options |

### Dialog Buttons (Modals)

| Button | Style | Action |
|--------|-------|--------|
| **Cancel** | `variant="outline" flex-1` | Close dialog |
| **Upload Document** | `bg-blue-600 flex-1` | Confirm upload |
| **Send Request** | `bg-blue-600 flex-1 gap-2` | Send doc request |

### Admin Panel Buttons

| Button | Location | Style | Action |
|--------|----------|-------|--------|
| **Suspend NGO** | NGO detail | `bg-red-600` | Suspend account |
| **Verify** | Compliance | `bg-green-600` | Verify document |
| **Reject** | Compliance | `bg-red-600` | Reject document |
| **Export** | Tables | `variant="outline"` | Download CSV |

### Button States

| State | Class |
|-------|-------|
| Default | Normal styling |
| Hover | `hover:bg-[color]-700` |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Loading | `<Loader2 className="animate-spin" />` |

---

## 🧩 All Components

### Base UI Components (`/components/ui/`)

| Component | Props | Description |
|-----------|-------|-------------|
| **Button** | `variant`, `size`, `disabled` | All button styles |
| **Card** | `className` | Card wrapper |
| **CardHeader** | - | Card header section |
| **CardTitle** | - | Card title |
| **CardContent** | - | Card body |
| **Input** | `type`, `placeholder` | Text inputs |
| **Textarea** | `rows`, `placeholder` | Multi-line input |
| **Label** | `htmlFor` | Form labels |
| **Badge** | `variant` | Status badges |
| **Dialog** | `open`, `onOpenChange` | Modal dialogs |
| **DialogContent** | - | Dialog body |
| **DialogHeader** | - | Dialog header |
| **DialogTitle** | - | Dialog title |
| **Select** | `value`, `onValueChange` | Dropdowns |
| **SelectTrigger** | - | Dropdown trigger |
| **SelectContent** | - | Dropdown options |
| **SelectItem** | `value` | Single option |
| **Progress** | `value` | Progress bar |
| **Tabs** | `defaultValue` | Tab container |
| **TabsList** | - | Tab buttons |
| **TabsTrigger** | `value` | Tab button |
| **TabsContent** | `value` | Tab panel |
| **Table** | - | Data table |
| **Avatar** | - | User avatar |
| **Tooltip** | - | Hover tooltip |
| **Sheet** | `open`, `onOpenChange` | Side panel |
| **SheetContent** | `side` | Sheet body |
| **ScrollArea** | - | Scrollable container |
| **Separator** | - | Divider line |
| **Checkbox** | `checked`, `onCheckedChange` | Checkboxes |

### Feature Components (`/components/`)

| Component | Props | Description |
|-----------|-------|-------------|
| **ChatInterface** | `roomId`, `currentUserId`, `currentUserRole`, `currentUserName`, `recipientName` | Full chat UI |
| **NotificationCenter** | `userId`, `userRole` | Bell icon + dropdown |
| **NGOChatPage** | `ngo`, `user` | NGO chat dashboard |
| **CorporateChatPage** | `corporate`, `user`, `ngos` | Corporate chat dashboard |
| **TrustScoreBreakdown** | `score`, `breakdown` | Score visualization |
| **SmartTrancheList** | `tranches` | Tranche cards |
| **AIChatbot** | - | AI assistant |

### Icons Used (Lucide React)

| Icon | Usage |
|------|-------|
| `MessageCircle` | Chat |
| `Bell` | Notifications |
| `Send` | Send message |
| `FileText` | Documents |
| `Upload` | Upload action |
| `Lock` / `Unlock` | Tranche status |
| `MapPin` | Location |
| `CheckCircle2` | Success |
| `AlertTriangle` | Warning |
| `Loader2` | Loading spinner |
| `Search` | Search |
| `Plus` | Add new |
| `Building2` | Corporate |
| `Phone` / `Video` | Call icons |
| `MoreVertical` | More options |
| `ArrowRight` | Navigation |
| `Target` | Goals |
| `TrendingUp` | Analytics |
| `Calendar` | Dates |
| `X` | Close |

---

## 🗄️ Database Schema

### User & Auth

```prisma
model User {
  id               String     @id @default(uuid())
  email            String     @unique
  name             String?
  role             String     @default("DONOR") // NGO, CORPORATE, ADMIN
  corporateProfile Corporate?
  ngoProfile       NGO?
}
```

### NGO

```prisma
model NGO {
  id             String   @id @default(uuid())
  userId         String   @unique
  orgName        String
  registrationNo String?
  city           String
  state          String
  mission        String?
  trustScore     Int      @default(0)
  is12AVerified  Boolean  @default(false)
  is80GVerified  Boolean  @default(false)
  fcraStatus     Boolean  @default(false)
  systemStatus   String   @default("ACTIVE")
  projects       Project[]
  documents      ComplianceDoc[]
}
```

### Corporate

```prisma
model Corporate {
  id           String   @id @default(uuid())
  userId       String   @unique
  companyName  String
  industry     String
  csrBudget    Float
  mandateAreas String
  donations    Donation[]
}
```

### Project & Tranches

```prisma
model Project {
  id           String    @id @default(uuid())
  ngoId        String
  title        String
  description  String
  targetAmount Float
  raisedAmount Float     @default(0)
  location     String
  sector       String
  status       String
  tranches     Tranche[]
}

model Tranche {
  id              String   @id @default(uuid())
  projectId       String
  amount          Float
  status          String   @default("LOCKED")
  unlockCondition String
  proofDocUrl     String?
  geoTag          String?
  releaseRequested Boolean @default(false)
  isBlocked       Boolean?
  blockReason     String?
}
```

### Real-Time Communication

```prisma
model ChatRoom {
  id            String   @id @default(uuid())
  corporateId   String
  ngoId         String
  lastMessageAt DateTime @default(now())
  messages      ChatMessage[]
  @@unique([corporateId, ngoId])
}

model ChatMessage {
  id          String   @id @default(uuid())
  roomId      String
  senderId    String
  senderRole  String   // "CORPORATE" or "NGO"
  senderName  String
  message     String
  messageType String   @default("TEXT")
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  userRole  String
  type      String   // CHAT, DOCUMENT_REQUEST, DOCUMENT_UPLOADED
  title     String
  message   String
  link      String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model DocumentRequest {
  id          String   @id @default(uuid())
  corporateId String
  ngoId       String
  requestType String
  docName     String
  description String?
  priority    String   @default("MEDIUM")
  status      String   @default("PENDING")
  fileUrl     String?
  requestedAt DateTime @default(now())
}
```

---

## 🔌 API Endpoints

### Chat APIs

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/chat/rooms?userId=X&userRole=Y` | - | Get user's rooms |
| POST | `/api/chat/rooms` | `{corporateId, ngoId}` | Create room |
| GET | `/api/chat/messages?roomId=X` | - | Get messages |
| POST | `/api/chat/messages` | `{roomId, senderId, senderRole, senderName, message}` | Send message |
| PATCH | `/api/chat/messages/read` | `{roomId, userId}` | Mark read |

### Notification APIs

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications?userId=X` | - | Get all |
| POST | `/api/notifications` | `{userId, userRole, type, title, message}` | Create |
| PATCH | `/api/notifications/manage` | `{notificationIds}` or `{userId, markAllRead}` | Mark read |
| DELETE | `/api/notifications/manage?userId=X` | - | Clear all |

### Document APIs

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/documents/requests?ngoId=X` | - | Get requests |
| POST | `/api/documents/requests` | `{corporateId, ngoId, requestType, docName}` | Create request |
| PATCH | `/api/documents/requests/update` | `{requestId, status, fileUrl}` | Update |

---

## 📡 Real-Time Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `register` | `{userId, userRole, userName}` | Connect user |
| `join_room` | `{roomId, userId}` | Join chat |
| `leave_room` | `{roomId}` | Leave chat |
| `send_message` | `{roomId, message, senderId, senderName, senderRole}` | Send msg |
| `request_document` | `{corporateId, ngoId, docName, ...}` | Request doc |
| `document_uploaded` | `{corporateId, ngoId, fileName, ...}` | Notify upload |
| `typing` | `{roomId, userName}` | Typing on |
| `stop_typing` | `{roomId}` | Typing off |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `registered` | `{success, userId}` | Confirmed |
| `room_joined` | `{roomId, success}` | Joined |
| `new_message` | `{id, message, senderId, ...}` | New msg |
| `notification` | `{type, title, message}` | Alert |
| `document_requested` | `{docName, ...}` | Request received |
| `document_uploaded_notification` | `{fileName, ...}` | Upload notified |
| `user_typing` | `{userName}` | Typing indicator |
| `user_status` | `{userId, status}` | Online/offline |

---

## 🔄 User Flows

### Corporate Requests Document

```
1. Corporate opens /dashboard/chat
2. Selects NGO conversation
3. Clicks "Request Doc" button
4. Fills form: docType, docName, description
5. Clicks "Send Request"
6. → API creates DocumentRequest
7. → Socket emits 'request_document'
8. → NGO receives instant notification
9. → System message in chat
```

### NGO Uploads Document

```
1. NGO sees red alert banner
2. Clicks "Upload" on request
3. Selects file
4. Clicks "Upload Document"
5. → File stored in Supabase
6. → API updates request status
7. → Socket emits 'document_uploaded'
8. → Corporate receives notification
```

### Real-Time Chat

```
1. User A opens chat
2. Socket joins room
3. User A types → 'typing' event
4. User B sees typing indicator
5. User A sends → 'send_message'
6. API saves to database
7. Socket broadcasts 'new_message'
8. User B sees message instantly
```

---

## 🔐 Test Credentials

| Role | Email | Dashboard URL |
|------|-------|---------------|
| **Corporate** | csr@techgiant.com | /dashboard |
| **NGO** | contact@smilefoundation.org | /ngo-portal |
| **NGO** | info@goonj.org | /ngo-portal |
| **NGO** | info@deepalaya.org | /ngo-portal |
| **Admin** | admin@ngoconnect.com | /admin/dashboard |

### Pre-seeded Data

- **1 Corporate:** Tech Giant India Pvt Ltd (₹50M CSR budget)
- **55 NGOs:** Including Smile Foundation, Goonj, Deepalaya + 52 Delhi NGOs
- **1 Chat Room:** Tech Giant ↔ Smile Foundation (with messages)
- **1 Document Request:** 12A Certificate (pending)
- **1 Notification:** For Smile Foundation
- **100+ Projects:** With tranches across all NGOs

---

## 🎯 Demo Script (1-Minute)

```
1. Open Corporate: localhost:3000/dashboard/chat
2. Show existing chat with Smile Foundation
3. Type message → Explain real-time
4. Click "Request Doc" → Request 12A Certificate
5. Open NGO: localhost:3000/ngo-portal/chat (new tab)
6. Show instant alert banner + notification
7. Click Upload → Simulate upload
8. Back to Corporate → Show notification
9. Done! Full loop demonstrated.
```

---

## 🚀 Commands Reference

```bash
# Development
npm run dev              # Start Socket.IO + Next.js server

# Database
npx prisma db push      # Push schema changes
npx prisma db seed      # Seed dummy data
npx prisma studio       # Open database GUI

# Build
npm run build           # Production build
npm start               # Start production server
```

---

## 📂 Environment Variables

```env
# Required
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"

# Optional
GOOGLE_GEMINI_API_KEY="xxx"
```

---

**Built for Social Impact** 🌱

MIT License © 2026 NGO-CONNECT
