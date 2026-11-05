using Microsoft.EntityFrameworkCore;
using SchoolManagement.Api.Data;
using SchoolManagement.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<SchoolDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    builder.Services.AddDbContext<SchoolDbContext>(options =>
        options.UseInMemoryDatabase("SchoolManagementDb"));
}

// Add CORS for React Vite client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SchoolDbContext>();
    if (string.IsNullOrEmpty(connectionString))
    {
        context.Database.EnsureCreated();
    }
    DbInitializer.Initialize(context);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowClient");

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Dashboard metrics
app.MapGet("/api/dashboard/metrics", async (SchoolDbContext db) =>
{
    var totalStudents = await db.Students.CountAsync();
    var totalTeachers = await db.Teachers.CountAsync();
    var totalClasses = await db.Classrooms.CountAsync();
    var totalInvoiced = await db.FeeInvoices.SumAsync(i => i.TotalDue);
    var totalCollected = await db.FeeInvoices.SumAsync(i => i.AmountPaid);

    return Results.Ok(new
    {
        totalStudents,
        totalTeachers,
        totalClasses,
        attendanceTodayPercent = 94.2,
        totalFeesExpected = totalInvoiced,
        totalFeesCollected = totalCollected,
        feeCollectionRate = totalInvoiced > 0 ? (int)Math.Round((totalCollected / totalInvoiced) * 100) : 0
    });
});

// Students
app.MapGet("/api/students", async (string? classId, string? search, SchoolDbContext db) =>
{
    var query = db.Students.AsQueryable();
    if (!string.IsNullOrEmpty(classId) && classId != "ALL")
    {
        query = query.Where(s => s.ClassId == classId);
    }
    if (!string.IsNullOrEmpty(search))
    {
        var sLower = search.ToLower();
        query = query.Where(s => s.FirstName.ToLower().Contains(sLower) ||
                                 s.LastName.ToLower().Contains(sLower) ||
                                 s.AdmissionNumber.ToLower().Contains(sLower));
    }
    return Results.Ok(await query.ToListAsync());
});

app.MapGet("/api/students/{id}", async (string id, SchoolDbContext db) =>
{
    var student = await db.Students.FindAsync(id);
    return student is not null ? Results.Ok(student) : Results.NotFound();
});

app.MapPost("/api/students", async (Student student, SchoolDbContext db) =>
{
    var count = await db.Students.CountAsync();
    student.Id = $"std-{Guid.NewGuid():N}";
    student.AdmissionNumber = $"SMS-2026-{(count + 1):D3}";
    db.Students.Add(student);

    // Auto-create initial term invoice
    db.FeeInvoices.Add(new FeeInvoice
    {
        Id = $"inv-{Guid.NewGuid():N}",
        StudentId = student.Id,
        StudentName = $"{student.FirstName} {student.LastName}",
        AdmissionNumber = student.AdmissionNumber,
        ClassName = student.ClassName,
        Term = "Term 3 2026",
        TotalDue = 450,
        Balance = 450,
        Status = "Unpaid"
    });

    await db.SaveChangesAsync();
    return Results.Created($"/api/students/{student.Id}", student);
});

app.MapPut("/api/students/{id}", async (string id, Student input, SchoolDbContext db) =>
{
    var student = await db.Students.FindAsync(id);
    if (student is null) return Results.NotFound();

    student.FirstName = input.FirstName;
    student.LastName = input.LastName;
    student.Gender = input.Gender;
    student.DateOfBirth = input.DateOfBirth;
    student.ClassId = input.ClassId;
    student.ClassName = input.ClassName;
    student.GuardianName = input.GuardianName;
    student.GuardianPhone = input.GuardianPhone;
    student.GuardianEmail = input.GuardianEmail;
    student.Address = input.Address;
    student.Status = input.Status;

    await db.SaveChangesAsync();
    return Results.Ok(student);
});

