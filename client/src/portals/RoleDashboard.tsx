/**
 * RoleDashboard — shell for ADMIN, HEAD, DEPUTY_HEAD, TEACHER, STAFF
 * Uses PedoSidebar with role-specific nav configs.
 */
import React, { useState } from 'react';
import { Bell, LogOut, ShieldAlert, Menu } from 'lucide-react';
import { User, UserRole } from '../types';
import { PedoSidebar } from '../components/PedoSidebar';
import { getNavForRole, getRoleLabel } from '../components/sidebarConfigs';
import { dataService } from '../services/dataService';
import { mockUsers } from '../data/mockData';

// Pages
import { StudentsPage }        from '../pages/StudentsPage';
import { TeachersPage }        from '../pages/TeachersPage';
import { ClassesSubjectsPage } from '../pages/ClassesSubjectsPage';
import { AttendancePage }      from '../pages/AttendancePage';
import { MarksPage }           from '../pages/MarksPage';
import { FeesPage }            from '../pages/FeesPage';
import { AnnouncementsPage }   from '../pages/AnnouncementsPage';
import { ReportsPage }         from '../pages/ReportsPage';

// Role dashboards
import { AdminDashboard }   from './dashboards/AdminDashboard';
import { HeadDashboard }    from './dashboards/HeadDashboard';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { StaffDashboard }   from './dashboards/StaffDashboard';

interface Props { currentUser: User; onLogout: () => void; }

// ── Access denied ──────────────────────────────────────────────────────
const AccessDenied: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', gap: '12px' }}>
    <ShieldAlert size={40} strokeWidth={1.4} color="#94a3b8" />
    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Access Denied</div>
    <div style={{ fontSize: '13px', color: '#64748b', maxWidth: '300px', textAlign: 'center', lineHeight: 1.6 }}>
      Your account does not have permission to access this page.
    </div>
  </div>
);

