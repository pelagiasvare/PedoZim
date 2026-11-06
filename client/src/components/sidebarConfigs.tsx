import React from 'react';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  FileSpreadsheet, Receipt, Megaphone, BarChart3, Settings, UserCog,
  Clock, Library, FileText, UserCircle, BookMarked, ClipboardList,
  Activity, DollarSign, Award, Contact, BadgeCheck, UserCheck,
  Home, MessageSquare, CreditCard, Banknote, BookCopy, RotateCcw,
  AlertTriangle, FolderOpen, Building2, DoorOpen, Flag, Printer,
  Plus, CheckCircle2, ShieldCheck, GanttChart, BookKey,
} from 'lucide-react';
import { SidebarNavItem } from './PedoSidebar';
import { UserRole } from '../types';

const ic = (Icon: any, s = 16) => <Icon size={s} />;

// ── 1. ADMIN ──────────────────────────────────────────────────────────
export const ADMIN_NAV: SidebarNavItem[] = [
  { id: 'dashboard',         label: 'Dashboard',           icon: ic(LayoutDashboard) },
  { id: 'students',          label: 'Student Management',  icon: ic(Users) },
  { id: 'teachers',          label: 'Teacher Management',  icon: ic(GraduationCap) },
  { id: 'parents',           label: 'Parent Management',   icon: ic(Contact) },
  { id: 'school-staff',      label: 'Staff Management',    icon: ic(BadgeCheck) },
  { id: 'classes',           label: 'Class Management',    icon: ic(BookOpen) },
  { id: 'subjects',          label: 'Subject Management',  icon: ic(BookMarked) },
  { id: 'attendance',        label: 'Attendance',          icon: ic(CalendarCheck) },
  { id: 'examinations',      label: 'Examinations',        icon: ic(FileSpreadsheet) },
  { id: 'fees',              label: 'Fees & Payments',     icon: ic(Receipt) },
  { id: 'user-management',   label: 'User Management',     icon: ic(UserCog) },
  { id: 'reports',           label: 'Reports',             icon: ic(BarChart3) },
  { id: 'settings',          label: 'School Settings',     icon: ic(Settings) },
  { id: 'my-profile',        label: 'My Profile',          icon: ic(UserCircle) },
];

// ── 2. HEAD & DEPUTY HEAD (shared) ────────────────────────────────────
export const HEAD_NAV: SidebarNavItem[] = [
  { id: 'dashboard',            label: 'Dashboard',           icon: ic(LayoutDashboard) },
  { id: 'students',             label: 'Student Overview',    icon: ic(Users) },
  { id: 'teachers',             label: 'Teacher Overview',    icon: ic(GraduationCap) },
  { id: 'school-staff',         label: 'Staff Overview',      icon: ic(BadgeCheck) },
  { id: 'classes',              label: 'Classes',             icon: ic(BookOpen) },
  { id: 'academic-performance', label: 'Academic Performance',icon: ic(Award) },
  { id: 'attendance',           label: 'Attendance Monitoring',icon: ic(CalendarCheck) },
  { id: 'discipline',           label: 'Discipline Management',icon: ic(ClipboardList) },
  { id: 'timetable',            label: 'Timetable',           icon: ic(Clock) },
  { id: 'activities',           label: 'School Activities',   icon: ic(Activity) },
  { id: 'announcements',        label: 'Announcements',       icon: ic(Megaphone) },
  { id: 'approvals',            label: 'Approvals',           icon: ic(CheckCircle2) },
  { id: 'reports',              label: 'School Reports',      icon: ic(BarChart3) },
  { id: 'my-profile',           label: 'My Profile',          icon: ic(UserCircle) },
];

// ── 3. TEACHER ─────────────────────────────────────────────────────────
export const TEACHER_NAV: SidebarNavItem[] = [
  { id: 'dashboard',            label: 'Dashboard',           icon: ic(LayoutDashboard) },
  { id: 'my-classes',           label: 'My Classes',          icon: ic(BookOpen) },
  { id: 'my-subjects',          label: 'My Subjects',         icon: ic(BookMarked) },
  { id: 'students',             label: 'My Students',         icon: ic(Users) },
  { id: 'attendance',           label: 'Mark Attendance',     icon: ic(CalendarCheck) },
  { id: 'assignments',          label: 'Assignments',         icon: ic(FileText) },
  { id: 'examinations',         label: 'Examinations',        icon: ic(FileSpreadsheet) },
  { id: 'marks',                label: 'Enter Marks',         icon: ic(BookCopy) },
  { id: 'exam-results',         label: 'Student Results',     icon: ic(Award) },
  { id: 'academic-performance', label: 'Academic Performance',icon: ic(BarChart3) },
  { id: 'my-timetable',         label: 'My Timetable',        icon: ic(Clock) },
  { id: 'announcements',        label: 'Announcements',       icon: ic(Megaphone) },
  { id: 'my-profile',           label: 'My Profile',          icon: ic(UserCircle) },
];

