# 🎯 ReferHire — Professional Referral & Hiring Marketplace

> **"Editorial Precision Meets Professional Technology"**
> Redesigned using the **UI/UX Pro Max** design intelligence system (`ui-ux-pro-max`). A role-based full-stack MERN platform connecting **Candidates**, **Verified Employee Referrers**, **Recruiters**, and **Admins** with transparent skill-matching, referral request pipelines, and candidate tracking.

---

## 🌟 Visual Identity & Design System

- 🏛️ **Editorial Design Philosophy**: Grounded in Minimalist Swiss publication architecture. Warm archival off-white parchment canvas (`#F8F7F4`), crisp white cards (`#FFFFFF`), carbon ink typography (`#17191D`), restrained editorial cobalt accents (`#2554D7`), and forest emerald verification badges (`#107548`).
- ✍️ **Typographic Triad**:
  - **Editorial Display**: `Newsreader` (Google Fonts optical-sized serif) for headlines and editorial titles.
  - **Interface Sans**: `Plus Jakarta Sans` for crisp navigation, forms, buttons, and tables.
  - **Technical Mono**: `JetBrains Mono` for compensation ranges, match metrics, and status tokens.
- 🌐 **Signature 3D Experience — "ReferHire Network"**:
  - Architectural 3D spatial referral constellation rendered with Three.js.
  - Connects Candidate Skills, Live Requisitions, and Verified Corporate Referrers.
  - Performance-optimized: single WebGL renderer, capped pixel ratio (≤ 2), `ResizeObserver`, automatic pause when tab hidden, reactive `prefers-reduced-motion` detection, and an accessible 2D directory fallback.
- 📋 **High-Productivity Split-View Scanner**:
  - Discover Jobs provides a dual-pane workspace: scannable left feed with transparent match % and a sticky right inspection pane with full technical requirements, compensation, and instant referral request actions.
- 🤝 **Verified Corporate Referrer Network**:
  - Employee profiles authenticated via corporate domains (`@google.com`, `@microsoft.com`).
  - Strict anti-spam, zero-fee merit referral policies with explicit candidate criteria.
- 🤖 **Contextual Career Intelligence**:
  - Deterministic Resume-to-Job Diagnostic benchmarking keyword coverage.
  - Personalized Referral Message Builder with tone presets (Concise, Respectful, Technical).
  - Career Copilot AI for contextual query assistance.

---

## 🏗️ Technical Architecture

```
                    React 18 + Vite Frontend (Design System Tokens)
                                     │
                                     ▼  /api Proxy
                         Express 4 REST Engine
                                     │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
 MongoDB (Atlas / Embedded Memory)                       Socket.IO Events
  ├── Users & Profiles                                    ├── User Channels
  ├── Jobs & Applications                                 └── Live Notifications
  └── Referral Requests
```

---

## 👥 The Four Personas & Pre-Seeded Accounts

| Persona | Key Responsibilities | Demo Credentials |
|---|---|---|
| **CANDIDATE** | Profile management, live skill editor, job discovery with match scores, direct applications, referral requests. | `candidate@referhire.com` / `password123` |
| **REFERRER** | Corporate verified employee (Google, Microsoft), review incoming candidate pitches & skills, accept/decline referrals. | `referrer@google.com` / `password123` |
| **RECRUITER** | Create/manage requisitions, review candidates (direct vs referred), schedule interviews, extend offers. | `recruiter@techcorp.com` / `password123` |
| **ADMIN** | System governance, role oversight, moderation, platform metrics. | `admin@referhire.com` / `password123` |

Use the **"DEMO:"** persona switcher in the top navigation bar to test any persona with a single click.

---

## 🚀 Exact Commands to Run

### 1. Prerequisites
- **Node.js** v18+ and **npm**

### 2. Run Backend & Frontend

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

Open your browser to `http://localhost:5173`.

### 3. Build Verification
```bash
npm --prefix client run build
```
Generates optimized code-split production bundles in `client/dist/`.

---

## 🗄️ Database Models & Relationships

- **`User`**: Identity, bcrypt password hash, role enum (`CANDIDATE`, `REFERRER`, `RECRUITER`, `ADMIN`), refresh tokens.
- **`CandidateProfile`**: Skills array, experience, education, headline, and availability.
- **`ReferrerProfile`**: Company name, role, department, ratings, and referral criteria.
- **`Company`**: Company information, industry, verification status, and recruiter links.
- **`Job`**: Requisition details, salary range, experience bounds, skills array, and text search indexes.
- **`ReferralRequest`**: Candidate pitch, target referrer, match score, and status pipeline.
- **`Application`**: Direct and referral applications, interview scheduling metadata, and audit timeline logs.
- **`Notification`**: Real-time and persistent user alert feeds.
