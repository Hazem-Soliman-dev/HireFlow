# 🚀 HireFlow — AI-Powered Applicant Tracking System (ATS)

HireFlow is a modern, premium Applicant Tracking System (ATS) designed to streamline candidate sourcing, evaluation, and management. By combining a drag-and-drop pipeline board with artificial intelligence (Llama 3.3 via Groq) and integrated communication workflows, HireFlow empowers recruiters, hiring managers, and candidates to collaborate seamlessly.

---

## ✨ Features at a Glance

### 1. 🤖 Resume Intelligence (Groq & Llama-3.3)
- **Automatic Text Extraction**: Uses `pdf-parse` to read and parse text directly from candidate-uploaded PDF resumes.
- **AI Fit Scoring**: Leverages `llama-3.3-70b-versatile` to analyze candidate resumes against job descriptions, yielding a **0-100% fit coefficient**.
- **Contextual Feedback**: Provides 2–3 precise bullet sentences highlighting key strengths, gaps, or areas for alignment.
- **Graceful Fallbacks**: If the Groq API key is unconfigured or rate-limited, the system seamlessly triggers mock scoring so development is never blocked.

### 2. 📋 Interactive Kanban Pipeline Board
- **Drag-and-Drop Stages**: Easily transition candidates across hiring stages (`Applied` ➡️ `Screened` ➡️ `Interview` ➡️ `Offer` ➡️ `Hired` / `Rejected`).
- **Optimistic State Updates**: Powered by Next.js transitions and `@dnd-kit/core` for zero-latency dragging, with automated database rollback on failure.
- **Status Drawer**: Clicking any candidate card opens a slide-over panel displaying the full candidate timeline, contact details, resume, scheduled interviews, and AI analysis.

### 3. 🗓️ Smart Interview Scheduler
- **Meeting Configurations**: Schedule interview rounds, set duration, choose interviewer details, and specify physical locations or video call URLs.
- **Dynamic Action Hooks**: Create, update, or cancel interviews. Changes update database tables instantly and reflect on the candidate's personal portal.

### 4. 📊 Visual Analytics Dashboard
- **Pipeline Spread**: High-level visual metrics mapping the candidate density in each pipeline stage.
- **Analytics View**: Rendered charts showing AI score distributions and aggregate applicant metrics to help recruitment leads diagnose bottleneck areas.

### 5. 📨 Transactional Notification Engine
- **Automated Alerts**: Leverages `nodemailer` to trigger real-time updates.
- **Notification Events**:
  - Sends meeting confirmations (including duration and video links) to both candidates and interviewers.
  - Notifies applicants of stage changes and final selections.

### 6. 🔄 Dynamic Multi-Role Sandbox
- Easily shift between four user personas directly from the navigation bar:
  - **HR Admin**: Configures system settings and views aggregate statistics.
  - **Recruiter**: Publishes jobs, drags candidates through the pipeline, and schedules interviews.
  - **Hiring Manager**: Reviews candidates, reads AI scores, and leaves evaluation notes.
  - **Candidate**: Sifts through open jobs, uploads PDF resumes, tracks active applications, and views personalized AI resume feedback.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router, v16.2.6/15+) |
| **Styling** | Tailwind CSS (v3.4.10) with custom premium gradients & shadows |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM (v6.0.1) |
| **Drag & Drop** | `@dnd-kit/core` & `@dnd-kit/utilities` |
| **AI Integration** | Groq SDK (Llama 3.3 70B model) |
| **Resume Extraction**| `pdf-parse` |
| **File Storage** | UploadThing |
| **Mailing** | Nodemailer |
| **Data Viz** | Recharts |

---

## 📐 Project Architecture

The diagram below outlines the interaction between the different user roles, the HireFlow client application, external services, and the PostgreSQL database.

```mermaid
graph TD
    %% User Personas
    A[HR Admin] -->|Manages System| HF[HireFlow Next.js App]
    B[Recruiter] -->|Manages Jobs & Pipeline| HF
    C[Hiring Manager] -->|Evaluates Candidates| HF
    D[Candidate] -->|Applies & Tracks Portal| HF

    %% App Internals & Actions
    subgraph HireFlow App
        HF --> SA[Server Actions]
        SA -->|Prisma Client| DB[(PostgreSQL)]
        SA -->|Triggers Resume Scoring| AI[AI Screening Engine]
        SA -->|Triggers Mail Alerts| ME[Mail Engine]
    end

    %% External APIs
    subgraph External Services
        AI -->|Sends Resume Text| Groq[Groq API: Llama 3.3]
        HF -->|Uploads PDF Resume| UT[UploadThing Storage]
        ME -->|Sends Emails| SMTP[SMTP Server]
    end
```

---

## 📁 Repository Structure

```text
HireFlow/
├── app/                  # Next.js App Router Pages & Layouts
│   ├── (app)/            # Authenticated App Layout (Dashboard, Jobs, Analytics)
│   ├── (auth)/           # Authentication/Login pages
│   ├── actions/          # Next.js Server Actions (Database writes & side effects)
│   └── api/              # API Route Handlers (UploadThing hooks)
├── components/           # Reusable UI Components
│   ├── analytics/        # Recharts visualizations
│   ├── candidates/       # Pipeline board, Drawer, Form, and Cards
│   ├── dashboard/        # KPI summary widgets
│   ├── interviews/       # Scheduling tools and agenda lists
│   ├── jobs/             # Job cards, forms, and modification triggers
│   └── shell/            # Side Navigation, Top Header, and Mobile Footers
├── lib/                  # Utilities & Shared Configs
│   ├── ai.ts             # Groq API evaluation & PDF text extractor
│   ├── auth.ts           # Cookie-based demo authentication layer
│   ├── email.ts          # Nodemailer connection & HTML template triggers
│   └── prisma.ts         # Singleton client instances
├── prisma/               # Database Schema definition & migration files
├── public/               # Static assets
└── tailwind.config.ts    # Custom design systems, typography & borders
```

---

## 🚀 Getting Started

Follow these steps to run HireFlow locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or later)
- **npm** or **yarn**
- **PostgreSQL** database instance (local or hosted e.g. Neon, Supabase)

### 2. Installation
Clone the repository and install the project dependencies:
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root directory and configure the environment variables as follows:
```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# Groq Cloud API (Optional - falls back to sandbox mock score if omitted)
GROQ_API_KEY="your-groq-api-key"

# UploadThing configuration (Required for PDF Resume Uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Nodemailer SMTP Configuration (Required for interview & stage update notifications)
SMTP_HOST="smtp.yourprovider.com"
SMTP_PORT="587"
SMTP_USER="user@yourdomain.com"
SMTP_PASS="smtp-password"
SMTP_FROM="HireFlow <no-reply@yourdomain.com>"
```

### 4. Database Setup
Use Prisma to configure your database tables, run initial migrations, and generate the Prisma Client:
```bash
# Generate the client
npm run prisma:generate

# Run DB Migrations
npm run prisma:migrate
```

### 5. Running the Application
Launch the development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with HireFlow.

---

## 🔒 Security & Roles Architecture

HireFlow uses a cookie-based session token (`hf_role`) to quickly demonstrate the system from various stakeholder perspectives. 

In a production environment, this token can be verified against a secure OAuth provider (e.g. NextAuth/Auth.js, Clerk, Auth0) mapping role attributes directly to user credentials. Role authorizations are enforced at two locations:
1. **Layout / Page Guard**: Checked server-side through `requireRole()` before rendering subpages.
2. **Server Action Guard**: Verified at the beginning of each database mutation action via `assertRole(currentRole, [...allowedRoles])` to prevent unauthorized requests.