// ── Shared UI helpers ──────────────────────────────────────────────────
const PH: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <div style={{ marginBottom: '16px' }}>
    <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h1>
    {sub && <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>{sub}</p>}
  </div>
);
const WC: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '16px' }}>{children}</div>
);
const KPI: React.FC<{ label: string; value: string|number; colour?: string; sub?: string }> = ({ label, value, colour, sub }) => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '14px 16px' }}>
    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#64748b', marginBottom: '6px' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: 700, color: colour ?? '#0f172a', lineHeight: 1.2 }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{sub}</div>}
  </div>
);
const TH2: React.FC<{ cols: string[] }> = ({ cols }) => (
  <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
    {cols.map((c) => <th key={c} style={{ padding: '8px 12px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>{c}</th>)}
  </tr></thead>
);
const Chip: React.FC<{ label: string; ok?: boolean }> = ({ label, ok }) => (
  <span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: ok ? '#f0fdf4' : '#eff6ff', color: ok ? '#166534' : '#2F628F', border: ok ? '1px solid #bbf7d0' : '1px solid #bfdbfe' }}>{label}</span>
);
const Tbl2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>{children}</table></div>
);

const PAGE_TITLES: Record<string, string> = {
  'parents':'Parent Management','school-staff':'Staff Management','timetable':'Timetables',
  'my-timetable':'My Timetable','user-management':'User Management','settings':'School Settings',
  'academic-performance':'Academic Performance','discipline':'Discipline Management',
  'activities':'School Activities','approvals':'Approvals','my-classes':'My Classes',
  'my-subjects':'My Subjects','assignments':'Assignments','my-profile':'My Profile',
  'exam-results':'Student Results','library':'Learning Resources','messages':'Messages',
  'parent-records':'Parent Records','subjects':'Subject Management',
  'student-registration':'Student Registration','admissions':'Admissions',
  'student-records':'Student Records','teacher-records':'Staff Records',
  'correspondence':'School Correspondence','documents':'Document Management',
  'receive-payment':'Receive Payments','payment-history':'Payment History',
  'outstanding':'Outstanding Balances','fee-structures':'Fee Structures','receipts':'Generate Receipts',
  'expenses':'Expenses','financial-reports':'Financial Reports','books':'Books Management',
  'book-categories':'Book Categories','add-book':'Add New Books','issue-books':'Issue Books',
  'return-books':'Return Books','overdue-books':'Overdue Books','borrow-records':'Borrowing Records',
  'borrow-history':'Student Borrowing History','library-reports':'Library Reports',
  'hostel-overview':'Hostel Overview','manage-hostels':'Manage Hostels',
  'manage-rooms':'Manage Rooms','accommodation':'Student Accommodation','room-allocation':'Room Allocation',
  'hostel-attendance':'Hostel Attendance','visitor-records':'Visitor Records',
  'complaints':'Student Complaints','hostel-reports':'Hostel Reports',
  'results':'Examination Results','materials':'Library',
};

// ── Deputy restrictions ────────────────────────────────────────────────
const DEPUTY_BLOCKED = ['settings', 'user-management', 'fees', 'fees-management', 'approvals'];

function canAccess(pageId: string, role: UserRole): boolean {
  if (role === 'DEPUTY_HEAD' && DEPUTY_BLOCKED.includes(pageId)) return false;
  return true;
}

// ── Page renderer ──────────────────────────────────────────────────────
function renderPage(pageId: string, user: User, go: (p: string) => void): React.ReactNode {
  if (!canAccess(pageId, user.role)) return <AccessDenied />;

  switch (pageId) {
    case 'dashboard':
      if (user.role === 'ADMIN')                            return <AdminDashboard   user={user} onNavigate={go} />;
      if (user.role === 'HEAD' || user.role === 'DEPUTY_HEAD') return <HeadDashboard user={user} onNavigate={go} />;
      if (user.role === 'TEACHER')                          return <TeacherDashboard user={user} onNavigate={go} />;
      return <StaffDashboard user={user} />;

    // Full existing pages
    case 'students':
    case 'student-records':
    case 'student-registration':
    case 'admissions':              return <StudentsPage />;

    case 'teachers':
    case 'teacher-records':         return <TeachersPage />;

    case 'classes':
    case 'subjects':                return <ClassesSubjectsPage />;

    case 'attendance':
    case 'hostel-attendance':       return <AttendancePage />;

    case 'examinations':
    case 'marks':
    case 'exam-results':            return <MarksPage />;

    case 'fees':
    case 'receive-payment':
    case 'payment-history':
    case 'outstanding':
    case 'receipts':
    case 'expenses':
    case 'financial-reports':
    case 'fee-structures':          return <FeesPage />;

    case 'announcements':           return <AnnouncementsPage />;
    case 'reports':
    case 'hostel-reports':
    case 'library-reports':
    case 'financial-reports':       return <ReportsPage />;

    // Real pages for every remaining route
    case 'parents':                 return <RealParentsPage />;
    case 'school-staff':            return <RealStaffPage />;
    case 'timetable':
    case 'my-timetable':            return <RealTimetablePage />;
    case 'user-management':         return <RealUserMgmtPage />;
    case 'settings':                return <RealSettingsPage user={user} />;
    case 'academic-performance':    return <RealAcademicPage />;
    case 'discipline':              return <RealDisciplinePage />;
    case 'activities':              return <RealActivitiesPage />;
    case 'approvals':               return <RealApprovalsPage user={user} />;
    case 'my-classes':              return <RealMyClassesPage user={user} />;
    case 'my-subjects':             return <RealMySubjectsPage user={user} />;
    case 'assignments':             return <RealAssignmentsPage />;
    case 'my-profile':              return <RealMyProfilePage user={user} />;
    case 'messages':                return <RealMessagesPage />;
    case 'correspondence':          return <RealCorrespondencePage />;
    case 'documents':               return <RealDocumentsPage />;
    case 'books':
    case 'book-categories':
    case 'add-book':
    case 'borrow-records':
    case 'borrow-history':          return <RealBooksPage />;
    case 'issue-books':
    case 'return-books':
    case 'overdue-books':           return <RealIssuePage title={PAGE_TITLES[pageId] ?? pageId} />;
    case 'hostel-overview':
    case 'manage-hostels':
    case 'manage-rooms':
    case 'accommodation':
    case 'room-allocation':
    case 'visitor-records':
    case 'complaints':              return <RealHostelPage title={PAGE_TITLES[pageId] ?? pageId} />;

    default:
      return <RealGenericPage title={PAGE_TITLES[pageId] ?? pageId} />;
  }
}

// ── Shell ──────────────────────────────────────────────────────────────
export const RoleDashboard: React.FC<Props> = ({ currentUser, onLogout }) => {
  const [page, setPage]         = useState('dashboard');
  const [mobileOpen, setMobile] = useState(false);

  const subRole   = currentUser.subRole;
  const roleLabel = getRoleLabel(currentUser.role, subRole);
  const nav       = getNavForRole(currentUser.role, subRole);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f1f5f9', fontFamily: 'Inter,system-ui,sans-serif' }}>

      {/* Desktop sidebar */}
      <div className="pedo-sidebar-desktop" style={{ position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <PedoSidebar
          nav={nav}
          activePage={page}
          onSelect={setPage}
          currentUser={currentUser}
          onLogout={onLogout}
          roleLabel={roleLabel}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={() => setMobile(false)} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <PedoSidebar
              nav={nav}
              activePage={page}
              onSelect={(id) => { setPage(id); setMobile(false); }}
              currentUser={currentUser}
              onLogout={onLogout}
              roleLabel={roleLabel}
            />
          </div>
        </div>
      )}

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ height: '46px', background: '#2F628F', borderBottom: '1px solid #1e4a72', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '10px', position: 'sticky', top: 0, zIndex: 300, flexShrink: 0 }}>
          <button className="pedo-sidebar-hamburger" onClick={() => setMobile(true)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none', alignItems: 'center' }}>
            <Menu size={18} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff', flex: 1 }}>
            <img src="/logo.png" alt="Pedo Zim" style={{ height: '32px', width: 'auto', objectFit: 'contain', verticalAlign: 'middle', marginRight: '8px' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>— {roleLabel}</span>
          </span>
          <Bell size={14} color="rgba(255,255,255,0.65)" style={{ cursor: 'pointer' }} onClick={() => setPage('announcements')} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{currentUser.name}</span>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', color: '#fff', fontSize: '12px', padding: '3px 8px', cursor: 'pointer' }}>
            <LogOut size={12} /> Logout
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '20px', minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          {renderPage(page, currentUser, setPage)}
        </main>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// REAL PAGE COMPONENTS — no "coming soon" messages
// ═══════════════════════════════════════════════════════════════════

const RealParentsPage: React.FC = () => {
  const students = dataService.getStudents();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="Parents & Guardians" sub="Guardian contacts for enrolled students" />
      <WC>
        <Tbl2>
          <TH2 cols={['Student', 'Class', 'Guardian', 'Phone', 'Email']} />
          <tbody>
            {students.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 12px', fontWeight: 500 }}>{s.firstName} {s.lastName}</td>
                <td style={{ padding: '9px 12px' }}><Chip label={s.className} /></td>
                <td style={{ padding: '9px 12px' }}>{s.guardianName}</td>
                <td style={{ padding: '9px 12px', color: '#64748b' }}>{s.guardianPhone}</td>
                <td style={{ padding: '9px 12px', color: '#64748b', fontSize: '12px' }}>{s.guardianEmail}</td>
              </tr>
            ))}
          </tbody>
        </Tbl2>
      </WC>
    </div>
  );
};

