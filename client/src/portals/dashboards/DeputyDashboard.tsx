import React from 'react';
import { User } from '../../types';
import { dataService } from '../../services/dataService';

interface Props { user: User; onNavigate: (p: string) => void; }

const SC: React.FC<{ label: string; value: string|number; colour?: string; sub?: string }> = ({ label, value, colour, sub }) => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '14px 16px' }}>
    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#64748b', marginBottom: '6px' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: 700, color: colour ?? '#0f172a', lineHeight: 1.2 }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{sub}</div>}
  </div>
);

const TH: React.FC<{ cols: string[] }> = ({ cols }) => (
  <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
    {cols.map((c) => <th key={c} style={{ padding: '8px 12px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>{c}</th>)}
  </tr></thead>
);

export const DeputyDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const m        = dataService.getDashboardMetrics();
  const classes  = dataService.getClasses();
  const teachers = dataService.getTeachers();
  const today    = new Date().toISOString().split('T')[0];
  const todayAtt = dataService.getAttendance(today);

  const classSummary = classes.map((cls) => {
    const students = dataService.getStudents().filter((s) => s.classId === cls.id);
    const present  = todayAtt.filter((a) => a.classId === cls.id && (a.status === 'present' || a.status === 'late')).length;
    const rate     = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
    return { ...cls, students: students.length, present, rate };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Deputy Head — Dashboard</h1>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>Academics & discipline overview · {user.name}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '12px' }}>
        <SC label="Classes"          value={classes.length}                    sub="Active classes" />
        <SC label="Teaching Staff"   value={teachers.length}                   sub="On duty" />
        <SC label="School Attendance" value={`${m.attendanceTodayPercent}%`}  colour={m.attendanceTodayPercent >= 90 ? '#166534' : '#991b1b'} sub="Today" />
        <SC label="On Leave"         value={teachers.filter(t => t.status === 'On Leave').length} colour="#92400e" sub="Teachers absent" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '12px' }}>
        {/* Attendance by class */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '16px' }}>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            Attendance by Class <button onClick={() => onNavigate('attendance')} style={{ fontSize: '12px', color: '#1e40af', background: 'none', border: 'none', cursor: 'pointer' }}>Register →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <TH cols={['Class', 'Students', 'Present', 'Rate']} />
              <tbody>
                {classSummary.map((cls) => (
                  <tr key={cls.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 500 }}>{cls.name}</td>
                    <td style={{ padding: '8px 12px' }}>{cls.students}</td>
                    <td style={{ padding: '8px 12px' }}>{cls.present}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ fontWeight: 700, color: cls.rate >= 90 ? '#166534' : cls.rate >= 70 ? '#92400e' : '#991b1b' }}>{cls.rate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teachers on leave */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '16px' }}>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            Teaching Staff Status <button onClick={() => onNavigate('teachers')} style={{ fontSize: '12px', color: '#1e40af', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <TH cols={['Name', 'Specialization', 'Status']} />
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 500 }}>{t.firstName} {t.lastName}</td>
                    <td style={{ padding: '8px 12px', color: '#64748b', fontSize: '12px' }}>{t.specialization}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, background: t.status === 'Active' ? '#f0fdf4' : '#fffbeb', color: t.status === 'Active' ? '#166534' : '#92400e', border: t.status === 'Active' ? '1px solid #bbf7d0' : '1px solid #fde68a' }}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
