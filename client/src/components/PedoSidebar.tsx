      /**
 * PedoSidebar — universal sidebar component for all roles.
 *
 * Colours: #1a3a5c background, #2F628F active, white text
 * Width: 250px desktop, drawer on mobile
 * Logo: /logo.png (place logo in client/public/logo.png)
 */
import React, { useState } from 'react';
import { LogOut, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { User } from '../types';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: SidebarNavItem[];
}

interface Props {
  nav: SidebarNavItem[];
  activePage: string;
  onSelect: (id: string) => void;
  currentUser: User;
  onLogout: () => void;
  roleLabel: string;
  portalLabel?: string;
}

// ── Colour tokens ──────────────────────────────────────────────────────
const BG       = '#152b42';       // sidebar background
const BG_HOVER = 'rgba(47,98,143,0.45)';
const ACTIVE   = '#2F628F';       // active item
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = 'rgba(255,255,255,0.90)';
const MUTED    = 'rgba(255,255,255,0.45)';

// ── Single nav button ──────────────────────────────────────────────────
const NavBtn: React.FC<{
  item: SidebarNavItem;
  activePage: string;
  depth: number;
  onSelect: (id: string) => void;
}> = ({ item, activePage, depth, onSelect }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive    = activePage === item.id;
  const anyChildActive = hasChildren && item.children!.some((c) => c.id === activePage);

  const handleClick = () => {
    if (hasChildren) {
      setOpen((p) => !p);
    } else {
      onSelect(item.id);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        title={item.label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          minHeight: '38px',
          padding: `0 ${depth > 0 ? 28 + depth * 12 : 12}px`,
          background: isActive ? ACTIVE : anyChildActive ? 'rgba(47,98,143,0.2)' : 'transparent',
          border: 'none',
          borderRadius: '5px',
          color: isActive ? '#fff' : TEXT,
          fontSize: '13px',
          fontWeight: isActive ? 600 : 400,
          textAlign: 'left',
          cursor: 'pointer',
          marginBottom: '1px',
          transition: 'background 0.12s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = BG_HOVER; }}
        onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = anyChildActive ? 'rgba(47,98,143,0.2)' : 'transparent'; }}
      >
        <span style={{ opacity: isActive ? 1 : 0.65, display: 'flex', flexShrink: 0 }}>
          {item.icon}
        </span>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.label}
        </span>
        {hasChildren && (
          <span style={{ opacity: 0.5, display: 'flex', marginLeft: 'auto' }}>
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </span>
        )}
      </button>
      {hasChildren && open && item.children!.map((child) => (
        <NavBtn key={child.id} item={child} activePage={activePage} depth={depth + 1} onSelect={onSelect} />
      ))}
    </>
  );
};

// ── Sidebar body (reused for both desktop and mobile) ──────────────────
const SidebarBody: React.FC<Props & { onClose?: () => void }> = ({
  nav, activePage, onSelect, currentUser, onLogout, roleLabel, portalLabel, onClose,
}) => (
  <div style={{
    width: '250px',
    background: BG,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
    flexShrink: 0,
    fontFamily: 'Inter,system-ui,sans-serif',
  }}>
    {/* Logo + school name */}
    <div style={{ padding: '16px 14px', borderBottom: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
      <img
        src="/logo.png"
        alt="Pedo Zim Logo"
        style={{ width: '130px', height: 'auto', objectFit: 'contain' }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div style={{ display: 'none', flexDirection: 'column' as const, alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff', lineHeight: 1.15 }}>
          Pedo<span style={{ color: '#4da6d9' }}>Zim</span>
        </div>
        <div style={{ fontSize: '10px', color: MUTED, letterSpacing: '0.04em', marginTop: '1px' }}>
          School Management System
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '10px', background: 'none', border: 'none', color: MUTED, cursor: 'pointer', display: 'flex' }}>
          <X size={16} />
        </button>
      )}
    </div>

    {/* Logged-in user badge */}
    <div style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: ACTIVE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentUser.name}
          </div>
          <div style={{ fontSize: '11px', color: MUTED, marginTop: '1px' }}>{roleLabel}</div>
        </div>
      </div>
      {portalLabel && (
        <div style={{ marginTop: '6px', display: 'inline-block', padding: '2px 8px', borderRadius: '3px', background: ACTIVE, fontSize: '10px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {portalLabel}
        </div>
      )}
    </div>

    {/* Nav items */}
    <nav style={{ padding: '8px', flex: 1 }}>
      <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, padding: '6px 8px 6px', marginBottom: '2px' }}>
        Navigation
      </div>
      {nav.map((item) => (
        <NavBtn key={item.id} item={item} activePage={activePage} depth={0} onSelect={(id) => { onSelect(id); onClose?.(); }} />
      ))}
    </nav>

    {/* Logout */}
    <div style={{ padding: '10px', borderTop: `1px solid ${BORDER}` }}>
      <button
        onClick={onLogout}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', height: '38px', padding: '0 12px', background: 'transparent', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: '5px', color: TEXT, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        <LogOut size={15} style={{ opacity: 0.7 }} />
        Logout
      </button>
    </div>
  </div>
);

// ── Public export ──────────────────────────────────────────────────────
export const PedoSidebar: React.FC<Props> = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="pedo-sidebar-desktop" style={{ position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <SidebarBody {...props} />
      </div>

      {/* Mobile hamburger button — shown in topbar via CSS */}
      <button
        className="pedo-sidebar-hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', alignItems: 'center' }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <SidebarBody {...props} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