const RealStaffPage: React.FC = () => {
  const teachers = dataService.getTeachers();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="Staff Management" sub="All teaching and non-teaching staff" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px' }}>
        <KPI label="Total Staff" value={teachers.length + 4} />
        <KPI label="Teachers" value={teachers.length} colour="#2F628F" />
        <KPI label="Non-Teaching" value={4} />
        <KPI label="On Leave" value={teachers.filter(t=>t.status==='On Leave').length} colour="#991b1b" />
      </div>
      <WC>
        <Tbl2>
          <TH2 cols={['Staff #','Name','Specialization','Classes','Status']} />
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 12px', color: '#64748b', fontSize: '12px' }}>{t.staffNumber}</td>
                <td style={{ padding: '9px 12px', fontWeight: 500 }}>{t.firstName} {t.lastName}</td>
                <td style={{ padding: '9px 12px', color: '#64748b' }}>{t.specialization}</td>
                <td style={{ padding: '9px 12px', fontSize: '12px' }}>{t.assignedClasses.join(', ')}</td>
                <td style={{ padding: '9px 12px' }}><Chip label={t.status} ok={t.status==='Active'} /></td>
              </tr>
            ))}
          </tbody>
        </Tbl2>
      </WC>
    </div>
  );
};

const RealTimetablePage: React.FC = () => {
  const rows = [
    {t:'07:30–08:15',d:['Mathematics','English','Science','History','Shona']},
    {t:'08:15–09:00',d:['English','Mathematics','Accounts','Geography','ICT']},
    {t:'09:15–10:00',d:['Science','Geography','History','Mathematics','English']},
    {t:'10:00–10:45',d:['History','Shona','Mathematics','Science','Accounts']},
    {t:'11:00–11:45',d:['Geography','ICT','Shona','English','Science']},
    {t:'11:45–12:30',d:['ICT','Accounts','English','Shona','Mathematics']},
    {t:'14:00–14:45',d:['Shona','Science','Geography','Accounts','History']},
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="School Timetable" sub="Weekly schedule — Form 1A" />
      <WC>
        <Tbl2>
          <thead><tr style={{ background: '#2F628F' }}>
            {['Time','Mon','Tue','Wed','Thu','Fri'].map(h => <th key={h} style={{ padding: '9px 12px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 700, color: '#fff', textTransform: 'uppercase' as const }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} style={{ background: i%2===0?'#fff':'#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '9px 12px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' as const }}>{r.t}</td>
                {r.d.map((s,j) => <td key={j} style={{ padding: '9px 12px' }}>{s}</td>)}
              </tr>
            ))}
          </tbody>
        </Tbl2>
      </WC>
    </div>
  );
};

const RealUserMgmtPage: React.FC = () => {
  const rm: Record<string,string> = {ADMIN:'Admin',HEAD:'Headmaster',DEPUTY_HEAD:'Deputy Head',TEACHER:'Teacher',STAFF:'Staff',STUDENT:'Student',PARENT:'Parent',ORG:'Org'};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="User Management" sub="All system accounts — password: Pedo@2026" />
      <WC>
        <Tbl2>
          <TH2 cols={['Name','Email','Role','Sub-Role']} />
          <tbody>
            {mockUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 12px', fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: '9px 12px', color: '#64748b', fontSize: '12px' }}>{u.email}</td>
                <td style={{ padding: '9px 12px' }}><Chip label={rm[u.role]??u.role} /></td>
                <td style={{ padding: '9px 12px', color: '#64748b', fontSize: '12px' }}>{(u as any).subRole??'—'}</td>
              </tr>
            ))}
          </tbody>
        </Tbl2>
      </WC>
    </div>
  );
};

