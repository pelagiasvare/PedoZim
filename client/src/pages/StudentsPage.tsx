import React, { useState } from 'react';
import { UserPlus, Eye, Edit2, Trash2, X, Phone, MapPin, Calendar, Award, Receipt } from 'lucide-react';
import { Student } from '../types';
import { dataService } from '../services/dataService';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(dataService.getStudents());
  const classes = dataService.getClasses();

  const [searchTerm,     setSearchTerm]     = useState('');
  const [selectedClass,  setSelectedClass]  = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [editingStudent,  setEditingStudent]  = useState<Student | null>(null);
  const [viewingStudent,  setViewingStudent]  = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: 'Male' as 'Male' | 'Female',
    dateOfBirth: '2012-01-01',
    classId: classes[0]?.id || 'cls-1', className: classes[0]?.name || 'Form 1A',
    guardianName: '', guardianPhone: '', guardianEmail: '', address: '',
    status: 'Active' as Student['status'],
    enrollmentDate: new Date().toISOString().split('T')[0],
  });

  const refresh = () => setStudents(dataService.getStudents());

  const openAdd = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '', lastName: '', gender: 'Male',
      dateOfBirth: '2012-01-01',
      classId: classes[0]?.id || 'cls-1', className: classes[0]?.name || 'Form 1A',
      guardianName: '', guardianPhone: '', guardianEmail: '', address: '',
      status: 'Active', enrollmentDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({
      firstName: s.firstName, lastName: s.lastName, gender: s.gender,
      dateOfBirth: s.dateOfBirth, classId: s.classId, className: s.className,
      guardianName: s.guardianName, guardianPhone: s.guardianPhone,
      guardianEmail: s.guardianEmail, address: s.address,
      status: s.status, enrollmentDate: s.enrollmentDate,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove student "${name}"?`)) {
      dataService.deleteStudent(id);
      refresh();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find((c) => c.id === formData.classId);
    const resolvedClassName = cls ? cls.name : formData.className;
    if (editingStudent) {
      dataService.updateStudent({ ...editingStudent, ...formData, className: resolvedClassName });
    } else {
      dataService.addStudent({ ...formData, className: resolvedClassName });
    }
    setIsModalOpen(false);
    refresh();
  };

  const filtered = students.filter((s) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchSearch =
      name.includes(searchTerm.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass  = selectedClass  === 'ALL' || s.classId === selectedClass;
    const matchStatus = selectedStatus === 'ALL' || s.status  === selectedStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const statusBadge = (status: Student['status']) => {
    if (status === 'Active')      return <span className="badge badge-success">Active</span>;
    if (status === 'Transferred') return <span className="badge badge-warning">Transferred</span>;
    if (status === 'Graduated')   return <span className="badge badge-info">Graduated</span>;
    return <span className="badge badge-danger">{status}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage admissions, profiles and academic records</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <UserPlus size={13} /> Admit Student
        </button>
      </div>

      {/* Filters — single bar, one search input */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: '260px' }}
          placeholder="Search name, admission #, guardian..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select"
          style={{ width: '150px' }}
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="ALL">All Classes</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          className="form-select"
          style={{ width: '140px' }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Transferred">Transferred</option>
          <option value="Graduated">Graduated</option>
        </select>
        <span style={{ fontSize: '12px', color: 'var(--text-400)', marginLeft: 'auto' }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '110px' }}>Admission #</th>
              <th>Student Name</th>
              <th style={{ width: '70px' }}>Gender</th>
              <th style={{ width: '110px' }}>Class</th>
              <th>Guardian</th>
              <th style={{ width: '100px' }}>Enrolled</th>
              <th style={{ width: '90px' }}>Status</th>
              <th style={{ width: '90px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-400)' }}>
                  No students match the current filters.
                </td>
              </tr>
            ) : filtered.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-700)' }}>{s.admissionNumber}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{s.firstName} {s.lastName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-400)' }}>DOB: {s.dateOfBirth}</div>
                </td>
                <td>{s.gender}</td>
                <td><span className="badge badge-info">{s.className}</span></td>
                <td>
                  <div style={{ fontWeight: 500 }}>{s.guardianName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-400)' }}>{s.guardianPhone}</div>
                </td>
                <td style={{ color: 'var(--text-500)', fontSize: '12px' }}>{s.enrollmentDate}</td>
                <td>{statusBadge(s.status)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                    <button className="tbl-action" title="View Profile" onClick={() => setViewingStudent(s)}>
                      <Eye size={13} />
                    </button>
                    <button className="tbl-action" title="Edit" onClick={() => openEdit(s)}>
                      <Edit2 size={13} />
                    </button>
                    <button className="tbl-action danger" title="Delete" onClick={() => handleDelete(s.id, `${s.firstName} ${s.lastName}`)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStudent ? 'Edit Student' : 'Admit New Student'}</h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={14} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input type="text" className="form-input" required value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className="form-input" required value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-input" required value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Class *</label>
                    <select className="form-select" value={formData.classId}
                      onChange={(e) => {
                        const c = classes.find((cl) => cl.id === e.target.value);
                        setFormData({ ...formData, classId: e.target.value, className: c ? c.name : '' });
                      }}>
                      {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Enrollment Date</label>
                    <input type="date" className="form-input" required value={formData.enrollmentDate}
                      onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })} />
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-500)', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
                  Guardian / Contact
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Guardian Name *</label>
                    <input type="text" className="form-input" required value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guardian Phone *</label>
                    <input type="text" className="form-input" required placeholder="+263 77..."
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Guardian Email</label>
                  <input type="email" className="form-input" value={formData.guardianEmail}
                    onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-input" placeholder="e.g. 14 Harare Drive, Borrowdale"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Save Changes' : 'Confirm Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {viewingStudent && (
        <div className="modal-overlay" onClick={() => setViewingStudent(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Student Profile</h2>
                <span style={{ fontSize: '11px', color: 'var(--text-400)' }}>{viewingStudent.admissionNumber}</span>
              </div>
              <button className="icon-btn" onClick={() => setViewingStudent(null)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              {/* Summary row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-page)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius)', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>
                  {viewingStudent.firstName[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{viewingStudent.firstName} {viewingStudent.lastName}</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span className="badge badge-info">{viewingStudent.className}</span>
                    {statusBadge(viewingStudent.status)}
                    <span className="badge badge-neutral">{viewingStudent.gender}</span>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px' }}>
                {[
                  { icon: <Phone size={12} />, label: 'Guardian', val: viewingStudent.guardianName, sub: viewingStudent.guardianPhone },
                  { icon: <MapPin size={12} />, label: 'Address', val: viewingStudent.address || 'Harare, Zimbabwe' },
                  { icon: <Calendar size={12} />, label: 'Dates', val: `DOB: ${viewingStudent.dateOfBirth}`, sub: `Enrolled: ${viewingStudent.enrollmentDate}` },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-page)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-400)', fontSize: '11px', marginBottom: '3px' }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{item.val}</div>
                    {item.sub && <div style={{ fontSize: '11px', color: 'var(--text-400)' }}>{item.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Marks */}
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Award size={13} style={{ color: 'var(--text-400)' }} /> Term 3 Academic Marks
                </div>
                {dataService.getMarksByStudent(viewingStudent.id).length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-400)' }}>No marks entered for this term.</p>
                ) : (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>CW /30</th>
                          <th>MT /30</th>
                          <th>Exam /40</th>
                          <th>Total</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataService.getMarksByStudent(viewingStudent.id).map((m) => (
                          <tr key={m.id}>
                            <td style={{ fontWeight: 500 }}>{m.subjectName}</td>
                            <td>{m.courseworkMark}</td>
                            <td>{m.midTermMark}</td>
                            <td>{m.finalExamMark}</td>
                            <td style={{ fontWeight: 600 }}>{m.totalScore}%</td>
                            <td>
                              <span className={`badge ${m.grade === 'A' ? 'badge-success' : m.grade === 'B' ? 'badge-info' : 'badge-warning'}`}>
                                {m.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Fee status */}
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Receipt size={13} style={{ color: 'var(--text-400)' }} /> Fee Statement
                </div>
                {(() => {
                  const inv = dataService.getInvoices().find((i) => i.studentId === viewingStudent.id);
                  if (!inv) return <p style={{ fontSize: '12px', color: 'var(--text-400)' }}>No invoice found.</p>;
                  return (
                    <div style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '13px' }}>{inv.term}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-400)' }}>Due: {inv.dueDate}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px' }}>Paid: <strong>${inv.amountPaid}</strong> / ${inv.totalDue}</div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: inv.balance === 0 ? 'var(--green-text)' : 'var(--red-text)' }}>
                          {inv.balance === 0 ? 'Fully Paid' : `Balance: $${inv.balance}`}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewingStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
