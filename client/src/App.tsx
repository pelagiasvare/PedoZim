import React, { useState, useEffect } from 'react';
import { Sidebar, ActivePage } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { TeachersPage } from './pages/TeachersPage';
import { ClassesSubjectsPage } from './pages/ClassesSubjectsPage';
import { AttendancePage } from './pages/AttendancePage';
import { MarksPage } from './pages/MarksPage';
import { FeesPage } from './pages/FeesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ReportsPage } from './pages/ReportsPage';
import { PedoLandingPage } from './pages/PedoLandingPage';
// Role-based portals
import { ParentPortal } from './portals/ParentPortal';
import { StudentPortal } from './portals/StudentPortal';
import { OrgPortal } from './portals/OrgPortal';
import { User, PortalView } from './types';
import { mockUsers } from './data/mockData';
import { School } from 'lucide-react';
import './styles/design-system.css';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [activePage, setActivePage] = useState<ActivePage>('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [portalView, setPortalView] = useState<PortalView>('landing');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === 'dark' ? 'light' : 'dark'));

  // When a user logs in from the landing page, route them to their correct portal
  const handleLogin = (user?: User, page?: ActivePage) => {
    const u = user || currentUser;
    setCurrentUser(u);
    if (u.role === 'PARENT') {
      setPortalView('parent');
    } else if (u.role === 'STUDENT') {
      setPortalView('student');
    } else if (u.role === 'ORG') {
      setPortalView('org');
    } else {
      // ADMIN, TEACHER, STAFF → staff dashboard
      setPortalView('staff');
      setActivePage(page || 'dashboard');
    }
    window.scrollTo({ top: 0 });
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setPortalView('landing');
    setActivePage('overview');
    window.scrollTo({ top: 0 });
  };

  // ── LANDING ──────────────────────────────────────────────────────────
  if (portalView === 'landing') {
    return (
      <PedoLandingPage
        onEnterPortal={(page, user) => handleLogin(user, page)}
        mockUsers={mockUsers}
      />
    );
  }

  // ── PARENT PORTAL ─────────────────────────────────────────────────────
  if (portalView === 'parent') {
    return <ParentPortal currentUser={currentUser} onLogout={handleLogout} />;
  }

  // ── STUDENT PORTAL ────────────────────────────────────────────────────
  if (portalView === 'student') {
    return <StudentPortal currentUser={currentUser} onLogout={handleLogout} />;
  }

  // ── ORG PORTAL ────────────────────────────────────────────────────────
  if (portalView === 'org') {
    return <OrgPortal currentUser={currentUser} onLogout={handleLogout} />;
  }

  // ── STAFF / ADMIN DASHBOARD ───────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <DashboardPage currentUser={currentUser} onNavigate={handleNavigate} onOpenNewStudentModal={() => handleNavigate('students')} onOpenRecordPaymentModal={() => handleNavigate('fees')} />;
      case 'students':     return <StudentsPage />;
      case 'teachers':     return <TeachersPage />;
      case 'classes':      return <ClassesSubjectsPage />;
      case 'attendance':   return <AttendancePage />;
      case 'marks':        return <MarksPage />;
      case 'fees':         return <FeesPage />;
      case 'announcements':return <AnnouncementsPage />;
      case 'reports':      return <ReportsPage />;
      default:             return <DashboardPage currentUser={currentUser} onNavigate={handleNavigate} onOpenNewStudentModal={() => handleNavigate('students')} onOpenRecordPaymentModal={() => handleNavigate('fees')} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="pedo-nav-wrapper">
        <div className="pedo-nav-container">
          <div className="pedo-brand" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <div className="pedo-logo-icon"><School size={18} /></div>
            <div className="pedo-brand-title">Pedo <span>Zim</span></div>
          </div>
          <nav className="pedo-nav-links">
            {(['dashboard','students','attendance','marks','fees'] as ActivePage[]).map((p) => (
              <button key={p} className={`pedo-nav-link ${activePage === p ? 'active' : ''}`} onClick={() => handleNavigate(p)}>
                {p === 'dashboard' ? 'Dashboard' : p === 'students' ? 'Students' : p === 'attendance' ? 'Attendance' : p === 'marks' ? 'ZIMSEC Marks' : 'Fees'}
              </button>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn-nav-overview" onClick={handleLogout}>← Back to Home</button>
          </div>
        </div>
      </header>

      <div className="app-layout">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} currentUser={currentUser} />
        <div className="main-wrapper">
          <TopBar
            currentUser={currentUser}
            onSwitchUser={(u) => { setCurrentUser(u); handleLogin(u); }}
            theme={theme}
            onToggleTheme={toggleTheme}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activePage={activePage}
            onNavigate={handleNavigate}
          />
          <main className="content-area">{renderPage()}</main>
        </div>
      </div>
    </div>
  );
};

export default App;
