import React from 'react';
import { User } from '../../types';
import { dataService } from '../../services/dataService';

interface Props { user: User; onNavigate: (p: string) => void; }
const BRAND = '#2F628F';

const KPI: React.FC<{ label: string; value: string|number; colour?: string; sub?: string; onClick?: ()=>void }> = ({ label, value, colour, sub, onClick }) => (
  <div onClick={onClick} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', padding:'14px 16px', cursor:onClick?'pointer':'default' }}>
    <div style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.05em', color:'#64748b', marginBottom:'6px' }}>{label}</div>
    <div style={{ fontSize:'22px', fontWeight:800, color:colour??'#0f172a', lineHeight:1.2 }}>{value}</div>
    {sub && <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'4px' }}>{sub}</div>}
  </div>
);

const TH: React.FC<{ cols: string[] }> = ({ cols }) => (
  <thead><tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
    {cols.map(c=><th key={c} style={{ padding:'9px 12px', textAlign:'left' as const, fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase' as const, whiteSpace:'nowrap' as const }}>{c}</th>)}
  </tr></thead>
);

const TODAY_LESSONS = [
  '07:30 — Mathematics · Form 1A',
  '09:15 — Mathematics · Form 3 Science',
  '11:00 — Computer Science · Form 1A',
  '14:00 — Staff Meeting',
];

export const TeacherDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const teacherId  = user.referenceId || 'tch-1';
  const teacher    = dataService.getTeachers().find(t=>t.id===teacherId) || dataService.getTeachers()[0];
  const classes    = dataService.getClasses().filter(c=>teacher?.assignedClasses.includes(c.name));
  const subjects   = dataService.getSubjects().filter(s=>s.teacherId===teacher?.id);
  const myClassIds = classes.map(c=>c.id);
  const myStudents = dataService.getStudents().filter(s=>myClassIds.includes(s.classId));
  const today      = new Date().toISOString().split('T')[0];
  const todayAtt   = dataService.getAttendance(today).filter(a=>myClassIds.includes(a.classId));
  const notMarked  = myStudents.filter(s=>!todayAtt.find(a=>a.studentId===s.id));
  const myMarks    = dataService.getMarks(myClassIds[0] || undefined);
  const anns       = dataService.getAnnouncements().filter(a=>a.targetAudience==='All'||a.targetAudience==='Teachers').slice(0,3);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Welcome banner */}
      <div style={{ padding:'14px 18px', background:BRAND, borderRadius:'6px', color:'#fff' }}>
        <div style={{ fontSize:'18px', fontWeight:800 }}>Good morning, {teacher?.firstName} {teacher?.lastName}</div>
        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.75)', marginTop:'3px' }}>{teacher?.specialization} · Term 3, 2026</div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px' }}>
        <KPI label="My Classes"      value={classes.length}      onClick={()=>onNavigate('my-classes')} />
        <KPI label="My Subjects"     value={subjects.length}     onClick={()=>onNavigate('my-subjects')} />
        <KPI label="My Students"     value={myStudents.length}   onClick={()=>onNavigate('students')} />
        <KPI label="Scheduled Today" value={2}                   sub="Lessons" />
        <KPI label="Attendance Pending" value={notMarked.length} colour={notMarked.length>0?'#92400e':'#166534'} sub="Students not marked" onClick={()=>onNavigate('attendance')} />
        <KPI label="Marks Entered"   value={myMarks.length}      colour={BRAND} sub="This term" onClick={()=>onNavigate('marks')} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'16px' }}>

        {/* Today's lessons */}
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:700, fontSize:'14px' }}>Today's Schedule</div>
          <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:'6px' }}>
            {TODAY_LESSONS.map((l,i)=>(
              <div key={i} style={{ padding:'9px 12px', background:'#f8fafc', borderRadius:'5px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:BRAND, flexShrink:0 }} />
                <span style={{ fontSize:'13px', fontWeight:500 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance pending */}
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:'14px' }}>Attendance Pending</span>
            <button onClick={()=>onNavigate('attendance')} style={{ fontSize:'12px', color:BRAND, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Mark now →</button>
          </div>
          {notMarked.length===0
            ? <div style={{ padding:'20px', textAlign:'center', fontSize:'13px', color:'#166534', fontWeight:600 }}>All students marked today. ✓</div>
            : <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                  <TH cols={['Student','Class']} />
                  <tbody>
                    {notMarked.slice(0,6).map(s=>(
                      <tr key={s.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                        <td style={{ padding:'9px 12px', fontWeight:500 }}>{s.firstName} {s.lastName}</td>
                        <td style={{ padding:'9px 12px', color:'#64748b' }}>{s.className}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>

        {/* My classes */}
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:'14px' }}>My Classes</span>
            <button onClick={()=>onNavigate('my-classes')} style={{ fontSize:'12px', color:BRAND, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>All →</button>
          </div>
          <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap:'8px' }}>
            {classes.map(c=>{
              const n = dataService.getStudents().filter(s=>s.classId===c.id).length;
              return (
                <div key={c.id} style={{ padding:'10px 12px', background:'#f8fafc', borderRadius:'5px', border:'1px solid #e2e8f0' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                    <span style={{ fontWeight:600, fontSize:'13px' }}>{c.name}</span>
                    <span style={{ fontSize:'12px', color:'#64748b' }}>{n} students</span>
                  </div>
                  <div style={{ height:'4px', background:'#e2e8f0', borderRadius:'2px' }}>
                    <div style={{ height:'100%', width:`${Math.min(100,Math.round(n/c.capacity*100))}%`, background:BRAND, borderRadius:'2px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marks entered */}
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:'14px' }}>Recent Marks</span>
            <button onClick={()=>onNavigate('marks')} style={{ fontSize:'12px', color:BRAND, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Enter marks →</button>
          </div>
          {myMarks.length===0
            ? <div style={{ padding:'20px', textAlign:'center', fontSize:'13px', color:'#94a3b8' }}>No marks entered yet.</div>
            : <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                  <TH cols={['Student','Subject','Total','Grade']} />
                  <tbody>
                    {myMarks.slice(0,5).map(mk=>(
                      <tr key={mk.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                        <td style={{ padding:'9px 12px', fontWeight:500 }}>{mk.studentName}</td>
                        <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{mk.subjectName}</td>
                        <td style={{ padding:'9px 12px', fontWeight:700 }}>{mk.totalScore}%</td>
                        <td style={{ padding:'9px 12px' }}>
                          <span style={{ padding:'2px 6px', borderRadius:'3px', fontSize:'11px', fontWeight:700, background:mk.grade==='A'?'#f0fdf4':'#eff6ff', color:mk.grade==='A'?'#166534':BRAND }}>{mk.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>

        {/* Announcements */}
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:700, fontSize:'14px' }}>Notices</div>
          <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:'8px' }}>
            {anns.map(a=>(
              <div key={a.id} style={{ padding:'10px 12px', background:'#f8fafc', borderRadius:'5px', borderLeft:a.isPinned?`3px solid ${BRAND}`:'3px solid #e2e8f0' }}>
                <div style={{ fontWeight:600, fontSize:'13px' }}>{a.title}</div>
                <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>{a.publishedDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
