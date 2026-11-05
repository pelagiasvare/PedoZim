using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Api.Models;

public enum UserRole
{
    Admin,
    Teacher,
    Student,
    Staff
}

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string Name { get; set; } = string.Empty;
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Admin;
    public string? AvatarUrl { get; set; }
    public string? ReferenceId { get; set; }
}

public class Student
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string AdmissionNumber { get; set; } = string.Empty;
    [Required]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = "Male";
    public string DateOfBirth { get; set; } = "2012-01-01";
    public string ClassId { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string GuardianName { get; set; } = string.Empty;
    public string GuardianPhone { get; set; } = string.Empty;
    public string GuardianEmail { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string EnrollmentDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string Status { get; set; } = "Active";
}

public class Teacher
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string StaffNumber { get; set; } = string.Empty;
    [Required]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = "Male";
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Qualification { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public List<string> AssignedClasses { get; set; } = new();
    public List<string> AssignedSubjects { get; set; } = new();
}

public class Classroom
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public int Capacity { get; set; } = 35;
    public string ClassTeacherId { get; set; } = string.Empty;
    public string ClassTeacherName { get; set; } = string.Empty;
    public string RoomNumber { get; set; } = string.Empty;
}

public class Subject
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string Code { get; set; } = string.Empty;
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "Core";
    public string Level { get; set; } = "Secondary";
    public string? TeacherId { get; set; }
    public string? TeacherName { get; set; }
}

public class AttendanceRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string ClassId { get; set; } = string.Empty;
    [Required]
    public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string Status { get; set; } = "present"; // present, absent, late, excused
    public string? Remarks { get; set; }
    public string RecordedBy { get; set; } = string.Empty;
}

public class AcademicMark
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string ClassId { get; set; } = string.Empty;
    public string SubjectId { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string Term { get; set; } = "Term 3";
    public int Year { get; set; } = 2026;
    public int CourseworkMark { get; set; }
    public int MidTermMark { get; set; }
    public int FinalExamMark { get; set; }
    public int TotalScore { get; set; }
    public string Grade { get; set; } = "A";
    public string Remarks { get; set; } = string.Empty;
}

public class FeeInvoice
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string AdmissionNumber { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string Term { get; set; } = "Term 3 2026";
    public int Year { get; set; } = 2026;
    public decimal TuitionFee { get; set; } = 350;
    public decimal LevyFee { get; set; } = 80;
    public decimal OtherFees { get; set; } = 20;
    public decimal TotalDue { get; set; } = 450;
    public decimal AmountPaid { get; set; } = 0;
    public decimal Balance { get; set; } = 450;
    public string Currency { get; set; } = "USD";
    public string DueDate { get; set; } = "2026-10-31";
    public string Status { get; set; } = "Unpaid"; // Paid, Partial, Overdue, Unpaid
}

public class FeePayment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string InvoiceId { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string ReceiptNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string PaymentDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string PaymentMethod { get; set; } = "EcoCash";
    public string RecordedBy { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class Announcement
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public string TargetAudience { get; set; } = "All";
    public string PublishedDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string Author { get; set; } = "Pelagia Svare";
    public bool IsPinned { get; set; }
}
