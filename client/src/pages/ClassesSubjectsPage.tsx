import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';
import { dataService } from '../services/dataService';

export const ClassesSubjectsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');
  const classes = dataService.getClasses();
  const subjects = dataService.getSubjects();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Classes & Curriculum</h1>
          <p className="page-subtitle">
            Configure classrooms, grade levels, student enrollments, and subject curricula
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          <Building2 size={18} /> Active Classrooms ({classes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          <BookOpen size={18} /> Subjects Curriculum ({subjects.length})
        </button>
      </div>

      {/* Classes Tab */}
      {activeTab === 'classes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {classes.map((cls) => {
            const studentCount = dataService
              .getStudents()
              .filter((s) => s.classId === cls.id).length;
            const occupancyPct = Math.round((studentCount / cls.capacity) * 100);

            return (
              <div key={cls.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{cls.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>{cls.level} Stream</div>
                  </div>
                  <span className="badge badge-info">{cls.roomNumber}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <GraduationCap size={16} style={{ color: 'var(--text-muted)' }} />
                  <span>
                    Class Teacher: <strong>{cls.classTeacherName}</strong>
                  </span>
                </div>

                {/* Capacity Progress */}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Enrolled: {studentCount} / {cls.capacity} students</span>
                    <span>{occupancyPct}% Capacity</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, occupancyPct)}%`,
                        height: '100%',
                        background: occupancyPct > 90 ? 'var(--status-danger-text)' : 'var(--pedo-primary)',
                        borderRadius: 'var(--radius-pill)',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Title</th>
                <th>Category</th>
                <th>Education Level</th>
                <th>Assigned Teacher</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#818cf8' }}>
                      {sub.code}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: '0.95rem' }}>{sub.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        sub.category === 'Core'
                          ? 'badge-info'
                          : sub.category === 'Elective'
                          ? 'badge-warning'
                          : 'badge-success'
                      }`}
                    >
                      {sub.category}
                    </span>
                  </td>
                  <td>{sub.level}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <GraduationCap size={15} style={{ color: '#818cf8' }} />
                      <span>{sub.teacherName || 'Unassigned'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
