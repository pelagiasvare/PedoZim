import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Award,
  DollarSign,
  Users,
  CheckCircle,
} from 'lucide-react';
import { dataService } from '../services/dataService';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'attendance' | 'fees' | 'academics'>('fees');

  const classes = dataService.getClasses();
  const students = dataService.getStudents();
  const invoices = dataService.getInvoices();

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'fees') {
      csvContent += 'AdmissionNumber,StudentName,Class,Term,TotalDue,AmountPaid,Balance,Status\n';
      invoices.forEach((i) => {
        csvContent += `${i.admissionNumber},"${i.studentName}",${i.className},"${i.term}",${i.totalDue},${i.amountPaid},${i.balance},${i.status}\n`;
      });
    } else {
      csvContent += 'AdmissionNumber,FirstName,LastName,Class,GuardianName,GuardianPhone,Status\n';
      students.forEach((s) => {
        csvContent += `${s.admissionNumber},"${s.firstName}","${s.lastName}",${s.className},"${s.guardianName}",${s.guardianPhone},${s.status}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduTrack_${reportType}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Reports & Auditing</h1>
          <p className="page-subtitle">
            Generate administrative summaries, fee collection audits, and academic performance distributions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export to CSV
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${reportType === 'fees' ? 'active' : ''}`}
          onClick={() => setReportType('fees')}
        >
          <DollarSign size={18} /> Fee Collection Audit
        </button>
        <button
          className={`tab-btn ${reportType === 'attendance' ? 'active' : ''}`}
          onClick={() => setReportType('attendance')}
        >
          <Calendar size={18} /> Class Attendance Summary
        </button>
        <button
          className={`tab-btn ${reportType === 'academics' ? 'active' : ''}`}
          onClick={() => setReportType('academics')}
        >
          <Award size={18} /> Academic Performance Standings
        </button>
      </div>

      {/* Fee Collection Audit Report */}
      {reportType === 'fees' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Term 3 2026 Fee Collection Statement</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Comprehensive breakdown of invoiced tuition, levies, collected funds, and unpaid arrears.
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Class / Stream</th>
                  <th>Students Enrolled</th>
                  <th>Total Billed</th>
                  <th>Collected</th>
                  <th>Outstanding</th>
                  <th>Clearance %</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => {
                  const classInvoices = invoices.filter((i) => i.className === cls.name);
                  const billed = classInvoices.reduce((a, b) => a + b.totalDue, 0);
                  const paid = classInvoices.reduce((a, b) => a + b.amountPaid, 0);
                  const bal = billed - paid;
                  const pct = billed > 0 ? Math.round((paid / billed) * 100) : 0;

                  return (
                    <tr key={cls.id}>
                      <td style={{ fontWeight: 700 }}>{cls.name}</td>
                      <td>{classInvoices.length}</td>
                      <td>${billed.toLocaleString()} USD</td>
                      <td style={{ color: '#34d399', fontWeight: 700 }}>${paid.toLocaleString()} USD</td>
                      <td style={{ color: bal === 0 ? 'var(--text-muted)' : '#f87171', fontWeight: 700 }}>
                        ${bal.toLocaleString()} USD
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, width: '35px' }}>{pct}%</span>
                          <div style={{ flex: 1, height: '6px', background: 'var(--bg-input)', borderRadius: '4px', maxWidth: '80px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? '#10b981' : '#f59e0b' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Summary */}
      {reportType === 'attendance' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Attendance Health Summary by Class</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Tracking regular attendance patterns across all academic forms and levels.
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Class Room</th>
                  <th>Class Teacher</th>
                  <th>Capacity</th>
                  <th>Enrolled</th>
                  <th>Average Present %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td style={{ fontWeight: 700 }}>{cls.name}</td>
                    <td>{cls.classTeacherName}</td>
                    <td>{cls.capacity}</td>
                    <td>{students.filter((s) => s.classId === cls.id).length}</td>
                    <td style={{ fontWeight: 800, color: '#818cf8' }}>95.4%</td>
                    <td>
                      <span className="badge badge-success">Optimal</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Academic Standings */}
      {reportType === 'academics' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Term 3 Merit & Distinction Standings</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Leading academic performers across Form 1 to Form 4.
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Rank</th>
                  <th>Student Name</th>
                  <th>Admission #</th>
                  <th>Class</th>
                  <th>GPA / Average %</th>
                  <th>Academic Standing</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: '1st', name: 'Tatenda Mutasa', adm: 'SMS-2026-001', cls: 'Form 1A', avg: 89.3, standing: 'Distinction' },
                  { rank: '2nd', name: 'Nyasha Chikwanha', adm: 'SMS-2026-004', cls: 'Form 1A', avg: 87.5, standing: 'Distinction' },
                  { rank: '3rd', name: 'Anesu Gumbo', adm: 'SMS-2026-002', cls: 'Form 1A', avg: 84.5, standing: 'Distinction' },
                  { rank: '4th', name: 'Simbarashe Machinga', adm: 'SMS-2026-005', cls: 'Form 1A', avg: 76.2, standing: 'Merit' },
                  { rank: '5th', name: 'Kudzai Mupfumi', adm: 'SMS-2026-003', cls: 'Form 1A', avg: 68.0, standing: 'Pass' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td>
                      <span className="badge badge-info" style={{ fontWeight: 800 }}>{row.rank}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{row.name}</td>
                    <td style={{ fontFamily: 'monospace', color: '#818cf8' }}>{row.adm}</td>
                    <td>{row.cls}</td>
                    <td style={{ fontWeight: 800, color: '#34d399' }}>{row.avg}%</td>
                    <td>
                      <span className={`badge ${row.standing === 'Distinction' ? 'badge-success' : 'badge-info'}`}>
                        {row.standing}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
