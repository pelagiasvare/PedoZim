# PedoZim — School Management System
**Capstone Project Proposal & Implementation — Phase 1 & 2**  
*Prepared by: Pelagia Svare*  
*Target: Primary and Secondary Schools (Zimbabwe & Regional)*  
*Repository: [https://github.com/pelagiasvare/PedoZim](https://github.com/pelagiasvare/PedoZim)*

---

## 📌 Executive Summary
**PedoZim** is a full-stack, web-based School Management System engineered to eliminate the inefficiencies of paper registers, physical files, and disjointed spreadsheets in primary and secondary schools across Zimbabwe. It empowers school leadership, teachers, bursars, parents, and students with an integrated platform to record, manage, and analyze student dossiers, daily attendance, examination marks, fee collections, and community announcements — enhanced with **Google Gemini AI** for pedagogical evaluation and administrative drafting.

---

## 🤖 AI Integration Overview (Phase 2 Requirement)

### 1. Which AI API is Used?
PedoZim integrates the **Google Gemini 1.5 Flash API** (`gemini-1.5-flash`), accessed through secure REST endpoints and reactive frontend services. A robust offline pedagogical heuristic engine acts as an instant fallback to guarantee 100% operational uptime in rural or offline school environments.

### 2. What the AI Does:
- **Automated ZIMSEC/Cambridge Report Card Remarks**: In the **Marks & Grades** module, teachers can generate customized, pedagogical evaluation comments for individual students or an entire classroom roster with a single click. The AI assesses:
  - Coursework consistency (/30)
  - Mid-Term test score (/30)
  - Final terminal examination score (/40)
  - Total weighted score and letter grade (A–U)
  - Produces encouraging, constructive feedback emphasizing student strengths and practical revision advice.
- **AI Notice & WhatsApp Announcement Drafter**: In the **Notice Board** module, administrators enter brief bullet points or keywords (e.g., *"Inter-house sports day on Friday, wear house colors"*), and the AI drafts formal, formatted announcements ready for WhatsApp broadcast and physical notice boards.

### 3. Technical Limitations:
- **Connectivity Requirements**: Live generative model calls require internet connectivity; when offline, PedoZim automatically switches to its deterministic pedagogical heuristics engine.
- **Token Quotas & Rate Limits**: Generative calls are throttled and temperature-controlled (`temperature: 0.6`, `maxOutputTokens: 60-150`) to avoid token waste and latency spikes.
- **Human-in-the-Loop Advisory Role**: AI-generated remarks are presented as editable drafts. The teacher or principal retains final review, modification, and sign-off authority prior to printing or publishing report cards.

---

## ⚖️ Statement on Ethical and Responsible AI Use

PedoZim adheres to international standards for ethical artificial intelligence in education:

1. **Student Data Privacy & Anonymization**:
   - No Personally Identifiable Information (PII) such as student national IDs, full home addresses, medical details, or guardian phone numbers are ever transmitted to the AI model.
   - Prompts only pass first names, subjects, and numerical scores to preserve absolute confidentiality.
2. **Mitigation of Algorithmic Bias**:
   - The AI evaluation prompts are strictly designed to evaluate academic performance metrics without bias towards gender, socioeconomic background, ethnicity, or language proficiency.
   - Feedback is pedagogical, constructive, and forward-looking, avoiding punitive or stigmatizing language.
3. **Transparency and Accountability**:
   - Teachers and administrators are always informed when content is AI-assisted via visible UI badges (`✨ Gemini AI Remarks Active`).
   - The AI never automatically modifies student grades or assigns final academic outcomes autonomously. Every remark remains fully editable by certified school faculty.

---

## 🏗️ System Architecture

```
Capstoneproject/
├── client/                          # React + TypeScript Frontend (Vite)
│   ├── public/                      # Static assets & SVG icons
│   ├── src/
│   │   ├── components/              # Sidebar, TopBar, reusable UI widgets
│   │   ├── pages/                   # PedoLandingPage, Dashboard, Students, Teachers,
│   │   │                            # Classes, Attendance, Marks, Fees, Announcements, Reports
│   │   ├── portals/                 # Dedicated Student, Parent, and Org Member portals
│   │   ├── services/                # Unified reactive data service & aiService (Gemini API)
│   │   ├── styles/                  # Clean 2-tone CSS design system (#6c95bc & white)
│   │   ├── types/                   # TypeScript schemas & role definitions
│   │   ├── data/                    # Seed dataset (Zimbabwe academic context)
│   │   ├── App.tsx                  # Root layout & page router
│   │   └── main.tsx                 # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── server/                          # ASP.NET Core 10 Web API Backend
    └── SchoolManagement.Api/
        ├── Controllers/             # REST endpoints (Students, Fees, Attendance, Marks)
        ├── Data/                    # SchoolDbContext & DbInitializer
        ├── Models/                  # Domain entities (Student, Teacher, Invoice, Payment, etc.)
        ├── appsettings.json         # PostgreSQL & environment configuration
        └── Program.cs               # Minimal API routes & CORS middleware
```

---

## 🚀 Key Modules & Features

### 1. Transforming Landing Page & Home UI
- Dual-state transforming floating navbar that shifts smoothly into an island capsule upon scrolling.
- Fixed social channel quick-strip (LinkedIn, Facebook).
- High-conversion hero layout with 12 interactive school operations badges and multi-role sign-in card (*School Staff*, *Student*, *Parent*, *Org Member*).
- Interactive enrollment fee calculator ($0.50/student/month with 1 Term Free trial).

### 2. Role-Based Dashboard & KPIs
- Dynamic switching between **Administrator**, **Teacher**, and **Student/Parent** personas.
- Real-time KPI summary cards: Total Enrolled Students, Active Faculty, Today's Attendance %, and Term Fee Collection.
- Weekly attendance trend visualizer and fee clearance progress metrics.

### 3. Student Directory & Dossier
- Search by name, admission number (`SMS-2026-xxx`), or guardian contact.
- Filter by academic stream (Form 1A, Form 1B, Form 2A, Form 3 Science, Form 4 Arts) and status.
- Modal for new student admissions with complete guardian and residential details.
- Student Dossier view with embedded academic record, attendance record, and fee balance.

### 4. Daily Attendance Register
- Date picker and class stream selection.
- One-click status marker (**Present**, **Late**, **Absent**, **Excused**).
- "Mark All Present" convenience button.
- Class turnout rate calculation and WhatsApp alert dispatch triggers.

### 5. Marks Entry, AI Remarks & Official Report Cards
- Terminal assessment breakdown: **Coursework (/30)**, **Mid-Term (/30)**, and **Final Exam (/40)**.
- Automatic grade calculation (**A**, **B**, **C**, **D**, **U**) with **Gemini AI Pedagogical Remarks**.
- **Printable Terminal Report Card Generator**: Formatted official terminal report with Harare Central High School branding, student metadata, marks distribution, AI remarks, and principal sign-off.

### 6. Fees, Levies & EcoCash Accounts
- Term fee structures: Tuition fee, School Development Levy, Sports & Exam fees.
- Multi-currency support (**USD** and **ZiG**).
- Record payments with support for **EcoCash**, Bank Transfer, Cash, or Card.
- **Official Payment Receipt Generator**: Printable receipt with unique receipt number (`RCT-2026-xxxx`), date, student details, cashier signature, and remaining balance.

### 7. School Notice Board & AI Notice Drafter
- Priority categories: **Academic**, **Sports**, **Finance**, **Urgent**, and **General**.
- Target audience filtering (**All**, **Teachers**, **Parents**, **Students**).
- AI announcement drafting assistant for WhatsApp alerts and pinned campus notices.

### 8. Auditing & Reporting
- Class-by-class fee clearance statements.
- Attendance health monitoring.
- Academic merit and distinction ranking.
- One-click **Export to CSV** and **Printable Views**.

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js** (v18+) & **pnpm**
- **.NET SDK** (v8 / v10)
- *(Optional)* **PostgreSQL** (falls back to in-memory/seeded database for instant development)

### 1. Start the React Frontend
```bash
cd client
pnpm install
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3003](http://localhost:3003) in your browser.

### 2. (Optional) Set your Gemini API Key
To use live generative calls with your own Google Gemini key:
- In the **Marks & Grades** page, click the **✨ Gemini AI Remarks Active** badge and paste your API key, or add `VITE_GEMINI_API_KEY=your_key_here` to `client/.env`.
- If no key is provided, PedoZim automatically utilizes its built-in pedagogical heuristic intelligence engine.

### 3. Start the ASP.NET Core Backend
```bash
cd server/SchoolManagement.Api
dotnet run
```
API runs at [http://localhost:5000](http://localhost:5000) with OpenAPI/Swagger endpoint at `/openapi/v1.json`.

---

## 🛠️ PostgreSQL Configuration
To connect to a live PostgreSQL instance, update `server/SchoolManagement.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=pedozim_db;Username=postgres;Password=yourpassword"
  }
}
```
Run migrations with:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```
