import React, { useState } from 'react';
import {
  LayoutDashboard, User, BookOpen, Clock, FileText,
  FileSpreadsheet, CalendarCheck, Library, FolderOpen,
  Megaphone, MessageSquare, Settings, School, LogOut, Bell,
} from 'lucide-react';
import { User as UserType } from '../types';
import { dataService } from '../services/dataService';
import { Badge, Card, PT, SC, TH, gradeStyle } from './ParentPortal';

type StudentPage =
  | 'dashboard' | 'profile' | 'subjects' | 'timetable' | 'assignments'
  | 'results' | 'attendance' | 'library' | 'materials' | 'announcements' | 'messages' | 'settings';

interface Props { currentUser: UserType; onLogout: () => void; }

const NAV: { id: StudentPage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',     label: 'Dashboard',          icon: <LayoutDashboard size={15} /> },
  { id: 'profile',       label: 'My Profile',         icon: <User size={15} /> },
  { id: 'subjects',      label: 'My Subjects',        icon: <BookOpen size={15} /> },
  { id: 'timetable',     label: 'Timetable',          icon: <Clock size={15} /> },
  { id: 'assignments',   label: 'Assignments',        icon: <FileText size={15} /> },
  { id: 'results',       label: 'Exam Results',       icon: <FileSpreadsheet size={15} /> },
  { id: 'attendance',    label: 'Attendance',         icon: <CalendarCheck size={15} /> },
  { id: 'library',       label: 'E-Library',          icon: <Library size={15} /> },
  { id: 'materials',     label: 'Learning Materials', icon: <FolderOpen size={15} /> },
  { id: 'announcements', label: 'Announcements',      icon: <Megaphone size={15} /> },
  { id: 'messages',      label: 'Messages',           icon: <MessageSquare size={15} /> },
  { id: 'settings',      label: 'Settings',           icon: <Settings size={15} /> },
];