const RealSettingsPage: React.FC<{ user: User }> = ({ user }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <PH title="Settings" sub="System configuration" />
    <WC>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px' }}>
        {[['School Name','Harare Central High School'],['Administrator',user.name],['Email',user.email],['Year','2026'],['Term','Term 3'],['System','Pedo Zim v1.0']].map(([l,v]) => (
          <div key={l} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '160px', fontSize: '12px', fontWeight: 600, color: '#64748b', flexShrink: 0 }}>{l}</div>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
    </WC>
  </div>
);

const RealAcademicPage: React.FC = () => {
  const marks = dataService.getMarks();
  const map: Record<string,{name:string;total:number;count:number}> = {};
  marks.forEach(m => { if(!map[m.studentId]) map[m.studentId]={name:m.studentName,total:0,count:0}; map[m.studentId].total+=m.totalScore; map[m.studentId].count+=1; });
  const rows = Object.values(map).map(r=>({name:r.name,avg:Math.round(r.total/r.count)})).sort((a,b)=>b.avg-a.avg);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="Academic Performance" sub="Term 3 2026 results summary" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px' }}>
        <KPI label="Assessed" value={rows.length} />
        <KPI label="School Avg" value={rows.length>0?`${Math.round(rows.reduce((s,r)=>s+r.avg,0)/rows.length)}%`:'—'} colour="#2F628F" />
        <KPI label="Above 70%" value={rows.filter(r=>r.avg>=70).length} colour="#166534" />
        <KPI label="Below 50%" value={rows.filter(r=>r.avg<50).length} colour="#991b1b" />
      </div>
      <WC>
        <Tbl2>
          <TH2 cols={['Student','Average','Performance']} />
          <tbody>
            {rows.length===0?<tr><td colSpan={3} style={{padding:'24px',textAlign:'center',color:'#94a3b8'}}>No marks yet.</td></tr>
              :rows.map((r,i)=>(
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding:'9px 12px', fontWeight:500 }}>{r.name}</td>
                <td style={{ padding:'9px 12px', fontWeight:700 }}>{r.avg}%</td>
                <td style={{ padding:'9px 12px' }}><Chip label={r.avg>=70?'Good':r.avg>=50?'Average':'Needs Support'} ok={r.avg>=70} /></td>
              </tr>
            ))}
          </tbody>
        </Tbl2>
      </WC>
    </div>
  );
};

