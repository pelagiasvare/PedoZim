import React from 'react';
import {
  Users, GraduationCap, CalendarCheck, DollarSign,
  UserPlus, FileCheck2, CreditCard, Megaphone, ArrowRight, Pin,
} from 'lucide-react';
import { User } from '../types';
import { dataService } from '../services/dataService';
import { ActivePage } from '../components/Sidebar';

interface DashboardPageProps {
  currentUser: User;
  onNavigate: (page: ActivePage) => void;
  onOpenNewStudentModal: () => void;
  onOpenRecordPaymentModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser, onNavigate, onOpenNewStudentModal, onOpenRecordPaymentModal,
}) => {
  const metrics      = dataService.getDashboardMetrics();
  const announcements = dataService.getAnnouncements().slice(0, 3);
  const recentPayments = dataService.getPayments().slice(0, 5);

  const attendanceWeekly = [
    { day: 'Mon', rate: 96 },
    { day: 'Tue', rate: 94 },
    { day: 'Wed', rate: 97 },
    { day: 'Thu', rate: 93 },
    { day: 'Today', rate: metrics.attendanceTodayPercent },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Academic Year 2026 · Term 3 &nbsp;|&nbsp; {metrics.totalStudents} students across {metrics.totalClasses} classes
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {currentUser.role === 'ADMIN' && (
            <button className="btn btn-primary" onClick={onOpenNewStudentModal}>
              <UserPlus size={13} /> Admit Student
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => onNavigate('attendance')}>
            <FileCheck2 size={13} /> Attendance
          </button>
          <button className="btn btn-navy" onClick={onOpenRecordPaymentModal}>
            <CreditCard size={13} /> Record Payment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Students</span>
            <div className="stat-icon"><Users size={15} /></div>
          </div>
          <div className="stat-val">{metrics.totalStudents}</div>
          <div className="stat-meta">
            <span style={{ color: 'var(--green-text)', fontWeight: 600 }}>+12 this term</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Teaching Staff</span>
            <div className="stat-icon"><GraduationCap size={15} /></div>
          </div>
          <div className="stat-val">{metrics.totalTeachers}</div>
          <div className="stat-meta">All departments covered</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Today's Attendance</span>
            <div className="stat-icon"><CalendarCheck size={15} /></div>
          </div>
          <div className="stat-val">{metrics.attendanceTodayPercent}%</div>
          <div className="stat-meta">Recorded turnout</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Term 3 Fee Collection</span>
            <div className="stat-icon"><DollarSign size={15} /></div>
          </div>
          <div className="stat-val">${metrics.totalFeesCollected.toLocaleString()}</div>
          <div className="stat-meta">
            <span style={{ color: 'var(--green-text)', fontWeight: 600 }}>{metrics.feeCollectionRate}%</span>
            <span>of ${metrics.totalFeesExpected.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '12px' }}>

        {/* Weekly Attendance */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-900)' }}>Weekly Attendance</div>
              <div style={{ fontSize: '11px', color: 'var(--text-500)' }}>Attendance rate by day</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('attendance')}>
              View <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
            {attendanceWeekly.map((item, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-500)' }}>{item.rate}%</span>
                <div style={{
                  width: '100%',
                  height: `${(item.rate / 100) * 88}px`,
                  background: item.day === 'Today' ? 'var(--brand)' : '#cbd5e1',
                  borderRadius: '2px',
                }} />
                <span style={{ fontSize: '11px', color: 'var(--text-500)' }}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee collection */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-900)' }}>Fee Collection — Term 3</div>
              <div style={{ fontSize: '11px', color: 'var(--text-500)' }}>Tuition, levies &amp; exam fees</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('fees')}>
              Manage <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-500)' }}>Collection progress</span>
              <span style={{ fontWeight: 600, color: 'var(--green-text)' }}>{metrics.feeCollectionRate}% cleared</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill green" style={{ width: `${metrics.feeCollectionRate}%` }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            <div style={{ padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-500)', marginBottom: '2px' }}>Collected</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green-text)' }}>${metrics.totalFeesCollected.toLocaleString()}</div>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-500)', marginBottom: '2px' }}>Outstanding</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--red-text)' }}>${(metrics.totalFeesExpected - metrics.totalFeesCollected).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '12px' }}>

        {/* Announcements */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Megaphone size={14} style={{ color: 'var(--text-500)' }} />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Announcements</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('announcements')}>All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {announcements.map((anc) => (
              <div key={anc.id} style={{
                padding: '10px 12px',
                background: 'var(--bg-page)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                borderLeft: anc.isPinned ? '3px solid var(--brand)' : undefined,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span className="badge badge-neutral">{anc.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-400)' }}>
                    {anc.isPinned && <Pin size={11} style={{ color: 'var(--brand)' }} />}
                    {anc.publishedDate}
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{anc.title}</div>
                <p style={{ fontSize: '12px', color: 'var(--text-500)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {anc.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent payments */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={14} style={{ color: 'var(--text-500)' }} />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Recent Payments</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('fees')}>View All</button>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Method</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.studentName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-400)' }}>{p.receiptNumber}</div>
                    </td>
                    <td style={{ color: 'var(--text-500)' }}>{p.paymentMethod}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--green-text)' }}>
                      +${p.amount}
                    </td>
                    <td style={{ color: 'var(--text-500)', fontSize: '12px' }}>{p.paymentDate}</td>
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
