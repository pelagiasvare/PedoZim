import React from 'react';
import { Search, Sun, Moon, Bell, GraduationCap, ChevronDown, MessageSquare } from 'lucide-react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { ActivePage } from './Sidebar';

interface TopBarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  onSwitchUser,
  theme,
  onToggleTheme,
  searchTerm,
  onSearchChange,
  activePage,
  onNavigate,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = React.useState(false);

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':   return 'role-admin';
      case 'TEACHER': return 'role-teacher';
      case 'STUDENT': return 'role-student';
      case 'STAFF':   return 'role-staff';
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {activePage !== 'overview' && (
          <div className="topbar-search">
            <Search size={14} className="topbar-search-icon" />
            <input
              type="text"
              placeholder="Search students, records..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="topbar-right">
        {/* WhatsApp support */}
        <a
          href="https://wa.me/263781648526?text=Hello%20Pedo%20Zim,%20I%20have%20an%20inquiry"
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <MessageSquare size={12} /> Support
        </a>

        {/* Role switcher */}
        <div style={{ position: 'relative' }}>
          <button
            className="role-switcher"
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
          >
            <GraduationCap size={13} style={{ color: 'var(--text-500)' }} />
            <span>Role:</span>
            <span className={`role-tag ${getRoleBadgeClass(currentUser.role)}`}>
              {currentUser.role}
            </span>
            <ChevronDown size={12} style={{ color: 'var(--text-400)' }} />
          </button>

          {showRoleDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              background: 'var(--bg-white)',
              border: '1px solid var(--border-dark)',
              borderRadius: 'var(--radius)',
              width: '240px',
              zIndex: 200,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                Switch Role (Demo)
              </div>
              {mockUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => { onSwitchUser(u); setShowRoleDropdown(false); }}
                  style={{
                    padding: '8px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    background: u.id === currentUser.id ? 'var(--brand-light)' : 'transparent',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-900)' }}>{u.name}</span>
                    <span className={`role-tag ${getRoleBadgeClass(u.role)}`}>{u.role}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-500)' }}>{u.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button className="icon-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Notifications */}
        <button className="icon-btn" title="Notice Board" onClick={() => onNavigate('announcements')}>
          <Bell size={14} />
        </button>
      </div>
    </header>
  );
};