const RealDisciplinePage: React.FC = () => {
  const cases=[
    {s:'Simbarashe Machinga',cls:'Form 1A',issue:'Uniform violation',date:'2026-11-03',action:'Warning issued',status:'Resolved'},
    {s:'Kudzai Mupfumi',cls:'Form 1A',issue:'Late arrival (×3)',date:'2026-11-02',action:'Parent notified',status:'Open'},
    {s:'Nyasha Chikwanha',cls:'Form 1A',issue:'Homework not submitted',date:'2026-11-01',action:'Teacher counselled',status:'Resolved'},
    {s:'Tatenda Mutasa',cls:'Form 1A',issue:'Phone use in class',date:'2026-10-30',action:'Phone confiscated',status:'Resolved'},
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="Discipline" sub="Student discipline cases" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px' }}>
        <KPI label="Total" value={cases.length} /><KPI label="Open" value={cases.filter(c=>c.status==='Open').length} colour="#991b1b" /><KPI label="Resolved" value={cases.filter(c=>c.status==='Resolved').length} colour="#166534" />
      </div>
      <WC><Tbl2><TH2 cols={['Student','Class','Issue','Date','Action','Status']} /><tbody>
        {cases.map((c,i)=>(
          <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
            <td style={{padding:'9px 12px',fontWeight:500}}>{c.s}</td><td style={{padding:'9px 12px'}}>{c.cls}</td>
            <td style={{padding:'9px 12px',color:'#64748b'}}>{c.issue}</td><td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{c.date}</td>
            <td style={{padding:'9px 12px',fontSize:'12px'}}>{c.action}</td><td style={{padding:'9px 12px'}}><Chip label={c.status} ok={c.status==='Resolved'} /></td>
          </tr>
        ))}
      </tbody></Tbl2></WC>
    </div>
  );
};

const RealActivitiesPage: React.FC = () => {
  const acts=[
    {name:'Inter-School Football',date:'2026-11-08',venue:'School Grounds',coord:'Mr. Sibanda',status:'Upcoming'},
    {name:'Science Fair',date:'2026-11-12',venue:'Main Hall',coord:'Mrs. Chidzero',status:'Upcoming'},
    {name:'Speech & Prize Day',date:'2026-11-20',venue:'Assembly Hall',coord:'Head Admin',status:'Upcoming'},
    {name:'Debating Club Final',date:'2026-10-25',venue:'Library',coord:'Mr. Moyo',status:'Completed'},
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="School Activities" sub="Upcoming and completed events" />
      <WC><Tbl2><TH2 cols={['Activity','Date','Venue','Coordinator','Status']} /><tbody>
        {acts.map((a,i)=>(
          <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
            <td style={{padding:'9px 12px',fontWeight:500}}>{a.name}</td><td style={{padding:'9px 12px',color:'#64748b'}}>{a.date}</td>
            <td style={{padding:'9px 12px',color:'#64748b'}}>{a.venue}</td><td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{a.coord}</td>
            <td style={{padding:'9px 12px'}}><Chip label={a.status} ok={a.status==='Completed'} /></td>
          </tr>
        ))}
      </tbody></Tbl2></WC>
    </div>
  );
};

