import React from 'react';
import { User } from '../../types';
import { dataService } from '../../services/dataService';

interface Props { user: User; }
const BRAND = '#2F628F';

const KPI: React.FC<{ label: string; value: string|number; colour?: string; sub?: string }> = ({ label, value, colour, sub }) => (
  <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', padding:'14px 16px' }}>
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

const WC: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>{children}</div>
);

const PH: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <div style={{ marginBottom:'4px' }}>
    <div style={{ fontWeight:700, fontSize:'14px' }}>{title}</div>
    {sub && <div style={{ fontSize:'12px', color:'#64748b', marginTop:'2px' }}>{sub}</div>}
  </div>
);

// ── Bursar Dashboard ───────────────────────────────────────────────────
const BursarDash: React.FC<{ user: User }> = ({ user }) => {
  const invoices = dataService.getInvoices();
  const payments = dataService.getPayments().slice(0, 6);
  const totalDue  = invoices.reduce((s,i)=>s+i.totalDue,0);
  const totalPaid = invoices.reduce((s,i)=>s+i.amountPaid,0);
  const outstanding = totalDue - totalPaid;
  const rate = totalDue>0?Math.round((totalPaid/totalDue)*100):0;
  const todayPaid = payments.filter(p=>p.paymentDate===new Date().toISOString().split('T')[0]).reduce((s,p)=>s+p.amount,0);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div style={{ padding:'14px 18px', background:BRAND, borderRadius:'6px', color:'#fff' }}>
        <div style={{ fontSize:'18px', fontWeight:800 }}>Bursar / Accounts Dashboard</div>
        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.75)', marginTop:'3px' }}>{user.name} · Term 3, 2026</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px' }}>
        <KPI label="Total Invoiced"   value={`$${totalDue.toLocaleString()}`} />
        <KPI label="Collected"        value={`$${totalPaid.toLocaleString()}`}      colour="#166534" />
        <KPI label="Outstanding"      value={`$${outstanding.toLocaleString()}`}    colour="#991b1b" />
        <KPI label="Collection Rate"  value={`${rate}%`}  colour={rate>=80?'#166534':'#92400e'} />
        <KPI label="Received Today"   value={`$${todayPaid}`} colour={BRAND} sub="Today's receipts" />
        <KPI label="Overdue"          value={invoices.filter(i=>i.status==='Overdue').length} colour="#991b1b" sub="Invoices" />
      </div>
      <WC>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:700, fontSize:'14px' }}>Recent Payments</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <TH cols={['Receipt','Student','Method','Amount','Date']} />
            <tbody>
              {payments.map(p=>(
                <tr key={p.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{p.receiptNumber}</td>
                  <td style={{ padding:'9px 12px', fontWeight:500 }}>{p.studentName}</td>
                  <td style={{ padding:'9px 12px', color:'#64748b' }}>{p.paymentMethod}</td>
                  <td style={{ padding:'9px 12px', fontWeight:700, color:'#166534' }}>${p.amount}</td>
                  <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{p.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WC>
      <WC>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:700, fontSize:'14px' }}>Outstanding Invoices</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <TH cols={['Student','Class','Total','Paid','Balance','Status']} />
            <tbody>
              {invoices.filter(i=>i.balance>0).map(i=>(
                <tr key={i.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'9px 12px', fontWeight:500 }}>{i.studentName}</td>
                  <td style={{ padding:'9px 12px' }}>{i.className}</td>
                  <td style={{ padding:'9px 12px' }}>${i.totalDue}</td>
                  <td style={{ padding:'9px 12px', color:'#166534', fontWeight:600 }}>${i.amountPaid}</td>
                  <td style={{ padding:'9px 12px', color:'#991b1b', fontWeight:700 }}>${i.balance}</td>
                  <td style={{ padding:'9px 12px' }}>
                    <span style={{ padding:'2px 7px', borderRadius:'3px', fontSize:'11px', fontWeight:600, background:i.status==='Overdue'?'#fef2f2':'#fffbeb', color:i.status==='Overdue'?'#991b1b':'#92400e', border:`1px solid ${i.status==='Overdue'?'#fecaca':'#fde68a'}` }}>{i.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WC>
    </div>
  );
};

// ── Secretary Dashboard ────────────────────────────────────────────────
const SecretaryDash: React.FC<{ user: User }> = ({ user }) => {
  const students = dataService.getStudents();
  const anns     = dataService.getAnnouncements().slice(0,4);
  const active   = students.filter(s=>s.status==='Active').length;
  const recent   = [...students].sort((a,b)=>b.enrollmentDate.localeCompare(a.enrollmentDate)).slice(0,5);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div style={{ padding:'14px 18px', background:BRAND, borderRadius:'6px', color:'#fff' }}>
        <div style={{ fontSize:'18px', fontWeight:800 }}>Secretary Dashboard</div>
        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.75)', marginTop:'3px' }}>{user.name} · Term 3, 2026</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px' }}>
        <KPI label="Total Students"    value={students.length} />
        <KPI label="Active Students"   value={active} colour="#166534" />
        <KPI label="New Admissions"    value={3}       colour={BRAND}  sub="This term" />
        <KPI label="Pending Documents" value={2}       colour="#92400e" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'16px' }}>
        <WC>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:700, fontSize:'14px' }}>Recent Admissions</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <TH cols={['Admission #','Student','Class','Date','Status']} />
              <tbody>
                {recent.map(s=>(
                  <tr key={s.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                    <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{s.admissionNumber}</td>
                    <td style={{ padding:'9px 12px', fontWeight:500 }}>{s.firstName} {s.lastName}</td>
                    <td style={{ padding:'9px 12px' }}>{s.className}</td>
                    <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{s.enrollmentDate}</td>
                    <td style={{ padding:'9px 12px' }}>
                      <span style={{ padding:'2px 7px', borderRadius:'3px', fontSize:'11px', fontWeight:600, background:s.status==='Active'?'#f0fdf4':'#fef2f2', color:s.status==='Active'?'#166534':'#991b1b' }}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WC>
        <WC>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:700, fontSize:'14px' }}>Recent Announcements</div>
          <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:'8px' }}>
            {anns.map(a=>(
              <div key={a.id} style={{ padding:'10px 12px', background:'#f8fafc', borderRadius:'5px', borderLeft:a.isPinned?`3px solid ${BRAND}`:'3px solid #e2e8f0' }}>
                <div style={{ fontWeight:600, fontSize:'13px' }}>{a.title}</div>
                <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>{a.publishedDate} · {a.category}</div>
              </div>
            ))}
          </div>
        </WC>
      </div>
    </div>
  );
};

