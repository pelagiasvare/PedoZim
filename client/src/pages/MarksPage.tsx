import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Printer, X } from 'lucide-react';
import { AcademicMark, Student } from '../types';
import { dataService } from '../services/dataService';

export const MarksPage: React.FC = () => {
  const classes  = dataService.getClasses();
  const subjects = dataService.getSubjects();

  const [selectedClassId,   setSelectedClassId]   = useState(classes[0]?.id   || 'cls-1');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id  || 'sub-1');
  const [selectedTerm,      setSelectedTerm]      = useState<'Term 1'|'Term 2'|'Term 3'>('Term 3');

  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  const [marksState, setMarksState] = useState<Record<string, { coursework: number; midTerm: number; exam: number; remarks: string }>>({});
  const [savedSuccess,    setSavedSuccess]    = useState(false);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);

  useEffect(() => {
    const list = dataService.getStudents().filter((s) => s.classId === selectedClassId);
    setStudentsInClass(list);
    const existing = dataService.getMarks(selectedClassId, selectedSubjectId, selectedTerm);
    const map: Record<string, any> = {};
    list.forEach((s) => {
      const m = existing.find((x) => x.studentId === s.id);
      map[s.id] = m
        ? { coursework: m.courseworkMark, midTerm: m.midTermMark, exam: m.finalExamMark, remarks: m.remarks }
        : { coursework: 20, midTerm: 20, exam: 28, remarks: 'Good progress' };
    });
    setMarksState(map);
    setSavedSuccess(false);
  }, [selectedClassId, selectedSubjectId, selectedTerm]);

  const grade = (total: number): 'A'|'B'|'C'|'D'|'U' => {
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    if (total >= 50) return 'D';
    return 'U';
  };

  const setScore = (id: string, field: 'coursework'|'midTerm'|'exam', val: number) =>
    setMarksState((p) => ({ ...p, [id]: { ...p[id], [field]: isNaN(val) ? 0 : val } }));

  const setRemarks = (id: string, remarks: string) =>
    setMarksState((p) => ({ ...p, [id]: { ...p[id], remarks } }));

  const save = () => {
    const sub = subjects.find((s) => s.id === selectedSubjectId);
    studentsInClass.forEach((s) => {
      const e = marksState[s.id];
      if (!e) return;
      const total = Math.min(100, Math.max(0, e.coursework + e.midTerm + e.exam));
      const mark: AcademicMark = {
        id: `mrk-${s.id}-${selectedSubjectId}-${selectedTerm}`,
        studentId: s.id, studentName: `${s.firstName} ${s.lastName}`,
        classId: selectedClassId, subjectId: selectedSubjectId,
        subjectName: sub?.name || 'Subject', term: selectedTerm, year: 2026,
        courseworkMark: e.coursework, midTermMark: e.midTerm, finalExamMark: e.exam,
        totalScore: total, grade: grade(total), remarks: e.remarks,
      };
      dataService.saveMark(mark);
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      <div className="page-header">
        <div>
          <h1 className="page-title">ZIMSEC Marks &amp; Grades</h1>
          <p className="page-subtitle">Enter marks and generate terminal report cards</p>
        </div>
        <button className="btn btn-primary" onClick={save}>
          <Save size={13} /> Save Marks
        </button>
      </div>

      {savedSuccess && (
        <div className="alert-success">
          <CheckCircle2 size={14} /> Marks saved successfully.
        </div>
      )}

      {/* Selectors */}
      <div className="filter-bar">
        <div className="form-group" style={{ flex: '0 0 auto', minWidth: '140px' }}>
          <label className="form-label">Term</label>
          <select className="form-select" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value as any)}>
            <option value="Term 1">Term 1 2026</option>
            <option value="Term 2">Term 2 2026</option>
            <option value="Term 3">Term 3 2026</option>
          </select>
        </div>
        <div className="form-group" style={{ flex: '0 0 auto', minWidth: '130px' }}>
          <label className="form-label">Class</label>
          <select className="form-select" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: '0 0 auto', minWidth: '200px' }}>
          <label className="form-label">Subject</label>
          <select className="form-select" value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
          </select>
        </div>
      </div>

      {/* Marks table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '110px' }}>Admission #</th>
              <th>Student</th>
              <th style={{ width: '110px' }}>CW /30</th>
              <th style={{ width: '110px' }}>MT /30</th>
              <th style={{ width: '110px' }}>Exam /40</th>
              <th style={{ width: '80px' }}>Total</th>
              <th style={{ width: '70px' }}>Grade</th>
              <th>Remarks</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Report</th>
            </tr>
          </thead>
          <tbody>
            {studentsInClass.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-400)' }}>
                  No students in this class.
                </td>
              </tr>
            ) : studentsInClass.map((s) => {
              const e = marksState[s.id] || { coursework: 0, midTerm: 0, exam: 0, remarks: '' };
              const total = Math.min(100, Math.max(0, e.coursework + e.midTerm + e.exam));
              const g = grade(total);
              return (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-700)' }}>{s.admissionNumber}</td>
                  <td style={{ fontWeight: 500 }}>{s.firstName} {s.lastName}</td>
                  <td>
                    <input type="number" min="0" max="30" className="form-input"
                      style={{ width: '70px' }} value={e.coursework}
                      onChange={(ev) => setScore(s.id, 'coursework', parseInt(ev.target.value))} />
                  </td>
                  <td>
                    <input type="number" min="0" max="30" className="form-input"
                      style={{ width: '70px' }} value={e.midTerm}
                      onChange={(ev) => setScore(s.id, 'midTerm', parseInt(ev.target.value))} />
                  </td>
                  <td>
                    <input type="number" min="0" max="40" className="form-input"
                      style={{ width: '70px' }} value={e.exam}
                      onChange={(ev) => setScore(s.id, 'exam', parseInt(ev.target.value))} />
                  </td>
                  <td style={{ fontWeight: 700 }}>{total}%</td>
                  <td>
                    <span className={`badge ${g === 'A' ? 'badge-success' : g === 'B' ? 'badge-info' : g === 'U' ? 'badge-danger' : 'badge-warning'}`}>
                      {g}
                    </span>
                  </td>
                  <td>
                    <input type="text" className="form-input" style={{ fontSize: '12px' }}
                      value={e.remarks}
                      onChange={(ev) => setRemarks(s.id, ev.target.value)} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setReportCardStudent(s)}>
                      <Printer size={12} /> Print
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Report Card Modal */}
      {reportCardStudent && (
        <div className="modal-overlay" onClick={() => setReportCardStudent(null)}>
          <div className="modal-content" style={{ maxWidth: '700px', color: '#0f172a' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Harare Central High School
                </h2>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  P.O. Box 450, Harare · Tel: +263 242 700000 · Ministry of Primary &amp; Secondary Education
                </div>
                <div style={{ marginTop: '8px', display: 'inline-block', padding: '3px 16px', background: '#0f172a', color: '#fff', borderRadius: '2px', fontWeight: 700, fontSize: '13px' }}>
                  TERMINAL REPORT — {selectedTerm.toUpperCase()} 2026
                </div>
              </div>

              {/* Student info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '3px' }}>
                <div><strong>Name:</strong> {reportCardStudent.firstName} {reportCardStudent.lastName}</div>
                <div><strong>Admission #:</strong> {reportCardStudent.admissionNumber}</div>
                <div><strong>Class:</strong> {reportCardStudent.className}</div>
                <div><strong>Term End:</strong> December 2026</div>
                <div><strong>Guardian:</strong> {reportCardStudent.guardianName}</div>
                <div><strong>Attendance:</strong> 96%</div>
              </div>

              {/* Marks */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #94a3b8' }}>
                    {['Subject','CW /30','MT /30','Exam /40','Total %','Grade','Remarks'].map((h) => (
                      <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataService.getMarksByStudent(reportCardStudent.id).map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 600 }}>{m.subjectName}</td>
                      <td style={{ padding: '7px 10px' }}>{m.courseworkMark}</td>
                      <td style={{ padding: '7px 10px' }}>{m.midTermMark}</td>
                      <td style={{ padding: '7px 10px' }}>{m.finalExamMark}</td>
                      <td style={{ padding: '7px 10px', fontWeight: 700 }}>{m.totalScore}%</td>
                      <td style={{ padding: '7px 10px', fontWeight: 700 }}>{m.grade}</td>
                      <td style={{ padding: '7px 10px', color: '#475569' }}>{m.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Remarks / signature */}
              <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '3px', fontSize: '13px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Principal's Remarks:</div>
                <p style={{ color: '#334155', fontStyle: 'italic' }}>
                  An exceptionally determined student. Keep up the high standard of dedication.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                  <div>Class Teacher: _______________________</div>
                  <div>Principal: Pelagia Svare</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button style={{ padding: '6px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  onClick={() => window.print()}>
                  <Printer size={13} /> Print
                </button>
                <button style={{ padding: '6px 16px', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                  onClick={() => setReportCardStudent(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