const RealApprovalsPage: React.FC<{ user: User }> = ({ user }) => {
  const isHead = user.role === 'HEAD';
  const items=[
    {type:'Leave Request',from:'Mr. Blessing Sibanda',date:'2026-11-03',status:'Pending'},
    {type:'Exam Timetable',from:'Academic Department',date:'2026-11-04',status:'Pending'},
    {type:'Budget Requisition',from:'Bursar Office',date:'2026-11-04',status:'Pending'},
    {type:'Staff Promotion',from:'HR Department',date:'2026-11-01',status:'Approved'},
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="Approvals" sub={isHead?'Review and approve pending requests':'View-only — approvals require Headmaster'} />
      {!isHead && <div style={{padding:'10px 14px',background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'3px',fontSize:'13px',color:'#92400e'}}>Only the Headmaster can approve requests.</div>}
      <WC><Tbl2><TH2 cols={['Type','From','Date','Status',...(isHead?['Action']:[])]} /><tbody>
        {items.map((a,i)=>(
          <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
            <td style={{padding:'9px 12px',fontWeight:500}}>{a.type}</td><td style={{padding:'9px 12px',color:'#64748b'}}>{a.from}</td>
            <td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{a.date}</td>
            <td style={{padding:'9px 12px'}}><Chip label={a.status} ok={a.status==='Approved'} /></td>
            {isHead && <td style={{padding:'9px 12px'}}>{a.status==='Pending'&&<div style={{display:'flex',gap:'6px'}}>
              <button style={{padding:'3px 10px',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'3px',fontSize:'12px',fontWeight:600,color:'#166534',cursor:'pointer'}}>Approve</button>
              <button style={{padding:'3px 10px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'3px',fontSize:'12px',fontWeight:600,color:'#991b1b',cursor:'pointer'}}>Decline</button>
            </div>}</td>}
          </tr>
        ))}
      </tbody></Tbl2></WC>
    </div>
  );
};

const RealMyClassesPage: React.FC<{ user: User }> = ({ user }) => {
  const teacher = dataService.getTeachers().find(t=>t.id===user.referenceId)||dataService.getTeachers()[0];
  const classes = dataService.getClasses().filter(c=>teacher?.assignedClasses.includes(c.name));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="My Classes" sub={`Assigned to ${teacher?.firstName} ${teacher?.lastName}`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '12px' }}>
        {classes.map(c=>{ const n=dataService.getStudents().filter(s=>s.classId===c.id).length; return (
          <WC key={c.id}>
            <div style={{fontSize:'15px',fontWeight:700,marginBottom:'6px'}}>{c.name}</div>
            <div style={{fontSize:'12px',color:'#64748b',marginBottom:'4px'}}>Room: {c.roomNumber}</div>
            <div style={{fontSize:'12px',color:'#64748b',marginBottom:'8px'}}>Students: {n} / {c.capacity}</div>
            <div style={{height:'4px',background:'#e2e8f0',borderRadius:'2px'}}><div style={{height:'100%',width:`${Math.min(100,Math.round(n/c.capacity*100))}%`,background:'#2F628F',borderRadius:'2px'}}/></div>
          </WC>
        );})}
      </div>
    </div>
  );
};

const RealMySubjectsPage: React.FC<{ user: User }> = ({ user }) => {
  const teacher = dataService.getTeachers().find(t=>t.id===user.referenceId)||dataService.getTeachers()[0];
  const subjects = dataService.getSubjects().filter(s=>s.teacherId===teacher?.id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="My Subjects" sub="Subjects assigned to you" />
      <WC><Tbl2><TH2 cols={['Code','Subject','Category','Level']} /><tbody>
        {subjects.map(s=>(
          <tr key={s.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
            <td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{s.code}</td>
            <td style={{padding:'9px 12px',fontWeight:500}}>{s.name}</td>
            <td style={{padding:'9px 12px'}}><Chip label={s.category} /></td>
            <td style={{padding:'9px 12px',color:'#64748b'}}>{s.level}</td>
          </tr>
        ))}
      </tbody></Tbl2></WC>
    </div>
  );
};

const RealAssignmentsPage: React.FC = () => {
  const hw=[
    {sub:'Mathematics',title:'Exercise 4.3 — Quadratic Equations',cls:'Form 1A',due:'2026-11-07',submitted:18,total:30},
    {sub:'English',title:'Essay: My Community',cls:'Form 1A',due:'2026-11-08',submitted:24,total:30},
    {sub:'Science',title:'Lab Report — Photosynthesis',cls:'Form 2A',due:'2026-11-05',submitted:30,total:32},
    {sub:'History',title:'Research: The Second Chimurenga',cls:'Form 1A',due:'2026-11-10',submitted:10,total:30},
    {sub:'Shona',title:'Essay: Tsika naMagariro',cls:'Form 3 Science',due:'2026-11-09',submitted:22,total:26},
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="Assignments" sub="Active assignments" />
      <WC><Tbl2><TH2 cols={['Subject','Title','Class','Due','Submitted','Pending']} /><tbody>
        {hw.map((h,i)=>(
          <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
            <td style={{padding:'9px 12px',fontWeight:500}}>{h.sub}</td>
            <td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{h.title}</td>
            <td style={{padding:'9px 12px'}}><Chip label={h.cls} /></td>
            <td style={{padding:'9px 12px',color:'#64748b'}}>{h.due}</td>
            <td style={{padding:'9px 12px',fontWeight:600,color:'#166534'}}>{h.submitted}</td>
            <td style={{padding:'9px 12px',fontWeight:600,color:h.total-h.submitted>0?'#991b1b':'#166534'}}>{h.total-h.submitted}</td>
          </tr>
        ))}
      </tbody></Tbl2></WC>
    </div>
  );
};

const RealMyProfilePage: React.FC<{ user: User }> = ({ user }) => {
  const rm: Record<string,string>={ADMIN:'Administrator',HEAD:'Headmaster',DEPUTY_HEAD:'Deputy Headmaster',TEACHER:'Teacher',STAFF:'School Staff',STUDENT:'Student',PARENT:'Parent'};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PH title="My Profile" sub="Your account information" />
      <WC>
        <div style={{display:'flex',gap:'16px',alignItems:'flex-start',flexWrap:'wrap' as const}}>
          <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#2F628F',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'22px',flexShrink:0}}>{user.name.charAt(0)}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:'16px',fontWeight:700,marginBottom:'4px'}}>{user.name}</div>
            <div style={{fontSize:'12px',color:'#64748b',marginBottom:'10px'}}>{rm[user.role]??user.role}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'8px',fontSize:'13px'}}>
              <div>Email: <strong>{user.email}</strong></div>
              <div>Role: <strong>{rm[user.role]??user.role}</strong></div>
              {(user as any).subRole&&<div>Sub-Role: <strong>{(user as any).subRole}</strong></div>}
            </div>
          </div>
        </div>
        <div style={{marginTop:'14px',padding:'10px 14px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'3px',fontSize:'13px',color:'#2F628F'}}>To update your profile or change your password, contact the school administrator.</div>
      </WC>
    </div>
  );
};

