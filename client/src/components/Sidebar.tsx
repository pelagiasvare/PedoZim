import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  Receipt,
  Megaphone,
  BarChart3,
  School,
  Globe,
} from 'lucide-react';
import { User } from '../types';

export type ActivePage =
  | 'overview'
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'attendance'
  | 'marks'
  | 'fees'
  | 'announcements'
  | 'reports';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, currentUser }) => {
  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; roles?: string[] }[] = [
    { id: 'dashboard',     label: 'Dashboard',      icon: <LayoutDashboard size={15} /> },
    { id: 'students',      label: 'Students',        icon: <Users size={15} />,          roles: ['ADMIN','TEACHER','STAFF'] },
    { id: 'teachers',      label: 'Teachers',        icon: <GraduationCap size={15} />,  roles: ['ADMIN','STAFF'] },
    { id: 'classes',       label: 'Classes',         icon: <BookOpen size={15} /> },
    { id: 'attendance',    label: 'Attendance',      icon: <CalendarCheck size={15} /> },
    { id: 'marks',         label: 'ZIMSEC Marks',    icon: <FileSpreadsheet size={15} /> },
    { id: 'fees',          label: 'Fees & Accounts', icon: <Receipt size={15} /> },
    { id: 'announcements', label: 'Notice Board',    icon: <Megaphone size={15} /> },
    { id: 'reports',       label: 'Reports',         icon: <BarChart3 size={15} /> },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  });

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-header" onClick={() => onNavigate('overview')} style={{ cursor: 'pointer', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
          src="/logo.png"
          alt="Pedo Zim Logo"
          style={{ height: '36px', maxWidth: '140px', width: 'auto', objectFit: 'contain', display: 'block' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
            const fallback = document.getElementById('sidebar-brand-text-fallback');
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div id="sidebar-brand-text-fallback" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <div className="brand-badge">
            <School size={14} />
          </div>
          <div>
            <div className="brand-title">Pedo Zim</div>
            <div className="brand-subtitle">School Management</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">

        <div className="nav-section-title">School Operations</div>
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          {currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="user-avatar" />
          ) : (
            <div className="user-avatar-placeholder">{currentUser.name.charAt(0)}</div>
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-500)' }}>
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
