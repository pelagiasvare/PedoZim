import React, { useState, useEffect } from 'react';
import { Check, CheckCircle2, Save } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Student } from '../types';
import { dataService } from '../services/dataService';

export const AttendancePage: React.FC = () => {
  const classes = dataService.getClasses();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-1');
  const [selectedDate,    setSelectedDate]    = useState(new Date().toISOString().split('T')[0]);
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  const [attendanceMap,   setAttendanceMap]   = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [saveSuccess,     setSaveSuccess]     = useState(false);

  useEffect(() => {
    const list = dataService.getStudents().filter((s) => s.classId === selectedClassId);
    setStudentsInClass(list);
    const existing = dataService.getAttendance(selectedDate, selectedClassId);
    const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    list.forEach((s) => {
      const match = existing.find((r) => r.studentId === s.id);
      map[s.id] = match
        ? { status: match.status, remarks: match.remarks || '' }
        : { status: 'present', remarks: '' };
    });
    setAttendanceMap(map);
    setSaveSuccess(false);
  }, [selectedClassId, selectedDate]);

  const setStatus = (id: string, status: AttendanceStatus) => {
    setAttendanceMap((p) => ({ ...p, [id]: { ...p[id], status } }));
    setSaveSuccess(false);
  };

  const setRemarks = (id: string, remarks: string) =>
    setAttendanceMap((p) => ({ ...p, [id]: { ...p[id], remarks } }));

  const markAllPresent = () => {
    const m: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    studentsInClass.forEach((s) => { m[s.id] = { status: 'present', remarks: attendanceMap[s.id]?.remarks || '' }; });
    setAttendanceMap(m);
  };

  const save = () => {
    const records: AttendanceRecord[] = studentsInClass.map((s) => ({
      id: `att-${s.id}-${selectedDate}`,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      classId: selectedClassId,
      date: selectedDate,
      status: attendanceMap[s.id]?.status || 'present',
      remarks: attendanceMap[s.id]?.remarks || '',
      recordedBy: 'Class Teacher',
    }));
    dataService.saveAttendanceBatch(records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const total    = studentsInClass.length;
  const present  = Object.values(attendanceMap).filter((v) => v.status === 'present').length;
  const late     = Object.values(attendanceMap).filter((v) => v.status === 'late').length;
  const absent   = Object.values(attendanceMap).filter((v) => v.status === 'absent').length;
  const excused  = Object.values(attendanceMap).filter((v) => v.status === 'excused').length;
  const rate     = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  const statusColour = (s: AttendanceStatus) => ({
    present: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
    late:    { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
    absent:  { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
    excused: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  }[s]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Register</h1>
          <p className="page-subtitle">Record and track daily student attendance</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-secondary" onClick={markAllPresent}>
            <Check size={13} /> Mark All Present
          </button>
          <button className="btn btn-primary" onClick={save}>
            <Save size={13} /> Save
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert-success">
          <CheckCircle2 size={14} /> Attendance saved successfully.
        </div>
      )}

      {/* Controls */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label className="form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Date</label>
          <input type="date" className="form-input" style={{ width: 'auto' }}
            value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label className="form-label" style={{ margin: 0 }}>Class</label>
          <select className="form-select" style={{ width: 'auto' }}
            value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* KPI strip */}
      <div className="stat-grid">
        {[
          { label: 'Total',    val: `${total}`,   sub: 'Students' },
          { label: 'Present',  val: `${present}`, sub: 'on time',     colour: 'var(--green-text)' },
          { label: 'Late',     val: `${late}`,    sub: 'tardy',        colour: '#92400e' },
          { label: 'Absent',   val: `${absent}`,  sub: 'away',         colour: 'var(--red-text)' },
          { label: 'Rate',     val: `${rate}%`,   sub: 'attendance',   colour: 'var(--brand)' },
        ].map((k) => (
          <div key={k.label} className="stat-card" style={{ padding: '12px 14px' }}>
            <div className="stat-title">{k.label}</div>
            <div className="stat-val" style={{ fontSize: '20px', color: k.colour || 'var(--text-900)' }}>{k.val}</div>
            <div className="stat-meta">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '36px' }}>#</th>
              <th style={{ width: '110px' }}>Admission #</th>
              <th>Student</th>
              <th style={{ width: '340px' }}>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {studentsInClass.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-400)' }}>
                  No students in this class.
                </td>
              </tr>
            ) : studentsInClass.map((s, idx) => {
              const cur = attendanceMap[s.id]?.status || 'present';
              return (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text-400)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-700)' }}>{s.admissionNumber}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{s.firstName} {s.lastName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-400)' }}>{s.guardianPhone}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {(['present','late','absent','excused'] as AttendanceStatus[]).map((st) => {
                        const isActive = cur === st;
                        const col = statusColour(st);
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStatus(s.id, st)}
                            style={{
                              padding: '3px 10px',
                              borderRadius: 'var(--radius)',
                              fontSize: '12px',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              cursor: 'pointer',
                              border: `1px solid ${isActive ? col.border : 'var(--border)'}`,
                              background: isActive ? col.bg : '#fff',
                              color: isActive ? col.color : 'var(--text-500)',
                              transition: 'all 0.1s',
                            }}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <input type="text" className="form-input"
                      style={{ fontSize: '12px' }}
                      placeholder="Optional reason..."
                      value={attendanceMap[s.id]?.remarks || ''}
                      onChange={(e) => setRemarks(s.id, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
