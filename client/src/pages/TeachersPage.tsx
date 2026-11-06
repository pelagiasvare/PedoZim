iimport React, { useState } from 'react';
import {
  GraduationCap,
  UserPlus,
  Search,
  Mail,
  Phone,
  BookOpen,
  Award,
  X,
} from 'lucide-react';
import { Teacher } from '../types';
import { dataService } from '../services/dataService';

export const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(dataService.getTeachers());
  const classes = dataService.getClasses();
  const subjects = dataService.getSubjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male' as 'Male' | 'Female',
    email: '',
    phone: '',
    qualification: '',
    specialization: '',
    assignedClasses: ['Form 1A'],
    assignedSubjects: ['Mathematics'],
    status: 'Active' as const,
  });

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addTeacher(formData);
    setTeachers(dataService.getTeachers());
    setIsModalOpen(false);
  };

  const filteredTeachers = teachers.filter((t) => {
    const search = searchTerm.toLowerCase();
    return (
      t.firstName.toLowerCase().includes(search) ||
      t.lastName.toLowerCase().includes(search) ||
      t.specialization.toLowerCase().includes(search) ||
      t.staffNumber.toLowerCase().includes(search)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty & Teaching Staff</h1>
          <p className="page-subtitle">
            Manage teacher departments, assigned classes, subject allocations, and credentials
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Add New Teacher
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div className="topbar-search" style={{ width: '340px' }}>
          <Search size={16} className="topbar-search-icon" />
          <input
            type="text"
            placeholder="Search by teacher name, subject, or staff ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Teachers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredTeachers.map((t) => (
          <div key={t.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--pedo-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {t.firstName[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                  {t.firstName} {t.lastName}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {t.staffNumber} • {t.specialization}
                </div>
              </div>
              <span className="badge badge-success">{t.status}</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span>{t.qualification}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={13} /> {t.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={13} /> {t.phone}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Allocated Subjects & Classes
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {t.assignedSubjects.map((sub, idx) => (
                  <span key={idx} className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                    {sub}
                  </span>
                ))}
                {t.assignedClasses.map((cls, idx) => (
                  <span key={idx} className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Faculty Member</h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTeacher}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="+263 77..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Academic Qualification *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. B.Sc Education (Maths)"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Pure Mathematics"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Faculty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
