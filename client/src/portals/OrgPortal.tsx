import React, { useState } from 'react';
import {
  LayoutDashboard, Building2, PlusCircle, CreditCard,
  BarChart3, FileText, Megaphone, Settings, School, LogOut, Bell,
} from 'lucide-react';
import { User } from '../types';
import { dataService } from '../services/dataService';
import { Badge, Card, PT, SC, TH } from './ParentPortal';

type OrgPage = 'dashboard' | 'schools' | 'register' | 'subscriptions' | 'performance' | 'reports' | 'announcements' | 'settings';

interface Props { currentUser: User; onLogout: () => void; }

const NAV: { id: OrgPage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',     label: 'Dashboard',            icon: <LayoutDashboard size={15} /> },
  { id: 'schools',       label: 'Schools Management',   icon: <Building2 size={15} /> },
  { id: 'register',      label: 'School Registration',  icon: <PlusCircle size={15} /> },
  { id: 'subscriptions', label: 'Subscriptions',        icon: <CreditCard size={15} /> },
  { id: 'performance',   label: 'School Performance',   icon: <BarChart3 size={15} /> },
  { id: 'reports',       label: 'Reports',              icon: <FileText size={15} /> },
  { id: 'announcements', label: 'Announcements',        icon: <Megaphone size={15} /> },
  { id: 'settings',      label: 'Org Settings',         icon: <Settings size={15} /> },
];

// Mock org-level data
const SCHOOLS = [
  { id: 'sch-1', name: 'Harare Central High School', location: 'Harare', students: 151, teachers: 14, plan: 'Standard', status: 'Active',   joined: '2025-01-10' },
  { id: 'sch-2', name: 'Bulawayo Academy',           location: 'Bulawayo', students: 243, teachers: 21, plan: 'Premium', status: 'Active',   joined: '2025-03-15' },
  { id: 'sch-3', name: 'Masvingo Primary',            location: 'Masvingo', students: 89,  teachers: 8,  plan: 'Basic',   status: 'Active',   joined: '2025-06-01' },
  { id: 'sch-4', name: 'Mutare Girls High',           location: 'Mutare',   students: 178, teachers: 16, plan: 'Standard',status: 'Active',   joined: '2025-07-20' },
  { id: 'sch-5', name: 'Gweru Technical',             location: 'Gweru',    students: 0,   teachers: 0,  plan: 'Basic',   status: 'Inactive', joined: '2025-09-05' },
];

export const OrgPortal: React.FC<Props> = ({ currentUser, onLogout }) => {
  const [page, setPage] = useState<OrgPage>('dashboard');

  const render = () => {
    switch (page) {
      case 'dashboard':     return <ODash go={setPage} />;
      case 'schools':       return <OSchools />;
      case 'register':      return <OReg />;
      case 'subscriptions': return <OSubs />;
      case 'performance':   return <OPerf />;
      case 'reports':       return <ORep />;
      case 'announcements': return <OAnn />;
      case 'settings':      return <OSet currentUser={currentUser} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', background: '#f1f5f9' }}>
      <header style={{ height: '52px', background: '#7c3aed', borderBottom: '1px solid #6d28d9', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', position: 'sticky', top: 0, zIndex: 200, flexShrink: 0 }}>
        <img
          src="/logo.png"
          alt="Pedo Zim Logo"
          style={{ height: '36px', width: 'auto', maxWidth: '140px', objectFit: 'contain', display: 'block' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
            const fallback = document.getElementById('org-header-brand-fallback');
            if (fallback) fallback.style.display = 'inline-flex';
          }}
        />
        <span id="org-header-brand-fallback" style={{ display: 'none', alignItems: 'center', gap: '6px' }}>
          <School size={16} color="#fff" />
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Pedo <span style={{ color: '#c4b5fd' }}>Zim</span></span>
        </span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', flex: 1 }}>— Organisation Dashboard</span>
        <Bell size={14} color="rgba(255,255,255,0.7)" />
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginLeft: '8px' }}>{currentUser.name}</span>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '3px', color: '#fff', fontSize: '12px', padding: '3px 8px', cursor: 'pointer' }}>
          <LogOut size={12} /> Sign Out
        </button>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: '220px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'sticky', top: '46px', height: 'calc(100vh - 46px)', overflowY: "auto", overflowX: "hidden", flexShrink: 0 }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', background: '#faf5ff' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '4px' }}>Organisation</div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Pedo Zim Ltd.</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Harare, Zimbabwe</div>
          </div>
          <nav style={{ padding: '8px', flex: 1 }}>
            {NAV.map((item) => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '32px', padding: '0 8px', background: page === item.id ? '#faf5ff' : 'transparent', border: 'none', borderRadius: '3px', color: page === item.id ? '#7c3aed' : '#334155', fontSize: '13px', fontWeight: page === item.id ? 600 : 500, textAlign: 'left', cursor: 'pointer', marginBottom: '1px' }}>
                <span style={{ color: page === item.id ? '#7c3aed' : '#94a3b8', display: 'flex' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        <main style={{ flex: 1, padding: '20px', minWidth: 0 }}>{render()}</main>
      </div>
    </div>
  );
};

