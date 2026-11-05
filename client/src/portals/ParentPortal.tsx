import React, { useState } from 'react';
import {
  LayoutDashboard, Users, BarChart3, CalendarCheck, Receipt,
  BookOpen, Clock, Megaphone, MessageSquare, Settings,
  School, LogOut, Bell, Download, Phone, MapPin,
} from 'lucide-react';
import { User } from '../types';
import { dataService } from '../services/dataService';

type ParentPage =
  | 'dashboard' | 'children' | 'performance' | 'attendance'
  | 'fees' | 'homework' | 'timetable' | 'announcements' | 'messages' | 'settings';

interface Props { currentUser: User; onLogout: () => void; }

const NAV: { id: ParentPage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',     label: 'Dashboard',            icon: <LayoutDashboard size={15} /> },
  { id: 'children',      label: 'My Children',          icon: <Users size={15} /> },
  { id: 'performance',   label: 'Academic Performance', icon: <BarChart3 size={15} /> },
  { id: 'attendance',    label: 'Attendance',           icon: <CalendarCheck size={15} /> },
  { id: 'fees',          label: 'Fees & Payments',      icon: <Receipt size={15} /> },
  { id: 'homework',      label: 'Homework',             icon: <BookOpen size={15} /> },
  { id: 'timetable',     label: 'Timetable',            icon: <Clock size={15} /> },
  { id: 'announcements', label: 'Announcements',        icon: <Megaphone size={15} /> },
  { id: 'messages',      label: 'Messages',             icon: <MessageSquare size={15} /> },
  { id: 'settings',      label: 'Settings',             icon: <Settings size={15} /> },
];

export const gradeStyle = (g: string) => {
  if (g === 'A') return { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
  if (g === 'B') return { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' };
  if (g === 'U') return { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' };
  return { bg: '#fffbeb', color: '#92400e', border: '#fde68a' };
};

export const PT: React.FC<{ t: string; s?: string }> = ({ t, s }) => (
  <div style={{ marginBottom: '16px' }}>
    <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t}</h1>
    {s && <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>{s}</p>}
  </div>
);

export const SC: React.FC<{ label: string; value: string; colour?: string; sub?: string }> = ({ label, value, colour, sub }) => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '14px 16px' }}>
    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#64748b', marginBottom: '6px' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: 700, color: colour || '#0f172a' }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{sub}</div>}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '16px' }}>{children}</div>
);

export const Badge: React.FC<{ label: string; color: string; bg: string; border: string }> = ({ label, color, bg, border }) => (
  <span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: bg, color, border: `1px solid ${border}` }}>{label}</span>
);

