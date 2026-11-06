export type UserRole =
  | 'ADMIN'
  | 'HEAD'
  | 'DEPUTY_HEAD'
  | 'TEACHER'
  | 'STAFF'
  | 'STUDENT'
  | 'PARENT'
  | 'ORG';

export type StaffSubRole = 'BURSAR' | 'SECRETARY' | 'LIBRARIAN' | 'HOSTEL' | 'GENERAL';

export type PortalView =
  | 'landing'
  | 'staff'
  | 'student'
  | 'parent'
  | 'org';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subRole?: StaffSubRole;
  avatarUrl?: string;
  referenceId?: string;
}

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  classId: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  enrollmentDate: string;
  status: 'Active' | 'Transferred' | 'Graduated' | 'Suspended';
}

export interface Teacher {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  qualification: string;
  specialization: string;
  assignedClasses: string[]; // e.g. ["Form 3A", "Form 4B"]
  assignedSubjects: string[]; // e.g. ["Mathematics", "Physics"]
  status: 'Active' | 'On Leave';
}

export interface Classroom {
  id: string;
  name: string; // e.g., "Form 1A", "Grade 7 Blue"
  level: string; // "Form 1", "Grade 7"
  capacity: number;
  classTeacherId: string;
  classTeacherName: string;
  studentCount: number;
  roomNumber: string;
}

export interface Subject {
  id: string;
  code: string; // e.g., "MTH101", "ENG102"
  name: string; // "Mathematics", "English Literature"
  category: 'Core' | 'Elective' | 'Vocational';
  level: string; // "Junior Secondary", "Senior Secondary", "Primary"
  teacherId?: string;
  teacherName?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string;
}

export interface AcademicMark {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  year: number;
  courseworkMark: number; // Out of 30
  midTermMark: number; // Out of 30
  finalExamMark: number; // Out of 40
  totalScore: number; // Out of 100
  grade: 'A' | 'B' | 'C' | 'D' | 'U';
  remarks: string;
}

export type PaymentMethod = 'EcoCash' | 'Bank Transfer' | 'Cash' | 'Card';

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  term: string;
  year: number;
  tuitionFee: number;
  levyFee: number;
  otherFees: number;
  totalDue: number;
  amountPaid: number;
  balance: number;
  currency: 'USD' | 'ZiG';
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Unpaid';
}

export interface FeePayment {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  receiptNumber: string;
  amount: number;
  currency: 'USD' | 'ZiG';
  paymentDate: string;
  paymentMethod: PaymentMethod;
  recordedBy: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Sports' | 'Urgent' | 'Finance';
  targetAudience: 'All' | 'Teachers' | 'Students' | 'Parents';
  publishedDate: string;
  author: string;
  isPinned: boolean;
}

export interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceTodayPercent: number;
  totalFeesExpected: number;
  totalFeesCollected: number;
  feeCollectionRate: number;
  pendingReportCards: number;
}
