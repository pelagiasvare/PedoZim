import React from 'react';
import { Users, GraduationCap, BookOpen, CalendarCheck, DollarSign, UserPlus, CreditCard, Contact, BadgeCheck } from 'lucide-react';
import { User } from '../../types';
import { dataService } from '../../services/dataService';
import { mockUsers } from '../../data/mockData';

interface Props { user: User; onNavigate: (p: string) => void; }

const BRAND = '#2F628F';

const KPI: React.FC<{ label: string; value: string|number; icon: React.ReactNode; colour?: string; sub?: string; onClick?: () => void }> = ({ label, value, icon, colour, sub, onClick }) => (
  <div onClick={onClick} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 0.12s' }}
    onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(47,98,143,0.15)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: `${colour ?? BRAND}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colour ?? BRAND }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '26px', fontWeight: 800, color: colour ?? '#0f172a', lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{sub}</div>}
  </div>
);

const TH: React.FC<{ cols: string[] }> = ({ cols }) => (
  <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
    {cols.map(c => <th key={c} style={{ padding: '9px 12px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>{c}</th>)}
  </tr></thead>
);

export const AdminDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const m          = dataService.getDashboardMetrics();
  const students   = dataService.getStudents();
  const teachers   = dataService.getTeachers();
  const anns       = dataService.getAnnouncements().slice(0, 4);
  const payments   = dataService.getPayments().slice(0, 5);
  const invoices   = dataService.getInvoices();
  const today      = new Date().toISOString().split('T')[0];
  const todayAtt   = dataService.getAttendance(today);
  const present    = todayAtt.filter(a => a.status === 'present' || a.status === 'late').length;
  const absent     = todayAtt.filter(a => a.status === 'absent').length;
  const totalDue   = invoices.reduce((s, i) => s + i.totalDue, 0);
  const totalPaid  = invoices.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = totalDue - totalPaid;
  const parentCount = mockUsers.filter(u => u.role === 'PARENT').length;
  const staffCount  = mockUsers.filter(u => u.role === 'STAFF').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Admin Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>Academic Year 2026 · Term 3 · Welcome, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
          <button onClick={() => onNavigate('students')} style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '34px', padding: '0 14px', background: BRAND, color: '#fff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <UserPlus size={14} /> Admit Student
          </button>
          <button onClick={() => onNavigate('fees')} style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '34px', padding: '0 14px', background: '#fff', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '5px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <CreditCard size={14} /> Record Payment
          </button>
        </div>
      </div>

      {/* KPI Cards — 9 live stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '14px' }}>
        <KPI label="Total Students"   value={students.length}       icon={<Users size={16}/>}         onClick={() => onNavigate('students')} />
        <KPI label="Total Teachers"   value={teachers.length}       icon={<GraduationCap size={16}/>} onClick={() => onNavigate('teachers')} />
        <KPI label="Parents"          value={parentCount}           icon={<Contact size={16}/>}       onClick={() => onNavigate('parents')} />
        <KPI label="School Staff"     value={staffCount}            icon={<BadgeCheck size={16}/>}    onClick={() => onNavigate('school-staff')} />
        <KPI label="Total Classes"    value={m.totalClasses}        icon={<BookOpen size={16}/>}      onClick={() => onNavigate('classes')} />
        <KPI label="Present Today"    value={present || '—'}        icon={<CalendarCheck size={16}/>} colour="#166534" sub="Students" />
        <KPI label="Absent Today"     value={absent || '—'}         icon={<CalendarCheck size={16}/>} colour="#991b1b" sub="Students" />
        <KPI label="Fees Collected"   value={`$${totalPaid.toLocaleString()}`}     icon={<DollarSign size={16}/>} colour="#166534" sub={`${m.feeCollectionRate}% rate`} onClick={() => onNavigate('fees')} />
        <KPI label="Outstanding Fees" value={`$${outstanding.toLocaleString()}`}  icon={<DollarSign size={16}/>} colour="#991b1b" sub="Unpaid balance" onClick={() => onNavigate('fees')} />
      </div>

      {/* Two-column: payments + announcements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '16px' }}>

        {/* Recent Payments */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Recent Payments</span>
            <button onClick={() => onNavigate('fees')} style={{ fontSize: '12px', color: BRAND, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <TH cols={['Student', 'Method', 'Amount', 'Date']} />
              <tbody>
                {payments.length === 0
                  ? <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No payments yet.</td></tr>
                  : payments.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 500 }}>{p.studentName}</td>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}>{p.paymentMethod}</td>
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: '#166534' }}>${p.amount}</td>
                    <td style={{ padding: '9px 12px', color: '#64748b', fontSize: '12px' }}>{p.paymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Announcements */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Announcements</span>
            <button onClick={() => onNavigate('announcements')} style={{ fontSize: '12px', color: BRAND, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Manage →</button>
          </div>
          <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {anns.map(a => (
              <div key={a.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '5px', borderLeft: a.isPinned ? `3px solid ${BRAND}` : '3px solid #e2e8f0' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{a.title}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{a.publishedDate} · {a.category} · {a.targetAudience}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Students at a glance */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>Students at a Glance</span>
          <button onClick={() => onNavigate('students')} style={{ fontSize: '12px', color: BRAND, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Manage students →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <TH cols={['Admission #', 'Name', 'Class', 'Gender', 'Status']} />
            <tbody>
              {students.slice(0, 8).map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 12px', color: '#64748b', fontSize: '12px' }}>{s.admissionNumber}</td>
                  <td style={{ padding: '9px 12px', fontWeight: 500 }}>{s.firstName} {s.lastName}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: '#eff6ff', color: BRAND, border: '1px solid #bfdbfe' }}>{s.className}</span>
                  </td>
                  <td style={{ padding: '9px 12px', color: '#64748b' }}>{s.gender}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: s.status==='Active'?'#f0fdf4':'#fef2f2', color: s.status==='Active'?'#166534':'#991b1b', border: `1px solid ${s.status==='Active'?'#bbf7d0':'#fecaca'}` }}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
