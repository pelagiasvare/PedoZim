using SchoolManagement.Api.Models;

namespace SchoolManagement.Api.Data;

public static class DbInitializer
{
    public static void Initialize(SchoolDbContext context)
    {
        if (context.Students.Any())
        {
            return; // DB already seeded
        }

        var teachers = new List<Teacher>
        {
            new Teacher
            {
                Id = "tch-1",
                StaffNumber = "TCH-2021-001",
                FirstName = "Tinashe",
                LastName = "Moyo",
                Gender = "Male",
                Email = "t.moyo@school.ac.zw",
                Phone = "+263 77 212 3456",
                Qualification = "B.Sc Education (Mathematics & Physics)",
                Specialization = "Pure Mathematics",
                AssignedClasses = new() { "Form 1A", "Form 3 Science" },
                AssignedSubjects = new() { "Mathematics" },
                Status = "Active"
            },
            new Teacher
            {
                Id = "tch-2",
                StaffNumber = "TCH-2022-014",
                FirstName = "Rudo",
                LastName = "Chidzero",
                Gender = "Female",
                Email = "r.chidzero@school.ac.zw",
                Phone = "+263 71 398 7654",
                Qualification = "B.A English & Linguistics",
                Specialization = "English Literature & Language",
                AssignedClasses = new() { "Form 1A", "Form 2A", "Form 4 Arts" },
                AssignedSubjects = new() { "English Language", "Literature in English" },
                Status = "Active"
            }
        };
        context.Teachers.AddRange(teachers);

        var classrooms = new List<Classroom>
        {
            new Classroom
            {
                Id = "cls-1",
                Name = "Form 1A",
                Level = "Form 1",
                Capacity = 35,
                ClassTeacherId = "tch-1",
                ClassTeacherName = "Mr. Tinashe Moyo",
                RoomNumber = "Block A, Room 101"
            },
            new Classroom
            {
                Id = "cls-2",
                Name = "Form 1B",
                Level = "Form 1",
                Capacity = 35,
                ClassTeacherId = "tch-2",
                ClassTeacherName = "Mrs. Rudo Chidzero",
                RoomNumber = "Block A, Room 102"
            }
        };
        context.Classrooms.AddRange(classrooms);

        var subjects = new List<Subject>
        {
            new Subject { Id = "sub-1", Code = "MTH-101", Name = "Mathematics", Category = "Core", Level = "Secondary", TeacherId = "tch-1", TeacherName = "Mr. Tinashe Moyo" },
            new Subject { Id = "sub-2", Code = "ENG-101", Name = "English Language", Category = "Core", Level = "Secondary", TeacherId = "tch-2", TeacherName = "Mrs. Rudo Chidzero" },
            new Subject { Id = "sub-3", Code = "SCI-101", Name = "Integrated Science", Category = "Core", Level = "Secondary" }
        };
        context.Subjects.AddRange(subjects);

        var students = new List<Student>
        {
            new Student
            {
                Id = "std-1",
                AdmissionNumber = "SMS-2026-001",
                FirstName = "Tatenda",
                LastName = "Mutasa",
                Gender = "Male",
                DateOfBirth = "2012-05-14",
                ClassId = "cls-1",
                ClassName = "Form 1A",
                GuardianName = "George Mutasa",
                GuardianPhone = "+263 77 111 2233",
                GuardianEmail = "gmutasa@gmail.com",
                Address = "14 Harare Drive, Borrowdale, Harare",
                EnrollmentDate = "2026-01-10",
                Status = "Active"
            },
            new Student
            {
                Id = "std-2",
                AdmissionNumber = "SMS-2026-002",
                FirstName = "Anesu",
                LastName = "Gumbo",
                Gender = "Female",
                DateOfBirth = "2012-08-22",
                ClassId = "cls-1",
                ClassName = "Form 1A",
                GuardianName = "Tendai Gumbo",
                GuardianPhone = "+263 71 222 3344",
                GuardianEmail = "tgumbo@yahoo.com",
                Address = "45 Samora Machel Ave, Harare",
                EnrollmentDate = "2026-01-10",
                Status = "Active"
            }
        };
        context.Students.AddRange(students);

        var invoices = new List<FeeInvoice>
        {
            new FeeInvoice
            {
                Id = "inv-101",
                StudentId = "std-1",
                StudentName = "Tatenda Mutasa",
                AdmissionNumber = "SMS-2026-001",
                ClassName = "Form 1A",
                Term = "Term 3 2026",
                Year = 2026,
                TuitionFee = 350,
                LevyFee = 80,
                OtherFees = 20,
                TotalDue = 450,
                AmountPaid = 450,
                Balance = 0,
                Currency = "USD",
                DueDate = "2026-10-31",
                Status = "Paid"
            },
            new FeeInvoice
            {
                Id = "inv-102",
                StudentId = "std-2",
                StudentName = "Anesu Gumbo",
                AdmissionNumber = "SMS-2026-002",
                ClassName = "Form 1A",
                Term = "Term 3 2026",
                Year = 2026,
                TuitionFee = 350,
                LevyFee = 80,
                OtherFees = 20,
                TotalDue = 450,
                AmountPaid = 250,
                Balance = 200,
                Currency = "USD",
                DueDate = "2026-10-31",
                Status = "Partial"
            }
        };
        context.FeeInvoices.AddRange(invoices);

        var announcements = new List<Announcement>
        {
            new Announcement
            {
                Id = "anc-1",
                Title = "Term 3 National & School Examinations Schedule",
                Content = "All Form 1 to Form 4 students and teaching staff should note that end-of-year final examinations commence on 10 November 2026.",
                Category = "Academic",
                TargetAudience = "All",
                PublishedDate = "2026-10-25",
                Author = "Pelagia Svare (Head Admin)",
                IsPinned = true
            }
        };
        context.Announcements.AddRange(announcements);

        context.SaveChanges();
    }
}