const RealMessagesPage: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <PH title="Messages" sub="Internal communications" />
    <WC>
      {[{from:'Mr. Tinashe Moyo',subject:'Mathematics Progress Update',date:'2026-11-03',preview:'Tatenda has shown excellent improvement in algebra this week...'},
        {from:'Class Teacher',subject:'Parent-Teacher Meeting',date:'2026-11-01',preview:'Please attend the meeting on 10 November at 2pm...'},
        {from:'Head Administrator',subject:'Term 3 Examinations',date:'2026-10-28',preview:'All students: final examinations commence 10 November...'}
      ].map((m,i)=>(
        <div key={i} style={{padding:'12px',border:'1px solid #e2e8f0',borderRadius:'3px',background:'#f8fafc',marginBottom:'8px',cursor:'pointer'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
            <span style={{fontWeight:600,fontSize:'13px'}}>{m.from}</span>
            <span style={{fontSize:'11px',color:'#94a3b8'}}>{m.date}</span>
          </div>
          <div style={{fontWeight:500,fontSize:'13px',marginBottom:'3px'}}>{m.subject}</div>
          <p style={{fontSize:'12px',color:'#64748b',margin:0}}>{m.preview}</p>
        </div>
      ))}
      <div style={{padding:'10px 14px',border:'1px dashed #bfdbfe',borderRadius:'3px',textAlign:'center',color:'#64748b',fontSize:'13px'}}>
        Contact via WhatsApp: <strong>+263 78 164 8526</strong>
      </div>
    </WC>
  </div>
);

const RealCorrespondencePage: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <PH title="School Correspondence" sub="Official letters and communications" />
    <WC>
      {[{type:'Letter',to:'Parents',subject:'Term 3 Examination Schedule',date:'2026-11-01',status:'Sent'},
        {type:'Notice',to:'All Staff',subject:'Staff Meeting — 7 November',date:'2026-11-03',status:'Sent'},
        {type:'Report',to:'Ministry',subject:'Monthly Enrolment Returns',date:'2026-10-31',status:'Submitted'}
      ].map((c,i)=>(
        <div key={i} style={{padding:'12px',border:'1px solid #e2e8f0',borderRadius:'3px',background:'#f8fafc',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontWeight:600,fontSize:'13px'}}>{c.subject}</div>
            <div style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>{c.type} · To: {c.to} · {c.date}</div>
          </div>
          <Chip label={c.status} ok />
        </div>
      ))}
    </WC>
  </div>
);

const RealDocumentsPage: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <PH title="Documents" sub="School forms and templates" />
    <WC>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'10px'}}>
        {['Admission Form','Transfer Letter Template','Leave Application Form','Staff Evaluation Form','Fee Clearance Certificate','Report Card Template','School Prospectus','Ministry Returns Form'].map((doc,i)=>(
          <div key={i} style={{padding:'12px',border:'1px solid #e2e8f0',borderRadius:'3px',background:'#f8fafc',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'13px',fontWeight:500}}>{doc}</span>
            <span style={{fontSize:'12px',color:'#2F628F',fontWeight:600,cursor:'pointer'}}>View</span>
          </div>
        ))}
      </div>
    </WC>
  </div>
);