// ── 4. BURSAR ──────────────────────────────────────────────────────────
export const BURSAR_NAV: SidebarNavItem[] = [
  { id: 'dashboard',          label: 'Dashboard',            icon: ic(LayoutDashboard) },
  { id: 'fees',               label: 'Student Fees',         icon: ic(Receipt) },
  { id: 'receive-payment',    label: 'Receive Payments',     icon: ic(CreditCard) },
  { id: 'payment-history',    label: 'Payment History',      icon: ic(Clock) },
  { id: 'outstanding',        label: 'Outstanding Balances', icon: ic(AlertTriangle) },
  { id: 'fee-structures',     label: 'Fee Structures',       icon: ic(DollarSign) },
  { id: 'receipts',           label: 'Generate Receipts',    icon: ic(Printer) },
  { id: 'expenses',           label: 'Expenses',             icon: ic(Banknote) },
  { id: 'financial-reports',  label: 'Financial Reports',    icon: ic(BarChart3) },
  { id: 'my-profile',         label: 'My Profile',           icon: ic(UserCircle) },
];

// ── 5. SECRETARY ───────────────────────────────────────────────────────
export const SECRETARY_NAV: SidebarNavItem[] = [
  { id: 'dashboard',           label: 'Dashboard',              icon: ic(LayoutDashboard) },
  { id: 'student-registration',label: 'Student Registration',   icon: ic(UserCheck) },
  { id: 'admissions',          label: 'Admissions',             icon: ic(Plus) },
  { id: 'student-records',     label: 'Student Records',        icon: ic(Users) },
  { id: 'parent-records',      label: 'Parent Records',         icon: ic(Contact) },
  { id: 'teacher-records',     label: 'Staff Records',          icon: ic(GraduationCap) },
  { id: 'correspondence',      label: 'School Correspondence',  icon: ic(MessageSquare) },
  { id: 'documents',           label: 'Document Management',    icon: ic(FolderOpen) },
  { id: 'announcements',       label: 'Announcements',          icon: ic(Megaphone) },
  { id: 'reports',             label: 'Reports',                icon: ic(BarChart3) },
  { id: 'my-profile',          label: 'My Profile',             icon: ic(UserCircle) },
];

// ── 6. LIBRARIAN ───────────────────────────────────────────────────────
export const LIBRARIAN_NAV: SidebarNavItem[] = [
  { id: 'dashboard',       label: 'Dashboard',             icon: ic(LayoutDashboard) },
  { id: 'books',           label: 'Books Management',      icon: ic(BookOpen) },
  { id: 'book-categories', label: 'Book Categories',       icon: ic(BookMarked) },
  { id: 'add-book',        label: 'Add New Books',         icon: ic(Plus) },
  { id: 'issue-books',     label: 'Issue Books',           icon: ic(BookCopy) },
  { id: 'return-books',    label: 'Return Books',          icon: ic(RotateCcw) },
  { id: 'overdue-books',   label: 'Overdue Books',         icon: ic(AlertTriangle) },
  { id: 'borrow-records',  label: 'Borrowing Records',     icon: ic(FileText) },
  { id: 'borrow-history',  label: 'Student Borrowing History', icon: ic(Clock) },
  { id: 'library-reports', label: 'Library Reports',       icon: ic(BarChart3) },
  { id: 'my-profile',      label: 'My Profile',            icon: ic(UserCircle) },
];