export const TH: React.FC<{ cols: string[] }> = ({ cols }) => (
  <thead>
    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      {cols.map((c) => (
        <th key={c} style={{ padding: '8px 12px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>{c}</th>
      ))}
    </tr>
  </thead>
);

export const ParentPortal: React.FC<Props> = ({ currentUser, onLogout }) => {
  const [page, setPage] = useState<ParentPage>('dashboard');

  const childId = currentUser.referenceId || 'std-1';
  const child   = dataService.getStudentById(childId) || dataService.getStudents()[0];
  const marks   = child ? dataService.getMarksByStudent(child.id) : [];
  const invoice = child ? dataService.getInvoices().find((i) => i.studentId === child.id) || null : null;
  const anns    = dataService.getAnnouncements().filter((a) => a.targetAudience === 'All' || a.targetAudience === 'Parents');
  const avg     = marks.length > 0 ? Math.round(marks.reduce((s, m) => s + m.totalScore, 0) / marks.length) : 0;

  const render = () => {
    switch (page) {
      case 'dashboard':     return <PHome   child={child} marks={marks} invoice={invoice} avg={avg} anns={anns} go={setPage} />;
      case 'children':      return <PChild  child={child} />;
      case 'performance':   return <PPerf   child={child} marks={marks} avg={avg} />;
      case 'attendance':    return <PAtt    child={child} />;
      case 'fees':          return <PFees   child={child} invoice={invoice} />;
      case 'homework':      return <PHW />;
      case 'timetable':     return <PTT />;
      case 'announcements': return <PAnn    anns={anns} />;
      case 'messages':      return <PMsg />;
      case 'settings':      return <PSet    currentUser={currentUser} />;
      default:              return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', background: '#f1f5f9' }}>
      <header style={{ height: '46px', background: '#1e40af', borderBottom: '1px solid #1e3a8a', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', position: 'sticky', top: 0, zIndex: 200, flexShrink: 0 }}>
        <School size={16} color="#fff" />
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Pedo <span style={{ color: '#93c5fd' }}>Zim</span></span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', flex: 1 }}>— Parent Portal</span>
        <Bell size={14} color="rgba(255,255,255,0.7)" />
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginLeft: '8px' }}>{currentUser.name}</span>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '3px', color: '#fff', fontSize: '12px', padding: '3px 8px', cursor: 'pointer' }}>
          <LogOut size={12} /> Sign Out
        </button>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: '220px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'sticky', top: '46px', height: 'calc(100vh - 46px)', overflowY: 'auto', flexShrink: 0 }}>
          {child && (
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '5px' }}>My Child</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '3px', background: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{child.firstName[0]}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12px' }}>{child.firstName} {child.lastName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{child.className}</div>
                </div>
              </div>
            </div>
          )}
          <nav style={{ padding: '8px', flex: 1 }}>
            {NAV.map((item) => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '32px', padding: '0 8px', background: page === item.id ? '#eff6ff' : 'transparent', border: 'none', borderRadius: '3px', color: page === item.id ? '#1e40af' : '#334155', fontSize: '13px', fontWeight: page === item.id ? 600 : 500, textAlign: 'left', cursor: 'pointer', marginBottom: '1px' }}>
                <span style={{ color: page === item.id ? '#1e40af' : '#94a3b8', display: 'flex' }}>{item.icon}</span>
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

// ── Dashboard Home ─────────────────────────────────────────────────────
const PHome: React.FC<any> = ({ child, marks, invoice, avg, anns, go }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <PT t="Dashboard" s={`Welcome back. Monitoring ${child?.firstName || 'your child'}'s progress.`} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px' }}>
      <SC label="Class" value={child?.className || '—'} sub={child?.admissionNumber} />
      <SC label="Avg Score" value={avg ? `${avg}%` : '—'} colour={avg >= 70 ? '#166534' : avg >= 50 ? '#92400e' : '#991b1b'} sub="Term 3 2026" />
      <SC label="Fee Balance" value={invoice ? `$${invoice.balance}` : '$0'} colour={invoice?.balance === 0 ? '#166534' : '#991b1b'} sub={invoice?.status} />
      <SC label="Subjects" value={`${marks.length}`} sub="with marks" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '12px' }}>
      <Card>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Recent Marks
          <button onClick={() => go('performance')} style={{ fontSize: '12px', color: '#1e40af', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
        </div>
        {marks.length === 0 ? <p style={{ fontSize: '12px', color: '#94a3b8' }}>No marks yet.</p> : marks.slice(0, 4).map((m: any) => {
          const gs = gradeStyle(m.grade);
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{m.subjectName}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>{m.totalScore}%</span>
                <Badge label={m.grade} {...gs} />
              </div>
            </div>
          );
        })}
      </Card>
      <Card>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Announcements
          <button onClick={() => go('announcements')} style={{ fontSize: '12px', color: '#1e40af', background: 'none', border: 'none', cursor: 'pointer' }}>See all →</button>
        </div>
        {anns.slice(0, 3).map((a: any) => (
          <div key={a.id} style={{ padding: '8px 10px', marginBottom: '6px', background: '#f8fafc', borderRadius: '3px', borderLeft: a.isPinned ? '3px solid #1e40af' : '3px solid #e2e8f0' }}>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{a.title}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{a.publishedDate} · {a.category}</div>
          </div>
        ))}
      </Card>
    </div>
    {invoice && (
      <Card>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px' }}>Fee Statement — {invoice.term}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '8px' }}>
          {[['Total Due', `$${invoice.totalDue}`, ''], ['Paid', `$${invoice.amountPaid}`, '#166534'], ['Balance', `$${invoice.balance}`, invoice.balance > 0 ? '#991b1b' : '#166534'], ['Status', invoice.status, '']].map(([l, v, c]) => (
            <div key={String(l)} style={{ padding: '10px', background: '#f8fafc', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>{l}</div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: (c as string) || '#0f172a' }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
    )}
  </div>
);

// ── My Children ────────────────────────────────────────────────────────
const PChild: React.FC<any> = ({ child }) => (
  <div>
    <PT t="My Children" s="Registered children linked to your account" />
    {child && (
      <Card>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const, alignItems: 'flex-start' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '3px', background: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '22px', flexShrink: 0 }}>{child.firstName[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{child.firstName} {child.lastName}</div>
            <div style={{ display: 'flex', gap: '6px', margin: '6px 0', flexWrap: 'wrap' as const }}>
              <Badge label={child.className} color="#1e40af" bg="#eff6ff" border="#bfdbfe" />
              <Badge label={child.status}    color="#166534" bg="#f0fdf4" border="#bbf7d0" />
              <Badge label={child.gender}    color="#334155" bg="#f1f5f9" border="#e2e8f0" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '8px', marginTop: '10px', fontSize: '13px', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={12} color="#94a3b8" />{child.guardianPhone}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={12} color="#94a3b8" />{child.address}</div>
              <div>Admission #: <strong>{child.admissionNumber}</strong></div>
              <div>DOB: {child.dateOfBirth}</div>
              <div>Enrolled: {child.enrollmentDate}</div>
            </div>
          </div>
        </div>
      </Card>
    )}
  </div>
);

// ── Academic Performance ───────────────────────────────────────────────
const PPerf: React.FC<any> = ({ child, marks, avg }) => (
  <div>
    <PT t="Academic Performance" s={`${child?.firstName} ${child?.lastName} — Term 3 2026`} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px', marginBottom: '16px' }}>
      <SC label="Average" value={`${avg}%`} colour={avg >= 70 ? '#166534' : '#92400e'} />
      <SC label="Subjects" value={`${marks.length}`} />
      <SC label="Top Grade" value={marks.length > 0 ? [...marks].sort((a: any, b: any) => b.totalScore - a.totalScore)[0].grade : '—'} colour="#1e40af" />
      <SC label="Passed" value={`${marks.filter((m: any) => m.totalScore >= 50).length}/${marks.length}`} />
    </div>
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontWeight: 600, fontSize: '13px' }}>Subject Results</span>
        <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: '#1e40af', color: '#fff', border: '1px solid #1e3a8a', borderRadius: '3px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          <Download size={12} /> Download Report Card
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <TH cols={['Subject', 'CW /30', 'MT /30', 'Exam /40', 'Total', 'Grade', 'Remarks']} />
          <tbody>
            {marks.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No marks yet.</td></tr>
            ) : marks.map((m: any) => {
              const gs = gradeStyle(m.grade);
              return (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 500 }}>{m.subjectName}</td>
                  <td style={{ padding: '8px 12px' }}>{m.courseworkMark}</td>
                  <td style={{ padding: '8px 12px' }}>{m.midTermMark}</td>
                  <td style={{ padding: '8px 12px' }}>{m.finalExamMark}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>{m.totalScore}%</td>
                  <td style={{ padding: '8px 12px' }}><Badge label={m.grade} {...gs} /></td>
                  <td style={{ padding: '8px 12px', color: '#64748b', fontSize: '12px' }}>{m.remarks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

// ── Attendance ─────────────────────────────────────────────────────────
const PAtt: React.FC<any> = ({ child }) => {
  const all     = child ? dataService.getAttendance('', '').filter((a: any) => a.studentId === child.id) : [];
  const present = all.filter((r: any) => r.status === 'present').length;
  const late    = all.filter((r: any) => r.status === 'late').length;
  const absent  = all.filter((r: any) => r.status === 'absent').length;
  const rate    = all.length > 0 ? Math.round(((present + late) / all.length) * 100) : 100;
  return (
    <div>
      <PT t="Attendance Record" s={`${child?.firstName} ${child?.lastName}`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '16px' }}>
        <SC label="Days" value={`${all.length}`} />
        <SC label="Present" value={`${present}`} colour="#166534" />
        <SC label="Late" value={`${late}`} colour="#92400e" />
        <SC label="Absent" value={`${absent}`} colour="#991b1b" />
        <SC label="Rate" value={`${rate}%`} colour={rate >= 90 ? '#166534' : '#991b1b'} />
      </div>
      <Card>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Attendance Log</div>
        {all.length === 0 ? <p style={{ fontSize: '12px', color: '#94a3b8' }}>No records found.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <TH cols={['Date', 'Status', 'Remarks', 'Recorded By']} />
              <tbody>
                {all.slice(0, 30).map((r: any) => {
                  const sc = r.status === 'present' ? { bg: '#f0fdf4', c: '#166534' } : r.status === 'late' ? { bg: '#fffbeb', c: '#92400e' } : { bg: '#fef2f2', c: '#991b1b' };
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px' }}>{r.date}</td>
                      <td style={{ padding: '8px 12px' }}><span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.c, textTransform: 'capitalize' as const }}>{r.status}</span></td>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>{r.remarks || '—'}</td>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>{r.recordedBy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// ── Fees ───────────────────────────────────────────────────────────────
const PFees: React.FC<any> = ({ child, invoice }) => {
  const payments = child ? dataService.getPayments().filter((p: any) => p.studentId === child.id) : [];
  return (
    <div>
      <PT t="Fees & Payments" s="School fee statement and payment history" />
      {invoice ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px' }}>
            <SC label="Tuition" value={`$${invoice.tuitionFee}`} />
            <SC label="Levy" value={`$${invoice.levyFee}`} />
            <SC label="Total Due" value={`$${invoice.totalDue}`} />
            <SC label="Paid" value={`$${invoice.amountPaid}`} colour="#166534" />
            <SC label="Balance" value={`$${invoice.balance}`} colour={invoice.balance > 0 ? '#991b1b' : '#166534'} />
          </div>
          <Card>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Payment History</div>
            {payments.length === 0 ? <p style={{ fontSize: '12px', color: '#94a3b8' }}>No payments recorded.</p> : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <TH cols={['Receipt #', 'Date', 'Method', 'Amount']} />
                  <tbody>
                    {payments.map((p: any) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 500 }}>{p.receiptNumber}</td>
                        <td style={{ padding: '8px 12px', color: '#64748b' }}>{p.paymentDate}</td>
                        <td style={{ padding: '8px 12px' }}>{p.paymentMethod}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#166534' }}>+${p.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      ) : <p style={{ color: '#94a3b8', fontSize: '13px' }}>No invoice found.</p>}
    </div>
  );
};

// ── Homework ───────────────────────────────────────────────────────────
const HW_DATA = [
  { subject: 'Mathematics',        title: 'Exercise 4.3 — Quadratic Equations',  due: '2026-11-07', status: 'Pending' },
  { subject: 'English Language',   title: 'Essay: My Community',                 due: '2026-11-08', status: 'Pending' },
  { subject: 'Integrated Science', title: 'Lab Report — Photosynthesis',          due: '2026-11-05', status: 'Submitted' },
  { subject: 'History',            title: 'Research: The Second Chimurenga',      due: '2026-11-10', status: 'Pending' },
  { subject: 'Shona Language',     title: 'Essay: Tsika naMagariro',              due: '2026-11-09', status: 'Pending' },
];

const PHW: React.FC = () => (
  <div>
    <PT t="Homework & Assignments" s="Upcoming and recent assignments" />
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {HW_DATA.map((hw, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '3px', background: '#f8fafc' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{hw.subject}</span>
              <div style={{ fontWeight: 500, fontSize: '13px', marginTop: '2px' }}>{hw.title}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Due: {hw.due}</div>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: hw.status === 'Submitted' ? '#f0fdf4' : '#fffbeb', color: hw.status === 'Submitted' ? '#166534' : '#92400e', border: `1px solid ${hw.status === 'Submitted' ? '#bbf7d0' : '#fde68a'}`, whiteSpace: 'nowrap' as const }}>{hw.status}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ── Timetable ──────────────────────────────────────────────────────────
const TT_DATA = [
  { time: '07:30–08:15', Mon: 'Mathematics',  Tue: 'English',    Wed: 'Science',   Thu: 'History',   Fri: 'Shona' },
  { time: '08:15–09:00', Mon: 'English',      Tue: 'Mathematics',Wed: 'Accounts',  Thu: 'Geography', Fri: 'ICT' },
  { time: '09:15–10:00', Mon: 'Science',      Tue: 'Geography',  Wed: 'History',   Thu: 'Mathematics',Fri: 'English' },
  { time: '10:00–10:45', Mon: 'History',      Tue: 'Shona',      Wed: 'Mathematics',Thu: 'Science',  Fri: 'Accounts' },
  { time: '11:00–11:45', Mon: 'Geography',    Tue: 'ICT',        Wed: 'Shona',     Thu: 'English',   Fri: 'Science' },
  { time: '11:45–12:30', Mon: 'ICT',          Tue: 'Accounts',   Wed: 'English',   Thu: 'Shona',     Fri: 'Mathematics' },
];

const PTT: React.FC = () => (
  <div>
    <PT t="School Timetable" s="Form 1A — Weekly Schedule" />
    <Card>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1e40af' }}>
              {['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((h) => (
                <th key={h} style={{ padding: '9px 12px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 700, color: '#fff', textTransform: 'uppercase' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TT_DATA.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '9px 12px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' as const }}>{row.time}</td>
                {[row.Mon, row.Tue, row.Wed, row.Thu, row.Fri].map((sub, j) => (
                  <td key={j} style={{ padding: '9px 12px' }}>{sub}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

// ── Announcements ──────────────────────────────────────────────────────
const PAnn: React.FC<{ anns: any[] }> = ({ anns }) => (
  <div>
    <PT t="Announcements" s="School notices for parents" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {anns.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '13px' }}>No announcements.</p> : anns.map((a) => (
        <div key={a.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '14px 16px', borderLeft: a.isPinned ? '3px solid #1e40af' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' as const }}>
            <Badge label={a.category}       color="#1e40af" bg="#eff6ff" border="#bfdbfe" />
            <Badge label={a.targetAudience} color="#334155" bg="#f1f5f9" border="#e2e8f0" />
            {a.isPinned && <Badge label="Pinned" color="#92400e" bg="#fffbeb" border="#fde68a" />}
          </div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{a.title}</div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: 0 }}>{a.content}</p>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>Published {a.publishedDate} by {a.author}</div>
        </div>
      ))}
    </div>
  </div>
);

// ── Messages ───────────────────────────────────────────────────────────
const PMsg: React.FC = () => (
  <div>
    <PT t="Messages" s="Communicate with teachers and school administration" />
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { from: 'Mr. Tinashe Moyo', subject: 'Mathematics Progress Update', date: '2026-11-03', preview: 'Tatenda has shown excellent improvement in algebra this week...' },
          { from: 'Class Teacher',   subject: 'Parent-Teacher Meeting',       date: '2026-11-01', preview: 'Dear Parent, please attend the meeting on 10 November at 2pm...' },
        ].map((msg, i) => (
          <div key={i} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '3px', background: '#f8fafc', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>{msg.from}</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{msg.date}</span>
            </div>
            <div style={{ fontWeight: 500, fontSize: '13px', marginBottom: '3px' }}>{msg.subject}</div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{msg.preview}</p>
          </div>
        ))}
        <div style={{ marginTop: '8px', padding: '12px', border: '1px dashed #bfdbfe', borderRadius: '3px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
          Full messaging system coming soon. Contact school via WhatsApp: <strong>+263 78 164 8526</strong>
        </div>
      </div>
    </Card>
  </div>
);

// ── Settings ───────────────────────────────────────────────────────────
const PSet: React.FC<{ currentUser: User }> = ({ currentUser }) => (
  <div>
    <PT t="Settings" s="Manage your account preferences" />
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Account Information</div>
        {[['Full Name', currentUser.name], ['Email', currentUser.email], ['Role', currentUser.role], ['Portal', 'Parent Portal']].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '140px', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{l}</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{v}</div>
          </div>
        ))}
        <div style={{ marginTop: '8px', padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '3px', fontSize: '13px', color: '#92400e' }}>
          To update your contact details, please contact the school office on +263 78 164 8526.
        </div>
      </div>
    </Card>
  </div>
);
