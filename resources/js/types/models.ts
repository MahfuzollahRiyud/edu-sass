import type { User } from './auth';

export type AcademicClass = {
    id: number;
    name: string;
    section: string | null;
    full_name?: string;
    sort_order: number;
    is_active: boolean;
    students_count?: number;
    subjects_count?: number;
    subjects?: Subject[];
    class_subjects?: ClassSubject[];
    created_at: string;
    updated_at: string;
};

export type Subject = {
    id: number;
    name: string;
    code: string | null;
    is_active: boolean;
    classes_count?: number;
    classes?: AcademicClass[];
    created_at: string;
    updated_at: string;
};

export type ClassSubject = {
    id: number;
    academic_class_id: number;
    subject_id: number;
    display_name?: string;
    academic_class?: AcademicClass;
    subject?: Subject;
    teachers?: Teacher[];
    students?: Student[];
    created_at: string;
    updated_at: string;
};

export type Teacher = {
    id: number;
    user_id: number;
    phone: string | null;
    designation: string | null;
    address: string | null;
    is_active: boolean;
    name?: string;
    email?: string;
    user?: User;
    class_subjects?: ClassSubject[];
    schedules_count?: number;
    created_at: string;
    updated_at: string;
};

export type Student = {
    id: number;
    user_id: number;
    student_id: string;
    academic_class_id: number;
    phone: string | null;
    guardian_name: string | null;
    guardian_phone: string | null;
    address: string | null;
    date_of_birth: string | null;
    gender: string | null;
    admission_date: string;
    monthly_fee: number | string;
    is_active: boolean;
    name?: string;
    email?: string;
    user?: User;
    academic_class?: AcademicClass;
    student_subjects?: { id: number; class_subject?: ClassSubject }[];
    fee_invoices?: FeeInvoice[];
    attendances?: Attendance[];
    created_at: string;
    updated_at: string;
};

export type TimeSlot = {
    id: number;
    label: string | null;
    start_time: string;
    end_time: string;
    formatted_time?: string;
    is_active: boolean;
    schedules_count?: number;
    created_at: string;
    updated_at: string;
};

export type Schedule = {
    id: number;
    class_subject_id: number;
    teacher_id: number;
    time_slot_id: number;
    day_of_week: number;
    day_name?: string;
    room: string | null;
    is_active: boolean;
    class_subject?: ClassSubject;
    teacher?: Teacher;
    time_slot?: TimeSlot;
    created_at: string;
    updated_at: string;
};

export type Attendance = {
    id: number;
    schedule_id: number;
    student_id: number;
    attendance_date: string;
    status: 'present' | 'absent' | 'late';
    remarks: string | null;
    marked_by: number;
    schedule?: Schedule;
    student?: Student;
    marker?: User;
    created_at: string;
    updated_at: string;
};

export type FeeType = {
    id: number;
    name: string;
    is_recurring: boolean;
    default_amount: number | string;
    is_active: boolean;
    invoices_count?: number;
    created_at: string;
    updated_at: string;
};

export type FeeInvoice = {
    id: number;
    student_id: number;
    fee_type_id: number;
    title: string;
    amount: number | string;
    paid_amount: number | string;
    due_amount: number | string;
    status: 'unpaid' | 'partial' | 'paid';
    month: string | null;
    due_date: string | null;
    issue_date: string;
    notes: string | null;
    student?: Student;
    fee_type?: FeeType;
    payments?: Payment[];
    created_at: string;
    updated_at: string;
};

export type Payment = {
    id: number;
    fee_invoice_id: number;
    student_id: number;
    amount: number | string;
    payment_method: 'cash' | 'bank' | 'other';
    payment_date: string;
    reference: string | null;
    notes: string | null;
    received_by: number;
    student?: Student;
    invoice?: FeeInvoice;
    receipt?: Receipt;
    receiver?: User;
    created_at: string;
    updated_at: string;
};

export type Receipt = {
    id: number;
    payment_id: number;
    receipt_number: string;
    payment?: Payment;
    created_at: string;
    updated_at: string;
};