// ── 7. HOSTEL MANAGER ─────────────────────────────────────────────────
export const HOSTEL_NAV: SidebarNavItem[] = [
  { id: 'dashboard',         label: 'Dashboard',             icon: ic(LayoutDashboard) },
  { id: 'hostel-overview',   label: 'Hostel Overview',       icon: ic(Building2) },
  { id: 'manage-hostels',    label: 'Manage Hostels',        icon: ic(Home) },
  { id: 'manage-rooms',      label: 'Manage Rooms',          icon: ic(DoorOpen) },
  { id: 'accommodation',     label: 'Student Accommodation', icon: ic(Users) },
  { id: 'room-allocation',   label: 'Room Allocation',       icon: ic(GanttChart) },
  { id: 'hostel-attendance', label: 'Hostel Attendance',     icon: ic(CalendarCheck) },
  { id: 'visitor-records',   label: 'Visitor Records',       icon: ic(Contact) },
  { id: 'complaints',        label: 'Student Complaints',    icon: ic(Flag) },
  { id: 'hostel-reports',    label: 'Hostel Reports',        icon: ic(BarChart3) },
  { id: 'my-profile',        label: 'My Profile',            icon: ic(UserCircle) },
];

// ── 8. STUDENT ────────────────────────────────────────────────────────
export const STUDENT_NAV: SidebarNavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',           icon: ic(LayoutDashboard) },
  { id: 'profile',       label: 'My Profile',          icon: ic(UserCircle) },
  { id: 'subjects',      label: 'My Subjects',         icon: ic(BookMarked) },
  { id: 'timetable',     label: 'My Timetable',        icon: ic(Clock) },
  { id: 'attendance',    label: 'My Attendance',       icon: ic(CalendarCheck) },
  { id: 'assignments',   label: 'My Assignments',      icon: ic(FileText) },
  { id: 'results',       label: 'Examination Results', icon: ic(FileSpreadsheet) },
  { id: 'library',       label: 'Learning Resources',  icon: ic(BookOpen) },
  { id: 'materials',     label: 'Library',             icon: ic(Library) },
  { id: 'announcements', label: 'Announcements',       icon: ic(Megaphone) },
];

// ── 9. PARENT ─────────────────────────────────────────────────────────
export const PARENT_NAV: SidebarNavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',            icon: ic(LayoutDashboard) },
  { id: 'children',      label: 'My Children',          icon: ic(Users) },
  { id: 'performance',   label: 'Academic Performance', icon: ic(Award) },
  { id: 'attendance',    label: 'Attendance Records',   icon: ic(CalendarCheck) },
  { id: 'homework',      label: 'Assignments',          icon: ic(FileText) },
  { id: 'results',       label: 'Examination Results',  icon: ic(FileSpreadsheet) },
  { id: 'fees',          label: 'School Fees',          icon: ic(Receipt) },
  { id: 'payment-history',label: 'Payment History',     icon: ic(Clock) },
  { id: 'timetable',     label: 'Timetable',            icon: ic(GanttChart) },
  { id: 'messages',      label: 'Teacher Communication',icon: ic(MessageSquare) },
  { id: 'announcements', label: 'Announcements',        icon: ic(Megaphone) },
  { id: 'settings',      label: 'My Profile',           icon: ic(UserCircle) },
];

// ── Role → nav mapping ─────────────────────────────────────────────────
export function getNavForRole(role: UserRole, subRole?: string): SidebarNavItem[] {
  if (role === 'ADMIN')                          return ADMIN_NAV;
  if (role === 'HEAD' || role === 'DEPUTY_HEAD') return HEAD_NAV;
  if (role === 'TEACHER')                        return TEACHER_NAV;
  if (role === 'STUDENT')                        return STUDENT_NAV;
  if (role === 'PARENT')                         return PARENT_NAV;
  if (role === 'STAFF') {
    switch (subRole) {
      case 'BURSAR':    return BURSAR_NAV;
      case 'SECRETARY': return SECRETARY_NAV;
      case 'LIBRARIAN': return LIBRARIAN_NAV;
      case 'HOSTEL':    return HOSTEL_NAV;
      default:          return SECRETARY_NAV;
    }
  }
  return ADMIN_NAV;
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN:'School Admin', HEAD:'Headmaster', DEPUTY_HEAD:'Deputy Headmaster',
  TEACHER:'Teacher', STUDENT:'Student', PARENT:'Parent',
  BURSAR:'Bursar / Accounts', SECRETARY:'Secretary',
  LIBRARIAN:'Librarian', HOSTEL:'Hostel Manager', STAFF:'School Staff',
};

export function getRoleLabel(role: string, subRole?: string): string {
  if (role === 'STAFF' && subRole) return ROLE_LABELS[subRole] ?? 'School Staff';
  return ROLE_LABELS[role] ?? role;
}
