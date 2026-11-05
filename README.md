# Pedo — School Management System
**Capstone Project Proposal & Implementation — Phase 1 & 2**  
*Prepared by: Pelagia Svare*  
*Target: Primary and Secondary Schools (Zimbabwe & Regional)*

---

## 📌 Executive Summary
**Pedo** is a full-stack, web-based School Management System engineered to eliminate the inefficiencies of paper registers, physical files, and disjointed spreadsheets. It provides school leadership, teachers, bursars, and administrators with an integrated platform to record, manage, and analyze student records, daily attendance, examination marks, fee collections, and community announcements.

---

## 🏗️ System Architecture

```
Capstoneproject/
├── client/                          # React + TypeScript Frontend (pnpm)
│   ├── public/                      # Static assets & SVG icons
│   ├── src/
│   │   ├── components/              # Sidebar, TopBar, reusable UI widgets
│   │   ├── pages/                   # Dashboard, Students, Teachers, Classes,
│   │   │                            # Attendance, Marks, Fees, Announcements, Reports
│   │   ├── services/                # Unified reactive data service & API client
│   │   ├── styles/                  # High-end Vanilla CSS design system
│   │   ├── types/                   # TypeScript schemas & role definitions
│   │   ├── data/                    # Realistic seed dataset (Zimbabwe context)
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

## 🚀 Key Modules & Features![alt text]

### 1. Role-Based Dashboard & KPIs
- Dynamic switching between **Administrator**, **Teacher**, and **Student/Parent** personas.
- Real-time KPI summary cards: Total Enrolled Students, Active Faculty, Today's Attendance %, and Term Fee Collection.
- Weekly attendance trend visualizer and fee clearance progress metrics.

### 2. Student Directory & Dossier
- Search by name, admission number (`SMS-2026-xxx`), or guardian contact.
- Filter by academic stream (Form 1A, Form 1B, Form 2A, Form 3 Science, Form 4 Arts) and status.
- Modal for new student admissions with complete guardian and residential details.
- Student Dossier view with embedded academic record, attendance record, and fee balance.

### 3. Teacher & Subject Curriculum
- Faculty roster with department specialization, academic qualifications, and contact details.
- Classrooms tracker with capacity occupancy indicators.
- Subject curriculum catalog with category tags (Core, Elective, Vocational).

### 4. Daily Attendance Register
- Date picker and class stream selection.
- One-click status marker (**Present**, **Late**, **Absent**, **Excused**).
- "Mark All Present" convenience button.
- Live summary: total roll, present count, absent count, and class turnout rate.

### 5. Marks Entry & Official Report Cards
- Terminal assessment breakdown: **Coursework (/30)**, **Mid-Term (/30)**, and **Final Exam (/40)**.
- Automatic grade calculation (**A**, **B**, **C**, **D**, **U**) with teacher remarks.
- **Printable Terminal Report Card Generator**: Formatted official report with Harare Central High School branding, student metadata, grade distribution, and principal sign-off.

### 6. Fees, Levies & EcoCash Accounts
- Term fee structures: Tuition fee, School Development Levy, Sports & Exam fees.
- Multi-currency support (**USD** and **ZiG**).
- Record payments with support for **EcoCash**, Bank Transfer, Cash, or Card.
- **Official Payment Receipt Generator**: Printable receipt with unique receipt number (`RCT-2026-xxxx`), date, student details, cashier signature, and remaining balance.

### 7. School Notice Board
- Priority categories: **Academic**, **Sports**, **Finance**, **Urgent**, and **General**.
- Target audience filtering (**All**, **Teachers**, **Parents**, **Students**).
- Pinned announcements for critical notices (e.g. Exam schedules, Sports days).

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
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Start the ASP.NET Core Backend
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
    "DefaultConnection": "Host=localhost;Port=5432;Database=edutrack_db;Username=postgres;Password=yourpassword"
  }
}
```
Run migrations with:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```
# PedoZim