export const StudentPortal: React.FC<Props> = ({ currentUser, onLogout }) => {
  const [page, setPage] = useState<StudentPage>('dashboard');
  const studentId = currentUser.referenceId || 'std-1';
  const student   = dataService.getStudentById(studentId) || dataService.getStudents()[0];
  const marks     = student ? dataService.getMarksByStudent(student.id) : [];
  const invoice   = student ? (dataService.getInvoices().find((i) => i.studentId === student.id) || null) : null;
  const anns      = dataService.getAnnouncements().filter((a) => a.targetAudience === 'All' || a.targetAudience === 'Students');
  const avg       = marks.length > 0 ? Math.round(marks.reduce((s, m) => s + m.totalScore, 0) / marks.length) : 0;
  const subjects  = dataService.getSubjects();

  const render = () => {
    switch (page) {
      case 'dashboard':     return <SDash  student={student} marks={marks} avg={avg} anns={anns} invoice={invoice} go={setPage} />;
      case 'profile':       return <SProf  student={student} invoice={invoice} />;
      case 'subjects':      return <SSubs  subjects={subjects} marks={marks} />;
      case 'timetable':     return <STT />;
      case 'assignments':   return <SHW />;
      case 'results':       return <SRes   marks={marks} avg={avg} />;
      case 'attendance':    return <SAtt   student={student} />;
      case 'library':       return <SLib />;
      case 'materials':     return <SMat />;
      case 'announcements': return <SAnn   anns={anns} />;
      case 'messages':      return <SMsg />;
      case 'settings':      return <SSet   currentUser={currentUser} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', background: '#f1f5f9' }}>
      <header style={{ height: '46px', background: '#166534', borderBottom: '1px solid #15803d', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', position: 'sticky', top: 0, zIndex: 200, flexShrink: 0 }}>
        <School size={16} color="#fff" />
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Pedo <span style={{ color: '#86efac' }}>Zim</span></span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', flex: 1 }}>— Student Portal</span>
        <Bell size={14} color="rgba(255,255,255,0.7)" />
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginLeft: '8px' }}>{currentUser.name}</span>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '3px', color: '#fff', fontSize: '12px', padding: '3px 8px', cursor: 'pointer' }}>
          <LogOut size={12} /> Sign Out
        </button>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: '220px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'sticky', top: '46px', height: 'calc(100vh - 46px)', overflowY: 'auto', flexShrink: 0 }}>
          {student && (
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', background: '#f0fdf4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '3px', background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{student.firstName[0]}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12px' }}>{student.firstName} {student.lastName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{student.className}</div>
                </div>
              </div>
            </div>
          )}
          <nav style={{ padding: '8px', flex: 1 }}>
            {NAV.map((item) => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '32px', padding: '0 8px', background: page === item.id ? '#f0fdf4' : 'transparent', border: 'none', borderRadius: '3px', color: page === item.id ? '#166534' : '#334155', fontSize: '13px', fontWeight: page === item.id ? 600 : 500, textAlign: 'left', cursor: 'pointer', marginBottom: '1px' }}>
                <span style={{ color: page === item.id ? '#166534' : '#94a3b8', display: 'flex' }}>{item.icon}</span>
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

const SDash: React.FC<any> = ({ student, marks, avg, anns, invoice, go }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ background: '#166534', borderRadius: '3px', padding: '16px 20px', color: '#fff' }}>
      <div style={{ fontSize: '18px', fontWeight: 700 }}>Welcome back, {student?.firstName}!</div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '3px' }}>{student?.className} · {student?.admissionNumber} · Term 3, 2026</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '12px' }}>
      <SC label="My Class" value={student?.className || '—'} />
      <SC label="Average" value={avg ? `${avg}%` : '—'} colour={avg >= 70 ? '#166534' : avg >= 50 ? '#92400e' : '#991b1b'} sub="Term 3 2026" />
      <SC label="Subjects" value={`${marks.length}`} sub="with marks" />
      <SC label="Fee Balance" value={invoice ? `$${invoice.balance}` : '$0'} colour={invoice?.balance === 0 ? '#166534' : '#991b1b'} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '12px' }}>
      <Card>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          My Results <button onClick={() => go('results')} style={{ fontSize: '12px', color: '#166534', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
        </div>
        {marks.length === 0 ? <p style={{ fontSize: '12px', color: '#94a3b8' }}>No results yet.</p> : marks.slice(0, 4).map((m: any) => {
          const gs = gradeStyle(m.grade);
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{m.subjectName}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>{m.totalScore}%</span><Badge label={m.grade} {...gs} />
              </div>
            </div>
          );
        })}
      </Card>
      <Card>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          Notices <button onClick={() => go('announcements')} style={{ fontSize: '12px', color: '#166534', background: 'none', border: 'none', cursor: 'pointer' }}>All →</button>
        </div>
        {anns.slice(0, 3).map((a: any) => (
          <div key={a.id} style={{ padding: '8px 10px', marginBottom: '6px', background: '#f8fafc', borderRadius: '3px', borderLeft: a.isPinned ? '3px solid #166534' : '3px solid #e2e8f0' }}>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{a.title}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{a.publishedDate}</div>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

const SProf: React.FC<any> = ({ student, invoice }) => (
  <div>
    <PT t="My Profile" s="Your personal and academic details" />
    {student && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Card>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '3px', background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '22px', flexShrink: 0 }}>{student.firstName[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{student.firstName} {student.lastName}</div>
              <div style={{ display: 'flex', gap: '6px', margin: '6px 0', flexWrap: 'wrap' as const }}>
                <Badge label={student.className}       color="#166534" bg="#f0fdf4"  border="#bbf7d0" />
                <Badge label={student.admissionNumber} color="#1e40af" bg="#eff6ff"  border="#bfdbfe" />
                <Badge label={student.status}          color="#334155" bg="#f1f5f9"  border="#e2e8f0" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '8px', marginTop: '10px', fontSize: '13px' }}>
                <div>DOB: <strong>{student.dateOfBirth}</strong></div>
                <div>Gender: <strong>{student.gender}</strong></div>
                <div>Guardian: <strong>{student.guardianName}</strong></div>
                <div>Phone: <strong>{student.guardianPhone}</strong></div>
                <div>Enrolled: <strong>{student.enrollmentDate}</strong></div>
              </div>
            </div>
          </div>
        </Card>
        {invoice && (
          <Card>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px' }}>Fee Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '8px' }}>
              {[['Total', `$${invoice.totalDue}`, ''], ['Paid', `$${invoice.amountPaid}`, '#166534'], ['Balance', `$${invoice.balance}`, invoice.balance > 0 ? '#991b1b' : '#166534']].map(([l, v, c]) => (
                <div key={String(l)} style={{ padding: '10px', background: '#f8fafc', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>{l}</div>
                  <div style={{ fontWeight: 700, color: (c as string) || '#0f172a' }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    )}
  </div>
);

const SSubs: React.FC<any> = ({ subjects, marks }) => (
  <div>
    <PT t="My Subjects" s="Subjects enrolled for Term 3 2026" />
    <Card>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <TH cols={['Code', 'Subject', 'Category', 'Teacher', 'My Score', 'Grade']} />
          <tbody>
            {subjects.map((s: any) => {
              const m  = marks.find((mk: any) => mk.subjectId === s.id);
              const gs = m ? gradeStyle(m.grade) : null;
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{s.code}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '8px 12px' }}><Badge label={s.category} color="#1e40af" bg="#eff6ff" border="#bfdbfe" /></td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{s.teacherName || '—'}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>{m ? `${m.totalScore}%` : '—'}</td>
                  <td style={{ padding: '8px 12px' }}>{m && gs ? <Badge label={m.grade} {...gs} /> : <span style={{ color: '#94a3b8', fontSize: '12px' }}>No mark</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const SRes: React.FC<any> = ({ marks, avg }) => (
  <div>
    <PT t="Exam Results" s="Term 3 2026" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px', marginBottom: '16px' }}>
      <SC label="Average" value={`${avg}%`} colour={avg >= 70 ? '#166534' : '#92400e'} />
      <SC label="Subjects" value={`${marks.length}`} />
      <SC label="Passed" value={`${marks.filter((m: any) => m.totalScore >= 50).length}/${marks.length}`} colour="#166534" />
    </div>
    <Card>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <TH cols={['Subject', 'CW /30', 'MT /30', 'Exam /40', 'Total', 'Grade', 'Remarks']} />
          <tbody>
            {marks.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No results yet.</td></tr>
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

const SAtt: React.FC<any> = ({ student }) => {
  const all     = student ? dataService.getAttendance('', '').filter((a: any) => a.studentId === student.id) : [];
  const present = all.filter((r: any) => r.status === 'present').length;
  const late    = all.filter((r: any) => r.status === 'late').length;
  const absent  = all.filter((r: any) => r.status === 'absent').length;
  const rate    = all.length > 0 ? Math.round(((present + late) / all.length) * 100) : 100;
  return (
    <div>
      <PT t="Attendance" s="Your attendance record" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '16px' }}>
        <SC label="Days" value={`${all.length}`} />
        <SC label="Present" value={`${present}`} colour="#166534" />
        <SC label="Late" value={`${late}`} colour="#92400e" />
        <SC label="Absent" value={`${absent}`} colour="#991b1b" />
        <SC label="Rate" value={`${rate}%`} colour={rate >= 90 ? '#166534' : '#991b1b'} />
      </div>
      <Card>
        {all.length === 0 ? <p style={{ fontSize: '12px', color: '#94a3b8' }}>No records found.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <TH cols={['Date', 'Status', 'Remarks']} />
              <tbody>
                {all.map((r: any) => {
                  const sc = r.status === 'present' ? { bg: '#f0fdf4', c: '#166534' } : r.status === 'late' ? { bg: '#fffbeb', c: '#92400e' } : { bg: '#fef2f2', c: '#991b1b' };
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px' }}>{r.date}</td>
                      <td style={{ padding: '8px 12px' }}><span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.c, textTransform: 'capitalize' as const }}>{r.status}</span></td>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>{r.remarks || '—'}</td>
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

const STT: React.FC = () => {
  const rows = [
    { time: '07:30–08:15', d: ['Mathematics', 'English', 'Science', 'History', 'Shona'] },
    { time: '08:15–09:00', d: ['English', 'Mathematics', 'Accounts', 'Geography', 'ICT'] },
    { time: '09:15–10:00', d: ['Science', 'Geography', 'History', 'Mathematics', 'English'] },
    { time: '10:00–10:45', d: ['History', 'Shona', 'Mathematics', 'Science', 'Accounts'] },
    { time: '11:00–11:45', d: ['Geography', 'ICT', 'Shona', 'English', 'Science'] },
    { time: '11:45–12:30', d: ['ICT', 'Accounts', 'English', 'Shona', 'Mathematics'] },
  ];
  return (
    <div>
      <PT t="My Timetable" s="Weekly class schedule — Form 1A" />
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#166534' }}>
                {['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((h) => (
                  <th key={h} style={{ padding: '9px 12px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 700, color: '#fff', textTransform: 'uppercase' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '9px 12px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' as const }}>{r.time}</td>
                  {r.d.map((s, j) => <td key={j} style={{ padding: '9px 12px' }}>{s}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const HW_DATA = [
  { subject: 'Mathematics', title: 'Exercise 4.3 — Quadratic Equations', due: '2026-11-07', status: 'Pending' },
  { subject: 'English',     title: 'Essay: My Community',                due: '2026-11-08', status: 'Pending' },
  { subject: 'Science',     title: 'Lab Report — Photosynthesis',         due: '2026-11-05', status: 'Submitted' },
  { subject: 'History',     title: 'Research: The Second Chimurenga',     due: '2026-11-10', status: 'Pending' },
];

const SHW: React.FC = () => (
  <div>
    <PT t="Assignments" s="Upcoming and submitted assignments" />
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {HW_DATA.map((hw, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '3px', background: '#f8fafc' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{hw.subject}</span>
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

const SLib: React.FC = () => (
  <div>
    <PT t="E-Library" s="Digital resources and textbooks" />
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '10px' }}>
        {['Mathematics O-Level Textbook', 'English Literature Anthology', 'ZIMSEC Study Pack 2026', 'History of Zimbabwe Vol. 1', 'Science Lab Manual', 'Geography Atlas'].map((book, i) => (
          <div key={i} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '3px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{book}</span>
            <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600, cursor: 'pointer' }}>View →</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', padding: '10px', background: '#f0fdf4', borderRadius: '3px', border: '1px solid #bbf7d0' }}>
        Full E-Library with searchable content coming soon. Contact your teacher for digital resources.
      </div>
    </Card>
  </div>
);

const SMat: React.FC = () => (
  <div>
    <PT t="Learning Materials" s="Subject notes and study materials" />
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[{ subject: 'Mathematics', title: 'Algebra Notes — Chapter 4', type: 'PDF' }, { subject: 'English', title: 'Essay Writing Guide', type: 'DOC' }, { subject: 'Science', title: 'Photosynthesis Summary', type: 'PDF' }].map((mat, i) => (
          <div key={i} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '3px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>{mat.subject}</span>
              <div style={{ fontWeight: 500, fontSize: '13px', marginTop: '2px' }}>{mat.title}</div>
            </div>
            <span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>{mat.type}</span>
          </div>
        ))}
        <div style={{ fontSize: '12px', color: '#64748b', padding: '10px', background: '#fffbeb', borderRadius: '3px', border: '1px solid #fde68a', marginTop: '4px' }}>
          More materials are uploaded by your teachers each week.
        </div>
      </div>
    </Card>
  </div>
);

const SAnn: React.FC<{ anns: any[] }> = ({ anns }) => (
  <div>
    <PT t="Announcements" s="School notices for students" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {anns.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '13px' }}>No announcements.</p> : anns.map((a) => (
        <div key={a.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '14px 16px', borderLeft: a.isPinned ? '3px solid #166534' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' as const }}>
            <Badge label={a.category} color="#166534" bg="#f0fdf4" border="#bbf7d0" />
          </div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{a.title}</div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: 0 }}>{a.content}</p>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>Published {a.publishedDate}</div>
        </div>
      ))}
    </div>
  </div>
);

const SMsg: React.FC = () => (
  <div>
    <PT t="Messages" s="Communicate with your teachers" />
    <Card>
      <div style={{ padding: '12px', border: '1px dashed #bbf7d0', borderRadius: '3px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        Messaging system coming soon. Contact your teacher or school office on <strong>+263 78 164 8526</strong>
      </div>
    </Card>
  </div>
);

const SSet: React.FC<{ currentUser: UserType }> = ({ currentUser }) => (
  <div>
    <PT t="Settings" s="Account preferences" />
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[['Full Name', currentUser.name], ['Email', currentUser.email], ['Role', currentUser.role], ['Portal', 'Student Portal']].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '140px', fontSize: '13px', color: '#64748b' }}>{l}</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{v}</div>
          </div>
        ))}
        <div style={{ marginTop: '8px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '3px', fontSize: '13px', color: '#166534' }}>
          To update your details, contact the school administration.
        </div>
      </div>
    </Card>
  </div>
);
