<?php

namespace Database\Seeders;

use App\Models\AcademicClass;
use App\Models\Attendance;
use App\Models\ClassSubject;
use App\Models\Exam;
use App\Models\ExamMark;
use App\Models\ExamSchedule;
use App\Models\FeeInvoice;
use App\Models\FeeType;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\StudentSubject;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherAssignment;
use App\Models\Tenant;
use App\Models\TimeSlot;
use App\Models\User;
use App\Services\GradingService;
use App\Services\ReceiptNumberGenerator;
use App\Services\StudentIdGenerator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::firstOrCreate(
            ['slug' => 'demo-coaching'],
            [
                'name' => 'Apex Coaching Academy',
                'email' => 'info@apexcoaching.test',
                'phone' => '01711223344',
                'address' => 'House 42, Road 11, Dhanmondi, Dhaka',
                'is_active' => true,
            ]
        );

        $tenantId = $tenant->id;
        app()->instance('current_tenant_id', $tenantId);

        // 1. Tenant Admin
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'name' => 'Demo Coaching Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'tenant_id' => $tenantId,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Classes (6, 7, 8, 9, 10, HSC)
        $class6 = AcademicClass::firstOrCreate(
            ['tenant_id' => $tenantId, 'name' => 'Class 6', 'section' => 'Section A'],
            ['sort_order' => 1, 'is_active' => true]
        );

        $class7 = AcademicClass::firstOrCreate(
            ['tenant_id' => $tenantId, 'name' => 'Class 7', 'section' => 'Section A'],
            ['sort_order' => 2, 'is_active' => true]
        );

        $class8 = AcademicClass::firstOrCreate(
            ['tenant_id' => $tenantId, 'name' => 'Class 8', 'section' => 'Section A'],
            ['sort_order' => 3, 'is_active' => true]
        );

        $class9 = AcademicClass::firstOrCreate(
            ['tenant_id' => $tenantId, 'name' => 'Class 9', 'section' => 'Science'],
            ['sort_order' => 4, 'is_active' => true]
        );

        $class10 = AcademicClass::firstOrCreate(
            ['tenant_id' => $tenantId, 'name' => 'Class 10', 'section' => 'Science'],
            ['sort_order' => 5, 'is_active' => true]
        );

        $hsc = AcademicClass::firstOrCreate(
            ['tenant_id' => $tenantId, 'name' => 'HSC Batch 2026', 'section' => 'Special Batch'],
            ['sort_order' => 6, 'is_active' => true]
        );

        // 3. Subjects
        $physics = Subject::firstOrCreate(['tenant_id' => $tenantId, 'name' => 'Physics'], ['code' => 'PHY-101', 'is_active' => true]);
        $math = Subject::firstOrCreate(['tenant_id' => $tenantId, 'name' => 'Mathematics'], ['code' => 'MATH-101', 'is_active' => true]);
        $higherMath = Subject::firstOrCreate(['tenant_id' => $tenantId, 'name' => 'Higher Mathematics'], ['code' => 'HM-201', 'is_active' => true]);
        $chemistry = Subject::firstOrCreate(['tenant_id' => $tenantId, 'name' => 'Chemistry'], ['code' => 'CHEM-102', 'is_active' => true]);
        $english = Subject::firstOrCreate(['tenant_id' => $tenantId, 'name' => 'English'], ['code' => 'ENG-101', 'is_active' => true]);
        $science = Subject::firstOrCreate(['tenant_id' => $tenantId, 'name' => 'General Science'], ['code' => 'SCI-101', 'is_active' => true]);
        $ict = Subject::firstOrCreate(['tenant_id' => $tenantId, 'name' => 'ICT & Computer'], ['code' => 'ICT-101', 'is_active' => true]);

        // 4. Class-Subject Mappings
        // Class 6 & 7 & 8
        $cs6Math = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class6->id, 'subject_id' => $math->id]);
        $cs6Eng = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class6->id, 'subject_id' => $english->id]);
        $cs6Sci = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class6->id, 'subject_id' => $science->id]);

        $cs7Math = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class7->id, 'subject_id' => $math->id]);
        $cs7Eng = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class7->id, 'subject_id' => $english->id]);
        $cs7Sci = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class7->id, 'subject_id' => $science->id]);

        $cs8Math = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class8->id, 'subject_id' => $math->id]);
        $cs8Eng = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class8->id, 'subject_id' => $english->id]);
        $cs8Sci = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class8->id, 'subject_id' => $science->id]);
        $cs8Ict = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class8->id, 'subject_id' => $ict->id]);

        // Class 10
        $cs10Physics = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class10->id, 'subject_id' => $physics->id]);
        $cs10HigherMath = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class10->id, 'subject_id' => $higherMath->id]);
        $cs10Chem = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class10->id, 'subject_id' => $chemistry->id]);
        $cs10Eng = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $class10->id, 'subject_id' => $english->id]);

        // HSC
        $csHscPhysics = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $hsc->id, 'subject_id' => $physics->id]);
        $csHscMath = ClassSubject::firstOrCreate(['tenant_id' => $tenantId, 'academic_class_id' => $hsc->id, 'subject_id' => $higherMath->id]);

        // 5. Teachers
        $teacherUser1 = User::firstOrCreate(
            ['email' => 'teacher@demo.com'],
            [
                'name' => 'Prof. Hasan Mahmud',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'tenant_id' => $tenantId,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $teacher1 = Teacher::firstOrCreate(
            ['user_id' => $teacherUser1->id],
            ['tenant_id' => $tenantId, 'phone' => '01711990077', 'designation' => 'Senior Lecturer in Physics', 'is_active' => true]
        );

        $teacherUser2 = User::firstOrCreate(
            ['email' => 'math_teacher@demo.com'],
            [
                'name' => 'Nusrat Jahan',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'tenant_id' => $tenantId,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $teacher2 = Teacher::firstOrCreate(
            ['user_id' => $teacherUser2->id],
            ['tenant_id' => $tenantId, 'phone' => '01811887766', 'designation' => 'Mathematics Faculty', 'is_active' => true]
        );

        $teacherUser3 = User::firstOrCreate(
            ['email' => 'english_teacher@demo.com'],
            [
                'name' => 'Tariqul Islam',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'tenant_id' => $tenantId,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $teacher3 = Teacher::firstOrCreate(
            ['user_id' => $teacherUser3->id],
            ['tenant_id' => $tenantId, 'phone' => '01911334455', 'designation' => 'English & Literature Faculty', 'is_active' => true]
        );

        // Teacher assignments
        TeacherAssignment::firstOrCreate(['tenant_id' => $tenantId, 'teacher_id' => $teacher1->id, 'class_subject_id' => $cs10Physics->id]);
        TeacherAssignment::firstOrCreate(['tenant_id' => $tenantId, 'teacher_id' => $teacher1->id, 'class_subject_id' => $csHscPhysics->id]);
        TeacherAssignment::firstOrCreate(['tenant_id' => $tenantId, 'teacher_id' => $teacher2->id, 'class_subject_id' => $cs10HigherMath->id]);
        TeacherAssignment::firstOrCreate(['tenant_id' => $tenantId, 'teacher_id' => $teacher2->id, 'class_subject_id' => $cs8Math->id]);
        TeacherAssignment::firstOrCreate(['tenant_id' => $tenantId, 'teacher_id' => $teacher3->id, 'class_subject_id' => $cs10Eng->id]);
        TeacherAssignment::firstOrCreate(['tenant_id' => $tenantId, 'teacher_id' => $teacher3->id, 'class_subject_id' => $cs8Eng->id]);

        // 6. Time Slots & Schedules
        $slot1 = TimeSlot::firstOrCreate(
            ['tenant_id' => $tenantId, 'start_time' => '15:00:00', 'end_time' => '16:00:00'],
            ['label' => '3:00 PM - 4:00 PM', 'is_active' => true]
        );
        $slot2 = TimeSlot::firstOrCreate(
            ['tenant_id' => $tenantId, 'start_time' => '16:00:00', 'end_time' => '17:00:00'],
            ['label' => '4:00 PM - 5:00 PM', 'is_active' => true]
        );

        $sch1 = Schedule::firstOrCreate(
            ['tenant_id' => $tenantId, 'class_subject_id' => $cs10Physics->id, 'day_of_week' => 0, 'time_slot_id' => $slot1->id],
            ['teacher_id' => $teacher1->id, 'room' => 'Room 201', 'is_active' => true]
        );
        $sch2 = Schedule::firstOrCreate(
            ['tenant_id' => $tenantId, 'class_subject_id' => $cs10HigherMath->id, 'day_of_week' => 0, 'time_slot_id' => $slot2->id],
            ['teacher_id' => $teacher2->id, 'room' => 'Room 202', 'is_active' => true]
        );

        // 7. Students
        // Class 10 Student 1
        $studentUser1 = User::firstOrCreate(
            ['email' => 'student@demo.com'],
            [
                'name' => 'Tanvir Ahmed',
                'password' => Hash::make('password'),
                'role' => 'student',
                'tenant_id' => $tenantId,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $student1 = Student::firstOrCreate(
            ['user_id' => $studentUser1->id],
            [
                'tenant_id' => $tenantId,
                'student_id' => StudentIdGenerator::generate($tenantId),
                'academic_class_id' => $class10->id,
                'phone' => '01711000110',
                'monthly_fee' => 3000.00,
                'admission_date' => now()->subMonths(3),
                'guardian_name' => 'Rafiqul Ahmed',
                'guardian_phone' => '01711000111',
                'is_active' => true,
            ]
        );
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student1->id, 'class_subject_id' => $cs10Physics->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student1->id, 'class_subject_id' => $cs10HigherMath->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student1->id, 'class_subject_id' => $cs10Chem->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student1->id, 'class_subject_id' => $cs10Eng->id]);

        // Class 10 Student 2
        $studentUser2 = User::firstOrCreate(
            ['email' => 'student2@demo.com'],
            [
                'name' => 'Sadia Rahman',
                'password' => Hash::make('password'),
                'role' => 'student',
                'tenant_id' => $tenantId,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $student2 = Student::firstOrCreate(
            ['user_id' => $studentUser2->id],
            [
                'tenant_id' => $tenantId,
                'student_id' => StudentIdGenerator::generate($tenantId),
                'academic_class_id' => $class10->id,
                'phone' => '01711000220',
                'monthly_fee' => 3000.00,
                'admission_date' => now()->subMonths(2),
                'guardian_name' => 'Mahbubur Rahman',
                'guardian_phone' => '01711000222',
                'is_active' => true,
            ]
        );
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student2->id, 'class_subject_id' => $cs10Physics->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student2->id, 'class_subject_id' => $cs10HigherMath->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student2->id, 'class_subject_id' => $cs10Chem->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student2->id, 'class_subject_id' => $cs10Eng->id]);

        // Class 8 Student 3
        $studentUser3 = User::firstOrCreate(
            ['email' => 'student_class8@demo.com'],
            [
                'name' => 'Arefin Shuvo',
                'password' => Hash::make('password'),
                'role' => 'student',
                'tenant_id' => $tenantId,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $student3 = Student::firstOrCreate(
            ['user_id' => $studentUser3->id],
            [
                'tenant_id' => $tenantId,
                'student_id' => StudentIdGenerator::generate($tenantId),
                'academic_class_id' => $class8->id,
                'phone' => '01811556670',
                'monthly_fee' => 2500.00,
                'admission_date' => now()->subMonths(2),
                'guardian_name' => 'Khurram Shuvo',
                'guardian_phone' => '01811556677',
                'is_active' => true,
            ]
        );
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student3->id, 'class_subject_id' => $cs8Math->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student3->id, 'class_subject_id' => $cs8Eng->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student3->id, 'class_subject_id' => $cs8Sci->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student3->id, 'class_subject_id' => $cs8Ict->id]);

        // Class 6 Student 4
        $studentUser4 = User::firstOrCreate(
            ['email' => 'student_class6@demo.com'],
            [
                'name' => 'Maliha Tabassum',
                'password' => Hash::make('password'),
                'role' => 'student',
                'tenant_id' => $tenantId,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $student4 = Student::firstOrCreate(
            ['user_id' => $studentUser4->id],
            [
                'tenant_id' => $tenantId,
                'student_id' => StudentIdGenerator::generate($tenantId),
                'academic_class_id' => $class6->id,
                'phone' => '01911998870',
                'monthly_fee' => 2000.00,
                'admission_date' => now()->subMonths(1),
                'guardian_name' => 'Enamul Haque',
                'guardian_phone' => '01911998877',
                'is_active' => true,
            ]
        );
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student4->id, 'class_subject_id' => $cs6Math->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student4->id, 'class_subject_id' => $cs6Eng->id]);
        StudentSubject::firstOrCreate(['tenant_id' => $tenantId, 'student_id' => $student4->id, 'class_subject_id' => $cs6Sci->id]);

        // 8. Attendance Records
        for ($i = 0; $i < 7; $i++) {
            $date = now()->subDays($i)->format('Y-m-d');
            Attendance::firstOrCreate(
                ['tenant_id' => $tenantId, 'schedule_id' => $sch1->id, 'student_id' => $student1->id, 'attendance_date' => $date],
                ['status' => $i === 2 ? 'absent' : 'present', 'marked_by' => $teacher1->id]
            );
            Attendance::firstOrCreate(
                ['tenant_id' => $tenantId, 'schedule_id' => $sch1->id, 'student_id' => $student2->id, 'attendance_date' => $date],
                ['status' => 'present', 'marked_by' => $teacher1->id]
            );
        }

        // 9. Fee Types & Invoices
        $tuitionFeeType = FeeType::firstOrCreate(
            ['tenant_id' => $tenantId, 'name' => 'Monthly Tuition Fee'],
            ['code' => 'MONTHLY_TUITION', 'default_amount' => 3000.00, 'is_active' => true]
        );

        $invoice1 = FeeInvoice::firstOrCreate(
            ['tenant_id' => $tenantId, 'student_id' => $student1->id, 'month' => '2026-08'],
            [
                'fee_type_id' => $tuitionFeeType->id,
                'title' => 'Monthly Tuition Fee - August 2026',
                'amount' => 3000.00,
                'paid_amount' => 3000.00,
                'due_amount' => 0.00,
                'due_date' => now()->addDays(10),
                'issue_date' => now()->subDays(10),
                'status' => 'paid',
            ]
        );

        $payment1 = Payment::firstOrCreate(
            ['tenant_id' => $tenantId, 'fee_invoice_id' => $invoice1->id],
            [
                'student_id' => $student1->id,
                'amount' => 3000.00,
                'payment_date' => now()->subDays(5),
                'payment_method' => 'cash',
                'received_by' => $adminUser->id,
            ]
        );

        Receipt::firstOrCreate(
            ['tenant_id' => $tenantId, 'receipt_number' => 'REC-2026-00001'],
            [
                'payment_id' => $payment1->id,
            ]
        );

        // 10. Sample Exams & Results
        // Exam 1: Class 10 Model Test 1
        $exam1 = Exam::firstOrCreate(
            ['tenant_id' => $tenantId, 'academic_class_id' => $class10->id, 'title' => 'SSC Model Test 1 (Class 10)'],
            [
                'exam_type' => 'model_test',
                'start_date' => now()->subDays(10)->format('Y-m-d'),
                'end_date' => now()->subDays(5)->format('Y-m-d'),
                'is_published' => true,
                'description' => 'Comprehensive Model Test covering full syllabus.',
            ]
        );

        $exSchedPhysics = ExamSchedule::firstOrCreate(
            ['exam_id' => $exam1->id, 'class_subject_id' => $cs10Physics->id],
            ['tenant_id' => $tenantId, 'exam_date' => now()->subDays(10), 'total_marks' => 100.00, 'pass_marks' => 33.00]
        );
        $exSchedMath = ExamSchedule::firstOrCreate(
            ['exam_id' => $exam1->id, 'class_subject_id' => $cs10HigherMath->id],
            ['tenant_id' => $tenantId, 'exam_date' => now()->subDays(8), 'total_marks' => 100.00, 'pass_marks' => 33.00]
        );
        $exSchedChem = ExamSchedule::firstOrCreate(
            ['exam_id' => $exam1->id, 'class_subject_id' => $cs10Chem->id],
            ['tenant_id' => $tenantId, 'exam_date' => now()->subDays(6), 'total_marks' => 100.00, 'pass_marks' => 33.00]
        );
        $exSchedEng = ExamSchedule::firstOrCreate(
            ['exam_id' => $exam1->id, 'class_subject_id' => $cs10Eng->id],
            ['tenant_id' => $tenantId, 'exam_date' => now()->subDays(5), 'total_marks' => 100.00, 'pass_marks' => 33.00]
        );

        // Marks for Student 1 (Tanvir Ahmed)
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $exSchedPhysics->id, 'student_id' => $student1->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam1->id, 'marks_obtained' => 88.00, 'grade' => 'A+', 'grade_point' => 5.00]
        );
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $exSchedMath->id, 'student_id' => $student1->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam1->id, 'marks_obtained' => 92.00, 'grade' => 'A+', 'grade_point' => 5.00]
        );
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $exSchedChem->id, 'student_id' => $student1->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam1->id, 'marks_obtained' => 84.00, 'grade' => 'A+', 'grade_point' => 5.00]
        );
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $exSchedEng->id, 'student_id' => $student1->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam1->id, 'marks_obtained' => 78.00, 'grade' => 'A', 'grade_point' => 4.00]
        );

        // Marks for Student 2 (Sadia Rahman)
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $exSchedPhysics->id, 'student_id' => $student2->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam1->id, 'marks_obtained' => 76.00, 'grade' => 'A', 'grade_point' => 4.00]
        );
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $exSchedMath->id, 'student_id' => $student2->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam1->id, 'marks_obtained' => 82.00, 'grade' => 'A+', 'grade_point' => 5.00]
        );
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $exSchedChem->id, 'student_id' => $student2->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam1->id, 'marks_obtained' => 74.00, 'grade' => 'A', 'grade_point' => 4.00]
        );
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $exSchedEng->id, 'student_id' => $student2->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam1->id, 'marks_obtained' => 85.00, 'grade' => 'A+', 'grade_point' => 5.00]
        );

        // Exam 2: Class 8 Monthly Assessment
        $exam2 = Exam::firstOrCreate(
            ['tenant_id' => $tenantId, 'academic_class_id' => $class8->id, 'title' => '1st Monthly Assessment (Class 8)'],
            [
                'exam_type' => 'monthly_test',
                'start_date' => now()->subDays(3)->format('Y-m-d'),
                'is_published' => true,
                'description' => 'First monthly assessment test for Class 8.',
            ]
        );

        $ex8SchedMath = ExamSchedule::firstOrCreate(
            ['exam_id' => $exam2->id, 'class_subject_id' => $cs8Math->id],
            ['tenant_id' => $tenantId, 'exam_date' => now()->subDays(3), 'total_marks' => 50.00, 'pass_marks' => 17.00]
        );
        $ex8SchedEng = ExamSchedule::firstOrCreate(
            ['exam_id' => $exam2->id, 'class_subject_id' => $cs8Eng->id],
            ['tenant_id' => $tenantId, 'exam_date' => now()->subDays(2), 'total_marks' => 50.00, 'pass_marks' => 17.00]
        );

        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $ex8SchedMath->id, 'student_id' => $student3->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam2->id, 'marks_obtained' => 46.00, 'grade' => 'A+', 'grade_point' => 5.00]
        );
        ExamMark::firstOrCreate(
            ['exam_schedule_id' => $ex8SchedEng->id, 'student_id' => $student3->id],
            ['tenant_id' => $tenantId, 'exam_id' => $exam2->id, 'marks_obtained' => 41.00, 'grade' => 'A', 'grade_point' => 4.00]
        );
    }
}