const activeSchools   = SCHOOLS.filter((s) => s.status === 'Active').length;
const inactiveSchools = SCHOOLS.filter((s) => s.status === 'Inactive').length;
const totalStudents   = SCHOOLS.reduce((a, s) => a + s.students, 0);
const totalTeachers   = SCHOOLS.reduce((a, s) => a + s.teachers, 0);

const ODash: React.FC<{ go: (p: OrgPage) => void }> = ({ go }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ background: '#7c3aed', borderRadius: '3px', padding: '16px 20px', color: '#fff' }}>
      <div style={{ fontSize: '18px', fontWeight: 700 }}>Organisation Overview</div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '3px' }}>Pedo Zim Ltd. · System-wide metrics for November 2026</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px' }}>
      <SC label="Total Schools" value={`${SCHOOLS.length}`} sub="registered" />
      <SC label="Active" value={`${activeSchools}`} colour="#166534" />
      <SC label="Inactive" value={`${inactiveSchools}`} colour="#991b1b" />
      <SC label="Total Students" value={`${totalStudents}`} sub="across all schools" />
      <SC label="Total Teachers" value={`${totalTeachers}`} sub="across all schools" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '12px' }}>
      <Card>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          Schools Overview
          <button onClick={() => go('schools')} style={{ fontSize: '12px', color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer' }}>Manage →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <TH cols={['School', 'Students', 'Status']} />
            <tbody>
              {SCHOOLS.slice(0, 4).map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '8px 12px' }}>{s.students}</td>
                  <td style={{ padding: '8px 12px' }}><Badge label={s.status} color={s.status === 'Active' ? '#166534' : '#991b1b'} bg={s.status === 'Active' ? '#f0fdf4' : '#fef2f2'} border={s.status === 'Active' ? '#bbf7d0' : '#fecaca'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Subscription Revenue (Est.)</div>
        {SCHOOLS.filter((s) => s.status === 'Active').map((s) => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
            <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{s.name}</span>
            <span style={{ fontWeight: 700, color: '#166534' }}>${(s.students * 0.5).toFixed(0)}/mo</span>
          </div>
        ))}
        <div style={{ marginTop: '8px', padding: '8px 10px', background: '#faf5ff', borderRadius: '3px', border: '1px solid #e9d5ff', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>Est. Monthly Total</span>
          <span style={{ fontWeight: 700, color: '#7c3aed' }}>${(totalStudents * 0.5).toFixed(0)}/mo</span>
        </div>
      </Card>
    </div>
  </div>
);

const OSchools: React.FC = () => (
  <div>
    <PT t="Schools Management" s="All registered schools on the Pedo Zim platform" />
    <Card>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <TH cols={['School Name', 'Location', 'Students', 'Teachers', 'Plan', 'Status', 'Joined']} />
          <tbody>
            {SCHOOLS.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 12px', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '9px 12px', color: '#64748b' }}>{s.location}</td>
                <td style={{ padding: '9px 12px' }}>{s.students}</td>
                <td style={{ padding: '9px 12px' }}>{s.teachers}</td>
                <td style={{ padding: '9px 12px' }}><Badge label={s.plan} color="#7c3aed" bg="#faf5ff" border="#e9d5ff" /></td>
                <td style={{ padding: '9px 12px' }}><Badge label={s.status} color={s.status === 'Active' ? '#166534' : '#991b1b'} bg={s.status === 'Active' ? '#f0fdf4' : '#fef2f2'} border={s.status === 'Active' ? '#bbf7d0' : '#fecaca'} /></td>
                <td style={{ padding: '9px 12px', color: '#64748b', fontSize: '12px' }}>{s.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const OReg: React.FC = () => {
  const [form, setForm] = useState({ name: '', location: '', adminEmail: '', adminName: '', plan: 'Basic' });
  return (
    <div>
      <PT t="School Registration" s="Register a new school on the Pedo Zim platform" />
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
          {[['School Name', 'name', 'text', 'e.g. Gweru Central High School'], ['School Location', 'location', 'text', 'e.g. Gweru, Zimbabwe'], ['Admin Email', 'adminEmail', 'email', 'e.g. admin@school.ac.zw'], ['Admin Full Name', 'adminName', 'text', 'e.g. Mr. John Doe']].map(([label, key, type, ph]) => (
            <div key={String(key)} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{label}</label>
              <input type={String(type)} placeholder={String(ph)} value={(form as any)[String(key)]} onChange={(e) => setForm({ ...form, [String(key)]: e.target.value })}
                style={{ height: '30px', padding: '0 8px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Subscription Plan</label>
            <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}
              style={{ height: '30px', padding: '0 8px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}>
              <option value="Basic">Basic — $0.50/student/mo</option>
              <option value="Standard">Standard — $0.75/student/mo</option>
              <option value="Premium">Premium — $1.00/student/mo</option>
            </select>
          </div>
          <button style={{ height: '32px', background: '#7c3aed', color: '#fff', border: '1px solid #6d28d9', borderRadius: '3px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}
            onClick={() => alert('School registration submitted. Admin credentials will be emailed within 24 hours.')}>
            Register School
          </button>
        </div>
      </Card>
    </div>
  );
};

const OSubs: React.FC = () => (
  <div>
    <PT t="Subscriptions" s="Monitor school subscription status and billing" />
    <Card>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <TH cols={['School', 'Plan', 'Students', 'Monthly Fee', 'Status', 'Next Billing']} />
          <tbody>
            {SCHOOLS.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 12px', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '9px 12px' }}><Badge label={s.plan} color="#7c3aed" bg="#faf5ff" border="#e9d5ff" /></td>
                <td style={{ padding: '9px 12px' }}>{s.students}</td>
                <td style={{ padding: '9px 12px', fontWeight: 700 }}>${(s.students * 0.5).toFixed(0)}</td>
                <td style={{ padding: '9px 12px' }}><Badge label={s.status} color={s.status === 'Active' ? '#166534' : '#991b1b'} bg={s.status === 'Active' ? '#f0fdf4' : '#fef2f2'} border={s.status === 'Active' ? '#bbf7d0' : '#fecaca'} /></td>
                <td style={{ padding: '9px 12px', color: '#64748b', fontSize: '12px' }}>2026-12-01</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '12px', padding: '10px 14px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <span style={{ fontWeight: 600 }}>Total Monthly Revenue</span>
        <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '15px' }}>${(totalStudents * 0.5).toFixed(0)} USD</span>
      </div>
    </Card>
  </div>
);

const OPerf: React.FC = () => (
  <div>
    <PT t="School Performance" s="Academic and operational performance across all schools" />
    <Card>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <TH cols={['School', 'Students', 'Avg Attendance', 'Fee Collection', 'Rating']} />
          <tbody>
            {SCHOOLS.filter((s) => s.status === 'Active').map((s, i) => {
              const att = [96, 94, 91, 93][i] || 90;
              const fee = [77, 85, 62, 88][i] || 70;
              const rating = att >= 95 && fee >= 80 ? 'Excellent' : att >= 90 ? 'Good' : 'Needs Attention';
              const rc = rating === 'Excellent' ? { color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' } : rating === 'Good' ? { color: '#2F628F', bg: '#eff6ff', border: '#bfdbfe' } : { color: '#92400e', bg: '#fffbeb', border: '#fde68a' };
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 12px', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '9px 12px' }}>{s.students}</td>
                  <td style={{ padding: '9px 12px' }}>{att}%</td>
                  <td style={{ padding: '9px 12px' }}>{fee}%</td>
                  <td style={{ padding: '9px 12px' }}><Badge label={rating} {...rc} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const ORep: React.FC = () => (
  <div>
    <PT t="Reports" s="System-wide reports and analytics" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '10px' }}>
      {['Monthly Subscription Report', 'School Enrollment Summary', 'Fee Collection Report', 'Teacher Deployment Report', 'Student Population Report', 'Inactive School Analysis'].map((r, i) => (
        <div key={i} style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '3px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>{r}</span>
          <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 600 }}>CSV →</span>
        </div>
      ))}
    </div>
    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '3px', fontSize: '13px', color: '#6d28d9' }}>
      Advanced analytics dashboard with charts coming in the next release.
    </div>
  </div>
);

const OAnn: React.FC = () => {
  const anns = dataService.getAnnouncements();
  return (
    <div>
      <PT t="Organisation Announcements" s="Broadcast messages to all schools" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {anns.map((a) => (
          <div key={a.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '14px 16px', borderLeft: a.isPinned ? '3px solid #7c3aed' : '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{a.title}</div>
            <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: 1.6 }}>{a.content}</p>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>Published {a.publishedDate} by {a.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OSet: React.FC<{ currentUser: User }> = ({ currentUser }) => (
  <div>
    <PT t="Organisation Settings" s="Manage your organisation account" />
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[['Name', currentUser.name], ['Email', currentUser.email], ['Role', currentUser.role], ['Organisation', 'Pedo Zim Ltd.'], ['Country', 'Zimbabwe']].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '140px', fontSize: '13px', color: '#64748b' }}>{l}</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{v}</div>
          </div>
        ))}
        <div style={{ marginTop: '8px', padding: '10px 14px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '3px', fontSize: '13px', color: '#6d28d9' }}>
          For platform configuration changes, contact your Pedo Zim system administrator.
        </div>
      </div>
    </Card>
  </div>
);