app.MapDelete("/api/students/{id}", async (string id, SchoolDbContext db) =>
{
    var student = await db.Students.FindAsync(id);
    if (student is null) return Results.NotFound();

    db.Students.Remove(student);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Teachers
app.MapGet("/api/teachers", async (SchoolDbContext db) =>
    Results.Ok(await db.Teachers.ToListAsync()));

app.MapPost("/api/teachers", async (Teacher teacher, SchoolDbContext db) =>
{
    var count = await db.Teachers.CountAsync();
    teacher.Id = $"tch-{Guid.NewGuid():N}";
    teacher.StaffNumber = $"TCH-2026-{(count + 1):D3}";
    db.Teachers.Add(teacher);
    await db.SaveChangesAsync();
    return Results.Created($"/api/teachers/{teacher.Id}", teacher);
});

// Classes & Subjects
app.MapGet("/api/classes", async (SchoolDbContext db) =>
    Results.Ok(await db.Classrooms.ToListAsync()));

app.MapGet("/api/subjects", async (SchoolDbContext db) =>
    Results.Ok(await db.Subjects.ToListAsync()));

// Attendance
app.MapGet("/api/attendance", async (string date, string? classId, SchoolDbContext db) =>
{
    var query = db.AttendanceRecords.Where(a => a.Date == date);
    if (!string.IsNullOrEmpty(classId))
    {
        query = query.Where(a => a.ClassId == classId);
    }
    return Results.Ok(await query.ToListAsync());
});

app.MapPost("/api/attendance/batch", async (List<AttendanceRecord> records, SchoolDbContext db) =>
{
    foreach (var r in records)
    {
        var existing = await db.AttendanceRecords.FirstOrDefaultAsync(
            a => a.StudentId == r.StudentId && a.Date == r.Date);
        if (existing is not null)
        {
            existing.Status = r.Status;
            existing.Remarks = r.Remarks;
        }
        else
        {
            r.Id = Guid.NewGuid().ToString();
            db.AttendanceRecords.Add(r);
        }
    }
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Attendance recorded successfully" });
});

// Marks & Grading
app.MapGet("/api/marks", async (string? classId, string? subjectId, string? term, SchoolDbContext db) =>
{
    var query = db.AcademicMarks.AsQueryable();
    if (!string.IsNullOrEmpty(classId)) query = query.Where(m => m.ClassId == classId);
    if (!string.IsNullOrEmpty(subjectId)) query = query.Where(m => m.SubjectId == subjectId);
    if (!string.IsNullOrEmpty(term)) query = query.Where(m => m.Term == term);
    return Results.Ok(await query.ToListAsync());
});

app.MapPost("/api/marks", async (AcademicMark mark, SchoolDbContext db) =>
{
    var existing = await db.AcademicMarks.FirstOrDefaultAsync(
        m => m.StudentId == mark.StudentId && m.SubjectId == mark.SubjectId && m.Term == mark.Term);

    if (existing is not null)
    {
        existing.CourseworkMark = mark.CourseworkMark;
        existing.MidTermMark = mark.MidTermMark;
        existing.FinalExamMark = mark.FinalExamMark;
        existing.TotalScore = mark.TotalScore;
        existing.Grade = mark.Grade;
        existing.Remarks = mark.Remarks;
    }
    else
    {
        mark.Id = Guid.NewGuid().ToString();
        db.AcademicMarks.Add(mark);
    }
    await db.SaveChangesAsync();
    return Results.Ok(mark);
});

// Fees & Payments
app.MapGet("/api/fees/invoices", async (SchoolDbContext db) =>
    Results.Ok(await db.FeeInvoices.ToListAsync()));

app.MapGet("/api/fees/payments", async (SchoolDbContext db) =>
    Results.Ok(await db.FeePayments.OrderByDescending(p => p.PaymentDate).ToListAsync()));

app.MapPost("/api/fees/pay", async (FeePayment request, SchoolDbContext db) =>
{
    var invoice = await db.FeeInvoices.FindAsync(request.InvoiceId);
    if (invoice is null) return Results.NotFound("Invoice not found");

    request.Id = $"pay-{Guid.NewGuid():N}";
    request.ReceiptNumber = $"RCT-{DateTime.UtcNow.Year}-{Random.Shared.Next(1000, 9999)}";
    request.PaymentDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
    request.StudentId = invoice.StudentId;
    request.StudentName = invoice.StudentName;
    request.Currency = invoice.Currency;

    invoice.AmountPaid += request.Amount;
    invoice.Balance = Math.Max(0, invoice.TotalDue - invoice.AmountPaid);
    invoice.Status = invoice.Balance == 0 ? "Paid" : "Partial";

    db.FeePayments.Add(request);
    await db.SaveChangesAsync();
    return Results.Ok(request);
});

// Announcements
app.MapGet("/api/announcements", async (SchoolDbContext db) =>
    Results.Ok(await db.Announcements.OrderByDescending(a => a.IsPinned).ThenByDescending(a => a.PublishedDate).ToListAsync()));

app.MapPost("/api/announcements", async (Announcement announcement, SchoolDbContext db) =>
{
    announcement.Id = $"anc-{Guid.NewGuid():N}";
    announcement.PublishedDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
    db.Announcements.Add(announcement);
    await db.SaveChangesAsync();
    return Results.Created($"/api/announcements/{announcement.Id}", announcement);
});

app.Run();
