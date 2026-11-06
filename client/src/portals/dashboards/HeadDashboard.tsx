import React from 'react';
import { User } from '../../types';
import { dataService } from '../../services/dataService';
import { ShieldCheck, Eye } from 'lucide-react';

interface Props { user: User; onNavigate: (p: string) => void; }

const BRAND = '#2F628F';

const KPI: React.FC<{ label: string; value: string|number; colour?: string; sub?: string; onClick?: () => void }> = ({ label, value, colour, sub, onClick }) => (
  <div onClick={onClick} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', cursor: onClick?'pointer':'default' }}
    onMouseEnter={e=>{if(onClick)(e.currentTarget as HTMLDivElement).style.boxShadow='0 4px 12px rgba(47,98,143,0.15)';}}
    onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow='none';}}>
    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#64748b', marginBottom: '8px' }}>{label}</div>
    <div style={{ fontSize: '24px', fontWeight: 800, color: colour ?? '#0f172a', lineHeight: 1.2 }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{sub}</div>}
  </div>
);

const TH: React.FC<{ cols: string[] }> = ({ cols }) => (
  <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
    {cols.map(c=><th key={c} style={{ padding:'9px 12px', textAlign:'left' as const, fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase' as const, whiteSpace:'nowrap' as const }}>{c}</th>)}
  </tr></thead>
);

const PENDING = [
  { type: 'Leave Request',       from: 'Mr. Blessing Sibanda',  date: '2026-11-03', status: 'Pending' },
  { type: 'Exam Timetable',      from: 'Academic Department',   date: '2026-11-04', status: 'Pending' },
  { type: 'Budget Requisition',  from: 'Bursar Office',          date: '2026-11-04', status: 'Pending' },
];

const EVENTS = [
  { name: 'Inter-School Football', date: '2026-11-08', type: 'Sport' },
  { name: 'Science Fair',          date: '2026-11-12', type: 'Academic' },
  { name: 'Speech & Prize Day',    date: '2026-11-20', type: 'Ceremony' },
];

export const HeadDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const isHead   = user.role === 'HEAD';
  const roleTitle = isHead ? 'Headmaster' : 'Deputy Headmaster';
  const m        = dataService.getDashboardMetrics();
  const students  = dataService.getStudents();
  const teachers  = dataService.getTeachers();
  const anns      = dataService.getAnnouncements().slice(0, 4);
  const marks     = dataService.getMarks();
  const invoices  = dataService.getInvoices();
  const today     = new Date().toISOString().split('T')[0];
  const todayAtt  = dataService.getAttendance(today);
  const present   = todayAtt.filter(a=>a.status==='present'||a.status==='late').length;
  const absent    = todayAtt.filter(a=>a.status==='absent').length;
  const totalDue  = invoices.reduce((s,i)=>s+i.totalDue,0);
  const totalPaid = invoices.reduce((s,i)=>s+i.amountPaid,0);

  const topMarks = [...marks].sort((a,b)=>b.totalScore-a.totalScore).slice(0,5);
  const classes  = dataService.getClasses();
  const classSummary = classes.map(cls=>{
    const n   = students.filter(s=>s.classId===cls.id).length;
    const att = todayAtt.filter(a=>a.classId===cls.id&&(a.status==='present'||a.status==='late')).length;
    const rate = n>0?Math.round((att/n)*100):0;
    return { ...cls, students: n, present: att, rate };
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Role banner */}
      <div style={{ padding:'14px 18px', background: BRAND, borderRadius:'6px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap' as const, gap:'10px' }}>
        <div>
          <div style={{ fontSize:'18px', fontWeight:800, color:'#fff' }}>{roleTitle} Dashboard</div>
          <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.75)', marginTop:'3px' }}>
            {isHead ? 'Full school leadership access — approve requests, view all reports.'
                    : 'Daily school operations — attendance, discipline and academic monitoring.'}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'5px 12px', background:'rgba(255,255,255,0.12)', borderRadius:'5px', border:'1px solid rgba(255,255,255,0.2)' }}>
          {isHead ? <ShieldCheck size={14} color="#86efac" /> : <Eye size={14} color="#93c5fd" />}
          <span style={{ fontSize:'12px', color:'#fff', fontWeight:600 }}>
            {isHead ? 'Full Access' : 'Monitor & Supervise'}
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'14px' }}>
        <KPI label="Total Students"    value={students.length}                   onClick={()=>onNavigate('students')} />
        <KPI label="Total Teachers"    value={teachers.length}                   onClick={()=>onNavigate('teachers')} />
        <KPI label="Total Classes"     value={classes.length}                    onClick={()=>onNavigate('classes')} />
        <KPI label="Present Today"     value={present||'—'}   colour="#166534"   sub="Students" />
        <KPI label="Absent Today"      value={absent||'—'}    colour="#991b1b"   sub="Students" />
        <KPI label="Fees Collected"    value={`$${totalPaid.toLocaleString()}`}  colour="#166534" sub={`${m.feeCollectionRate}%`} />
        <KPI label="Pending Approvals" value={PENDING.length} colour={isHead?'#92400e':'#64748b'} sub={isHead?'Action required':'View only'} onClick={()=>onNavigate('approvals')} />
      </div>

      {/* Attendance by class + top marks */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'16px' }}>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:'14px' }}>Attendance by Class</span>
            <button onClick={()=>onNavigate('attendance')} style={{ fontSize:'12px', color:BRAND, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Register →</button>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <TH cols={['Class','Students','Present','Rate']} />
              <tbody>
                {classSummary.map(cls=>(
                  <tr key={cls.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                    <td style={{ padding:'9px 12px', fontWeight:500 }}>{cls.name}</td>
                    <td style={{ padding:'9px 12px' }}>{cls.students}</td>
                    <td style={{ padding:'9px 12px' }}>{cls.present}</td>
                    <td style={{ padding:'9px 12px', fontWeight:700, color:cls.rate>=90?'#166534':cls.rate>=70?'#92400e':'#991b1b' }}>{cls.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:'14px' }}>Top Exam Results</span>
            <button onClick={()=>onNavigate('academic-performance')} style={{ fontSize:'12px', color:BRAND, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Full results →</button>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <TH cols={['Student','Subject','Total','Grade']} />
              <tbody>
                {topMarks.length===0
                  ? <tr><td colSpan={4} style={{ padding:'20px', textAlign:'center', color:'#94a3b8' }}>No marks yet.</td></tr>
                  : topMarks.map(mk=>(
                  <tr key={mk.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                    <td style={{ padding:'9px 12px', fontWeight:500 }}>{mk.studentName}</td>
                    <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{mk.subjectName}</td>
                    <td style={{ padding:'9px 12px', fontWeight:700 }}>{mk.totalScore}%</td>
                    <td style={{ padding:'9px 12px' }}>
                      <span style={{ padding:'2px 7px', borderRadius:'3px', fontSize:'11px', fontWeight:700, background:mk.grade==='A'?'#f0fdf4':'#eff6ff', color:mk.grade==='A'?'#166534':BRAND }}>{mk.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending approvals (HEAD) + Upcoming events + Announcements */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'16px' }}>

        {/* Approvals */}
        {isHead && (
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:700, fontSize:'14px' }}>Pending Approvals</span>
              <button onClick={()=>onNavigate('approvals')} style={{ fontSize:'12px', color:BRAND, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>All →</button>
            </div>
            <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:'8px' }}>
              {PENDING.map((a,i)=>(
                <div key={i} style={{ padding:'10px 12px', background:'#fffbeb', borderRadius:'5px', border:'1px solid #fde68a', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'13px' }}>{a.type}</div>
                    <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>{a.from} · {a.date}</div>
                  </div>
                  <div style={{ display:'flex', gap:'5px' }}>
                    <button style={{ padding:'3px 8px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'3px', fontSize:'11px', fontWeight:600, color:'#166534', cursor:'pointer' }}>Approve</button>
                    <button style={{ padding:'3px 8px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'3px', fontSize:'11px', fontWeight:600, color:'#991b1b', cursor:'pointer' }}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming events */}
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0' }}>
            <span style={{ fontWeight:700, fontSize:'14px' }}>Upcoming Events</span>
          </div>
          <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:'8px' }}>
            {EVENTS.map((e,i)=>(
              <div key={i} style={{ padding:'10px 12px', background:'#f8fafc', borderRadius:'5px', border:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:'13px' }}>{e.name}</div>
                  <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>{e.date}</div>
                </div>
                <span style={{ padding:'2px 8px', borderRadius:'3px', fontSize:'11px', fontWeight:600, background:'#eff6ff', color:BRAND, border:'1px solid #bfdbfe' }}>{e.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:700, fontSize:'14px' }}>Announcements</span>
            <button onClick={()=>onNavigate('announcements')} style={{ fontSize:'12px', color:BRAND, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>All →</button>
          </div>
          <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:'8px' }}>
            {anns.map(a=>(
              <div key={a.id} style={{ padding:'10px 12px', background:'#f8fafc', borderRadius:'5px', borderLeft:a.isPinned?`3px solid ${BRAND}`:'3px solid #e2e8f0' }}>
                <div style={{ fontWeight:600, fontSize:'13px' }}>{a.title}</div>
                <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>{a.publishedDate} · {a.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