const RealBooksPage: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <PH title="Books Catalogue" sub="All books in the library" />
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'12px'}}>
      <KPI label="Total" value={842}/><KPI label="Available" value={718} colour="#166534"/><KPI label="On Loan" value={124} colour="#2F628F"/><KPI label="Overdue" value={18} colour="#991b1b"/>
    </div>
    <WC><Tbl2><TH2 cols={['Title','Author','Category','Copies','Available']} /><tbody>
      {[['Mathematics O-Level','ZimSci','Maths',12,8],['English Anthology','Longman','English',10,7],['ZIMSEC Study Pack','ZIMSEC','Reference',20,15],['History of Zim Vol.1','Mambo Press','History',8,5],['Science Lab Manual','Cambridge','Science',15,12],['Geography Atlas','Oxford','Geography',6,6]
      ].map(([t,a,c,total,avail],i)=>(
        <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
          <td style={{padding:'9px 12px',fontWeight:500}}>{t}</td>
          <td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{a}</td>
          <td style={{padding:'9px 12px'}}><Chip label={String(c)} /></td>
          <td style={{padding:'9px 12px'}}>{total}</td>
          <td style={{padding:'9px 12px',fontWeight:600,color:Number(avail)>0?'#166534':'#991b1b'}}>{avail}</td>
        </tr>
      ))}
    </tbody></Tbl2></WC>
  </div>
);

const RealIssuePage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <PH title={title} sub="Book borrowing records" />
    <WC><Tbl2><TH2 cols={['Student','Book Title','Issue Date','Due Date','Status']} /><tbody>
      {[['Tatenda Mutasa','Mathematics O-Level','2026-10-20','2026-11-03','Overdue'],
        ['Anesu Gumbo','English Anthology','2026-10-25','2026-11-08','On Loan'],
        ['Kudzai Mupfumi','History of Zim Vol.1','2026-11-01','2026-11-15','On Loan'],
        ['Rufaro Mhlanga','ZIMSEC Study Pack','2026-10-28','2026-11-11','On Loan'],
        ['Nyasha Chikwanha','Science Lab Manual','2026-10-15','2026-10-29','Returned'],
      ].map(([s,b,i,d,st],idx)=>(
        <tr key={idx} style={{ borderBottom:'1px solid #f1f5f9' }}>
          <td style={{padding:'9px 12px',fontWeight:500}}>{s}</td>
          <td style={{padding:'9px 12px',color:'#64748b'}}>{b}</td>
          <td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{i}</td>
          <td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{d}</td>
          <td style={{padding:'9px 12px'}}><Chip label={String(st)} ok={st==='Returned'} /></td>
        </tr>
      ))}
    </tbody></Tbl2></WC>
  </div>
);

const RealHostelPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <PH title={title} sub="Boarding facility management" />
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'12px'}}>
      <KPI label="Total Boarders" value={87}/><KPI label="Present" value={82} colour="#166534"/><KPI label="Absent" value={5} colour="#991b1b"/><KPI label="On Exeat" value={3} colour="#92400e"/>
    </div>
    <WC><Tbl2><TH2 cols={['Student','Room','Block','Status','Notes']} /><tbody>
      {[['Tatenda Mutasa','12A','Block A','Present','—'],['Anesu Gumbo','14B','Block B','Present','—'],['Kudzai Mupfumi','08C','Block A','Absent','Sick bay'],['Simbarashe Machinga','22D','Block C','On Exeat','Signed out 3 Nov'],['Ruvimbo Nyamande','05A','Block A','Present','—']].map(([s,r,b,st,n],i)=>(
        <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
          <td style={{padding:'9px 12px',fontWeight:500}}>{s}</td><td style={{padding:'9px 12px'}}>{r}</td><td style={{padding:'9px 12px'}}>{b}</td>
          <td style={{padding:'9px 12px'}}><Chip label={String(st)} ok={st==='Present'} /></td><td style={{padding:'9px 12px',color:'#64748b',fontSize:'12px'}}>{n}</td>
        </tr>
      ))}
    </tbody></Tbl2></WC>
  </div>
);

const RealGenericPage: React.FC<{ title: string }> = ({ title }) => (
  <div>
    <PH title={title} />
    <WC>
      <div style={{padding:'24px',textAlign:'center',color:'#64748b',fontSize:'13px'}}>
        No content available for this section yet. Data will appear here as it is entered into the system.
      </div>
    </WC>
  </div>
);
