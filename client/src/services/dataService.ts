import {
  Student,
  Teacher,
  Classroom,
  Subject,
  AttendanceRecord,
  AcademicMark,
  FeeInvoice,
  FeePayment,
  Announcement,
  DashboardMetrics,
} from '../types';

import {
  mockStudents,
  mockTeachers,
  mockClasses,
  mockSubjects,
  mockAttendanceRecords,
  mockAcademicMarks,
  mockFeeInvoices,
  mockFeePayments,
  mockAnnouncements,
  mockDashboardMetrics,
} from '../data/mockData';

// Local storage keys
const STORAGE_KEYS = {
  STUDENTS: 'edutrack_students',
  TEACHERS: 'edutrack_teachers',
  CLASSES: 'edutrack_classes',
  SUBJECTS: 'edutrack_subjects',
  ATTENDANCE: 'edutrack_attendance',
  MARKS: 'edutrack_marks',
  INVOICES: 'edutrack_invoices',
  PAYMENTS: 'edutrack_payments',
  ANNOUNCEMENTS: 'edutrack_announcements',
};

// Helper to load or initialize from mock
function getInitial<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Error loading ${key}`, e);
  }
  return fallback;
}

// In-memory / storage sync state
class DataService {
  private students: Student[] = getInitial(STORAGE_KEYS.STUDENTS, mockStudents);
  private teachers: Teacher[] = getInitial(STORAGE_KEYS.TEACHERS, mockTeachers);
  private classes: Classroom[] = getInitial(STORAGE_KEYS.CLASSES, mockClasses);
  private subjects: Subject[] = getInitial(STORAGE_KEYS.SUBJECTS, mockSubjects);
  private attendance: AttendanceRecord[] = getInitial(STORAGE_KEYS.ATTENDANCE, mockAttendanceRecords);
  private marks: AcademicMark[] = getInitial(STORAGE_KEYS.MARKS, mockAcademicMarks);
  private invoices: FeeInvoice[] = getInitial(STORAGE_KEYS.INVOICES, mockFeeInvoices);
  private payments: FeePayment[] = getInitial(STORAGE_KEYS.PAYMENTS, mockFeePayments);
  private announcements: Announcement[] = getInitial(STORAGE_KEYS.ANNOUNCEMENTS, mockAnnouncements);

  private save(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  // Students
  getStudents(): Student[] {
    return [...this.students];
  }

  getStudentById(id: string): Student | undefined {
    return this.students.find((s) => s.id === id);
  }

  addStudent(studentData: Omit<Student, 'id' | 'admissionNumber'>): Student {
    const id = `std-${Date.now()}`;
    const nextNum = (this.students.length + 1).toString().padStart(3, '0');
    const admissionNumber = `SMS-2026-${nextNum}`;
    const newStudent: Student = {
      ...studentData,
      id,
      admissionNumber,
    };
    this.students.unshift(newStudent);
    this.save(STORAGE_KEYS.STUDENTS, this.students);

    // Also auto-generate an initial fee invoice for Term 3 2026
    const invoice: FeeInvoice = {
      id: `inv-${Date.now()}`,
      studentId: newStudent.id,
      studentName: `${newStudent.firstName} ${newStudent.lastName}`,
      admissionNumber: newStudent.admissionNumber,
      className: newStudent.className,
      term: 'Term 3 2026',
      year: 2026,
      tuitionFee: 350,
      levyFee: 80,
      otherFees: 20,
      totalDue: 450,
      amountPaid: 0,
      balance: 450,
      currency: 'USD',
      dueDate: '2026-11-15',
      status: 'Unpaid',
    };
    this.invoices.push(invoice);
    this.save(STORAGE_KEYS.INVOICES, this.invoices);

    return newStudent;
  }

  updateStudent(student: Student): Student {
    const idx = this.students.findIndex((s) => s.id === student.id);
    if (idx !== -1) {
      this.students[idx] = student;
      this.save(STORAGE_KEYS.STUDENTS, this.students);
    }
    return student;
  }

  deleteStudent(id: string): boolean {
    this.students = this.students.filter((s) => s.id !== id);
    this.save(STORAGE_KEYS.STUDENTS, this.students);
    return true;
  }

  // Teachers
  getTeachers(): Teacher[] {
    return [...this.teachers];
  }

  addTeacher(teacherData: Omit<Teacher, 'id' | 'staffNumber'>): Teacher {
    const id = `tch-${Date.now()}`;
    const staffNumber = `TCH-2026-${(this.teachers.length + 1).toString().padStart(3, '0')}`;
    const newTeacher: Teacher = { ...teacherData, id, staffNumber };
    this.teachers.unshift(newTeacher);
    this.save(STORAGE_KEYS.TEACHERS, this.teachers);
    return newTeacher;
  }

  // Classes & Subjects
  getClasses(): Classroom[] {
    return [...this.classes];
  }

  getSubjects(): Subject[] {
    return [...this.subjects];
  }

  // Attendance
  getAttendance(date: string, classId?: string): AttendanceRecord[] {
    return this.attendance.filter(
      (a) => (!date || a.date === date) && (!classId || a.classId === classId)
    );
  }

  saveAttendanceBatch(records: AttendanceRecord[]): void {
    // Replace existing records for that date & students or push new
    const map = new Map(this.attendance.map((a) => [`${a.studentId}_${a.date}`, a]));
    records.forEach((r) => {
      map.set(`${r.studentId}_${r.date}`, r);
    });
    this.attendance = Array.from(map.values());
    this.save(STORAGE_KEYS.ATTENDANCE, this.attendance);
  }

  // Marks
  getMarks(classId?: string, subjectId?: string, term: string = 'Term 3'): AcademicMark[] {
    return this.marks.filter(
      (m) =>
        (!classId || m.classId === classId) &&
        (!subjectId || m.subjectId === subjectId) &&
        m.term === term
    );
  }

  getMarksByStudent(studentId: string): AcademicMark[] {
    return this.marks.filter((m) => m.studentId === studentId);
  }

  saveMark(mark: AcademicMark): void {
    const idx = this.marks.findIndex(
      (m) =>
        m.studentId === mark.studentId &&
        m.subjectId === mark.subjectId &&
        m.term === mark.term &&
        m.year === mark.year
    );
    if (idx !== -1) {
      this.marks[idx] = mark;
    } else {
      this.marks.push(mark);
    }
    this.save(STORAGE_KEYS.MARKS, this.marks);
  }

  // Fees
  getInvoices(): FeeInvoice[] {
    return [...this.invoices];
  }

  getPayments(): FeePayment[] {
    return [...this.payments];
  }

  recordPayment(
    invoiceId: string,
    amount: number,
    method: FeePayment['paymentMethod'],
    recordedBy: string,
    notes?: string
  ): FeePayment {
    const invoice = this.invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const payment: FeePayment = {
      id: `pay-${Date.now()}`,
      invoiceId,
      studentId: invoice.studentId,
      studentName: invoice.studentName,
      receiptNumber: `RCT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      amount,
      currency: invoice.currency,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: method,
      recordedBy,
      notes,
    };

    invoice.amountPaid += amount;
    invoice.balance = Math.max(0, invoice.totalDue - invoice.amountPaid);
    if (invoice.balance === 0) {
      invoice.status = 'Paid';
    } else if (invoice.amountPaid > 0) {
      invoice.status = 'Partial';
    }

    this.payments.unshift(payment);
    this.save(STORAGE_KEYS.INVOICES, this.invoices);
    this.save(STORAGE_KEYS.PAYMENTS, this.payments);
    return payment;
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    return [...this.announcements];
  }

  addAnnouncement(
    announcement: Omit<Announcement, 'id' | 'publishedDate'>
  ): Announcement {
    const newAnc: Announcement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    this.announcements.unshift(newAnc);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
    return newAnc;
  }

  // Dashboard Metrics
  getDashboardMetrics(): DashboardMetrics {
    const totalStudents = this.students.length;
    const totalTeachers = this.teachers.length;
    const totalClasses = this.classes.length;

    // Today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.attendance.filter((a) => a.date === today);
    const presentCount = todayAttendance.filter(
      (a) => a.status === 'present' || a.status === 'late'
    ).length;
    const attendanceTodayPercent =
      todayAttendance.length > 0
        ? Math.round((presentCount / todayAttendance.length) * 100)
        : mockDashboardMetrics.attendanceTodayPercent;

    const totalFeesExpected = this.invoices.reduce((acc, i) => acc + i.totalDue, 0);
    const totalFeesCollected = this.invoices.reduce((acc, i) => acc + i.amountPaid, 0);
    const feeCollectionRate =
      totalFeesExpected > 0
        ? Math.round((totalFeesCollected / totalFeesExpected) * 100)
        : 0;

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      attendanceTodayPercent,
      totalFeesExpected,
      totalFeesCollected,
      feeCollectionRate,
      pendingReportCards: 12,
    };
  }

  // Reset demo data
  resetDemoData(): void {
    localStorage.clear();
    this.students = [...mockStudents];
    this.teachers = [...mockTeachers];
    this.classes = [...mockClasses];
    this.subjects = [...mockSubjects];
    this.attendance = [...mockAttendanceRecords];
    this.marks = [...mockAcademicMarks];
    this.invoices = [...mockFeeInvoices];
    this.payments = [...mockFeePayments];
    this.announcements = [...mockAnnouncements];
  }
}

export const dataService = new DataService();