// ── Librarian Dashboard ────────────────────────────────────────────────
const LibrarianDash: React.FC<{ user: User }> = ({ user }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
    <div style={{ padding:'14px 18px', background:BRAND, borderRadius:'6px', color:'#fff' }}>
      <div style={{ fontSize:'18px', fontWeight:800 }}>Librarian Dashboard</div>
      <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.75)', marginTop:'3px' }}>{user.name} · Term 3, 2026</div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px' }}>
      <KPI label="Total Books"     value={842} />
      <KPI label="Available"       value={718} colour="#166534" />
      <KPI label="On Loan"         value={124} colour={BRAND} />
      <KPI label="Overdue"         value={18}  colour="#991b1b" />
      <KPI label="Borrowers"       value={dataService.getStudents().length} sub="Registered" />
      <KPI label="Transactions Today" value={7} colour={BRAND} />
    </div>
    <WC>
      <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:700, fontSize:'14px' }}>Active Borrowings</div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
          <TH cols={['Student','Book','Issue Date','Due Date','Status']} />
          <tbody>
            {[['Tatenda Mutasa','Mathematics O-Level','2026-10-20','2026-11-03','Overdue'],
              ['Anesu Gumbo','English Anthology','2026-10-25','2026-11-08','On Loan'],
              ['Kudzai Mupfumi','History of Zim Vol.1','2026-11-01','2026-11-15','On Loan'],
              ['Rufaro Mhlanga','ZIMSEC Study Pack','2026-10-28','2026-11-11','On Loan'],
              ['Nyasha Chikwanha','Science Lab Manual','2026-10-15','2026-10-29','Returned'],
            ].map(([s,b,i,d,st],idx)=>(
              <tr key={idx} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{ padding:'9px 12px', fontWeight:500 }}>{s}</td>
                <td style={{ padding:'9px 12px', color:'#64748b' }}>{b}</td>
                <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{i}</td>
                <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{d}</td>
                <td style={{ padding:'9px 12px' }}>
                  <span style={{ padding:'2px 7px', borderRadius:'3px', fontSize:'11px', fontWeight:600, background:st==='Overdue'?'#fef2f2':st==='Returned'?'#f0fdf4':'#eff6ff', color:st==='Overdue'?'#991b1b':st==='Returned'?'#166534':BRAND }}>{st}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WC>
  </div>
);

// ── Hostel Manager Dashboard ───────────────────────────────────────────
const HostelDash: React.FC<{ user: User }> = ({ user }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
    <div style={{ padding:'14px 18px', background:BRAND, borderRadius:'6px', color:'#fff' }}>
      <div style={{ fontSize:'18px', fontWeight:800 }}>Hostel Manager Dashboard</div>
      <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.75)', marginTop:'3px' }}>{user.name} · Term 3, 2026</div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px' }}>
      <KPI label="Total Hostels"     value={3} />
      <KPI label="Total Rooms"       value={48} />
      <KPI label="Occupied"          value={42} colour={BRAND} />
      <KPI label="Available"         value={6}  colour="#166534" />
      <KPI label="Boarders"          value={87} sub="Students" />
      <KPI label="Absent Tonight"    value={5}  colour="#991b1b" />
      <KPI label="Pending Complaints"value={3}  colour="#92400e" />
    </div>
    <WC>
      <div style={{ padding:'14px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:700, fontSize:'14px' }}>Current Boarders — Roll Call</div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
          <TH cols={['Student','Room','Block','Status','Notes']} />
          <tbody>
            {[['Tatenda Mutasa','12A','Block A','Present','—'],
              ['Anesu Gumbo','14B','Block B','Present','—'],
              ['Kudzai Mupfumi','08C','Block A','Absent','Sick bay'],
              ['Simbarashe Machinga','22D','Block C','On Exeat','Signed out 3 Nov'],
              ['Ruvimbo Nyamande','05A','Block A','Present','—'],
            ].map(([s,r,b,st,n],i)=>(
              <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{ padding:'9px 12px', fontWeight:500 }}>{s}</td>
                <td style={{ padding:'9px 12px' }}>{r}</td>
                <td style={{ padding:'9px 12px' }}>{b}</td>
                <td style={{ padding:'9px 12px' }}>
                  <span style={{ padding:'2px 7px', borderRadius:'3px', fontSize:'11px', fontWeight:600, background:st==='Present'?'#f0fdf4':st==='Absent'?'#fef2f2':'#fffbeb', color:st==='Present'?'#166534':st==='Absent'?'#991b1b':'#92400e' }}>{st}</span>
                </td>
                <td style={{ padding:'9px 12px', color:'#64748b', fontSize:'12px' }}>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WC>
  </div>
);

// ── Main export ────────────────────────────────────────────────────────
const SUB_LABELS: Record<string,string> = { BURSAR:'Bursar / Accounts', SECRETARY:'Secretary', LIBRARIAN:'Librarian', HOSTEL:'Hostel Manager', GENERAL:'Staff' };

export const StaffDashboard: React.FC<Props> = ({ user }) => {
  const sub = user.subRole ?? 'GENERAL';
  if (sub === 'BURSAR')    return <BursarDash    user={user} />;
  if (sub === 'LIBRARIAN') return <LibrarianDash user={user} />;
  if (sub === 'HOSTEL')    return <HostelDash    user={user} />;
  return <SecretaryDash user={user} />; // SECRETARY and GENERAL
};
