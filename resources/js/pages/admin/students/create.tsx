import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { AcademicClass, FeeType } from '@/types';
import { useState, type FormEvent } from 'react';

type Props = {
    classes: AcademicClass[];
    feeTypes: FeeType[];
};

export default function StudentCreate({ classes, feeTypes }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    const defaultAdmissionFee = feeTypes.find((f) => f.name.toLowerCase().includes('admission'))?.default_amount || '500';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        academic_class_id: classes[0]?.id ? String(classes[0].id) : '',
        phone: '',
        guardian_name: '',
        guardian_phone: '',
        address: '',
        date_of_birth: '',
        gender: 'male',
        admission_date: today,
        monthly_fee: '0',
        class_subject_ids: [] as number[],
        // Optional fee billing & initial collection
        admission_fee: String(defaultAdmissionFee),
        admission_fee_paid: String(defaultAdmissionFee),
        include_first_month_fee: true,
        first_month: currentMonth,
        first_month_fee: '0',
        first_month_fee_paid: '0',
        payment_method: 'cash',
    });

    const selectedClass = classes.find((c) => String(c.id) === String(data.academic_class_id));

    function calculateTotalFeeForSubjects(subjectIds: number[], cls = selectedClass) {
        if (!cls || !cls.class_subjects) return 0;
        return cls.class_subjects
            .filter((cs) => subjectIds.includes(cs.id))
            .reduce((sum, cs) => sum + Number(cs.monthly_fee || 0), 0);
    }

    function handleClassChange(classId: string) {
        const cls = classes.find((c) => String(c.id) === classId);
        const allSubjectIds = cls && cls.class_subjects ? cls.class_subjects.map((cs) => cs.id) : [];
        const calculatedFee = calculateTotalFeeForSubjects(allSubjectIds, cls);
        const newFee = calculatedFee > 0 ? String(calculatedFee) : (data.monthly_fee === '0' ? '1000' : data.monthly_fee);

        setData((prev) => ({
            ...prev,
            academic_class_id: classId,
            class_subject_ids: allSubjectIds,
            monthly_fee: newFee,
            first_month_fee: newFee,
            first_month_fee_paid: newFee,
        }));
    }

    function toggleSubject(id: number) {
        const current = [...data.class_subject_ids];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }

        const calculatedFee = calculateTotalFeeForSubjects(current);
        const newFee = calculatedFee > 0 ? String(calculatedFee) : data.monthly_fee;

        setData((prev) => ({
            ...prev,
            class_subject_ids: current,
            monthly_fee: newFee,
            first_month_fee: prev.first_month_fee === prev.monthly_fee ? newFee : prev.first_month_fee,
            first_month_fee_paid: prev.first_month_fee_paid === prev.monthly_fee ? newFee : prev.first_month_fee_paid,
        }));
    }

    const admissionFeeNum = Number(data.admission_fee) || 0;
    const admissionPaidNum = Number(data.admission_fee_paid) || 0;
    const monthlyFeeNum = data.include_first_month_fee ? (Number(data.first_month_fee) || 0) : 0;
    const monthlyPaidNum = data.include_first_month_fee ? (Number(data.first_month_fee_paid) || 0) : 0;

    const totalBilled = admissionFeeNum + monthlyFeeNum;
    const totalPaid = admissionPaidNum + monthlyPaidNum;
    const totalDue = Math.max(0, totalBilled - totalPaid);

    function handlePayFull() {
        setData((prev) => ({
            ...prev,
            admission_fee_paid: prev.admission_fee,
            first_month_fee_paid: prev.include_first_month_fee ? prev.first_month_fee : '0',
        }));
    }

    function handlePayAdmissionOnly() {
        setData((prev) => ({
            ...prev,
            admission_fee_paid: prev.admission_fee,
            first_month_fee_paid: '0',
        }));
    }

    function handleKeepAllDue() {
        setData((prev) => ({
            ...prev,
            admission_fee_paid: '0',
            first_month_fee_paid: '0',
        }));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/students');
    }

    return (
        <>
            <Head title="Student Admission" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">New Student Admission</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Admit a new student, assign class & subjects, set monthly fee, and create login credentials.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold border-b pb-2">1. Student Profile & Account</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Student Full Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Rahim Ahmed"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Login Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="student@example.com"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="password">Login Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min 8 characters"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Student Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="guardian_name">Guardian Name</Label>
                                <Input
                                    id="guardian_name"
                                    value={data.guardian_name}
                                    onChange={(e) => setData('guardian_name', e.target.value)}
                                    placeholder="Father/Mother name"
                                />
                                <InputError message={errors.guardian_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guardian_phone">Guardian Phone</Label>
                                <Input
                                    id="guardian_phone"
                                    value={data.guardian_phone}
                                    onChange={(e) => setData('guardian_phone', e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                />
                                <InputError message={errors.guardian_phone} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Student residential address"
                            />
                            <InputError message={errors.address} />
                        </div>
                    </div>

                    {/* Academic Enrollment */}
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold border-b pb-2">2. Academic Enrollment</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="academic_class_id">Select Academic Class *</Label>
                                <select
                                    id="academic_class_id"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                    value={data.academic_class_id}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    required
                                >
                                    <option value="">Select a class</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} {c.section ? `(${c.section})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.academic_class_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admission_date">Admission Date *</Label>
                                <Input
                                    id="admission_date"
                                    type="date"
                                    value={data.admission_date}
                                    onChange={(e) => setData('admission_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.admission_date} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="monthly_fee">Monthly Tuition Fee (৳) *</Label>
                                <Input
                                    id="monthly_fee"
                                    type="number"
                                    min="0"
                                    step="10"
                                    value={data.monthly_fee}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setData((prev) => ({
                                            ...prev,
                                            monthly_fee: val,
                                            first_month_fee: prev.first_month_fee === prev.monthly_fee || prev.first_month_fee === '0' ? val : prev.first_month_fee,
                                            first_month_fee_paid: prev.first_month_fee_paid === prev.monthly_fee || prev.first_month_fee_paid === '0' ? val : prev.first_month_fee_paid,
                                        }));
                                    }}
                                    required
                                />
                                <InputError message={errors.monthly_fee} />
                            </div>
                        </div>

                        {/* Subject Selection */}
                        <div className="space-y-2 pt-2">
                            <Label>Select Enrolled Subjects *</Label>
                            {selectedClass?.class_subjects && selectedClass.class_subjects.length > 0 ? (
                                <div className="grid gap-2 sm:grid-cols-3 border p-3 rounded-lg bg-card">
                                    {selectedClass.class_subjects.map((cs) => {
                                        const isChecked = data.class_subject_ids.includes(cs.id);
                                        return (
                                            <label
                                                key={cs.id}
                                                className={`flex items-center justify-between gap-2 p-2.5 rounded border text-sm cursor-pointer transition-all ${
                                                    isChecked
                                                        ? 'bg-primary/10 border-primary text-primary font-medium'
                                                        : 'hover:bg-muted/50 border-input'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => toggleSubject(cs.id)}
                                                        className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                                    />
                                                    <span>{cs.subject?.name}</span>
                                                </div>
                                                {Number(cs.monthly_fee) > 0 && (
                                                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${isChecked ? 'bg-primary/20 text-primary font-bold' : 'bg-muted text-muted-foreground'}`}>
                                                        ৳{Number(cs.monthly_fee).toLocaleString()}
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-xs italic bg-muted/40 p-3 rounded-md">
                                    Please select a class that has subjects assigned.
                                </p>
                            )}
                            <InputError message={errors.class_subject_ids} />
                        </div>
                    </div>

                    {/* Section 3: Initial Fee Billing & Payment Collection */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-2">
                            <div>
                                <h2 className="text-base font-semibold">3. Fee Billing & Initial Collection</h2>
                                <p className="text-xs text-muted-foreground">
                                    Configure admission fee and optional first month tuition fee with instant money receipts.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7"
                                    onClick={handlePayFull}
                                >
                                    Pay Full (৳{totalBilled.toLocaleString()})
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7"
                                    onClick={handlePayAdmissionOnly}
                                >
                                    Admission Only (৳{admissionFeeNum.toLocaleString()})
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs h-7 text-muted-foreground"
                                    onClick={handleKeepAllDue}
                                >
                                    Keep Due
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Card 1: Admission Fee */}
                            <div className="p-4 rounded-xl border bg-card/60 space-y-3">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="font-semibold text-sm">Admission Fee</span>
                                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">One-Time</span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="admission_fee" className="text-xs">Admission Fee (৳)</Label>
                                        <Input
                                            id="admission_fee"
                                            type="number"
                                            min="0"
                                            step="10"
                                            value={data.admission_fee}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setData((prev) => ({
                                                    ...prev,
                                                    admission_fee: val,
                                                    admission_fee_paid: prev.admission_fee_paid === prev.admission_fee ? val : prev.admission_fee_paid,
                                                }));
                                            }}
                                        />
                                        <InputError message={errors.admission_fee} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="admission_fee_paid" className="text-xs font-medium text-green-700 dark:text-green-400">Amount Paid Now (৳)</Label>
                                        <Input
                                            id="admission_fee_paid"
                                            type="number"
                                            min="0"
                                            max={data.admission_fee}
                                            step="10"
                                            value={data.admission_fee_paid}
                                            onChange={(e) => setData('admission_fee_paid', e.target.value)}
                                        />
                                        <InputError message={errors.admission_fee_paid} />
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground flex justify-between pt-1">
                                    <span>Remaining Due:</span>
                                    <span className="font-mono font-medium text-red-600">
                                        ৳{Math.max(0, (Number(data.admission_fee) || 0) - (Number(data.admission_fee_paid) || 0)).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: First Month Tuition Fee */}
                            <div className="p-4 rounded-xl border bg-card/60 space-y-3">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="include_first_month_fee"
                                            checked={data.include_first_month_fee}
                                            onChange={(e) => setData('include_first_month_fee', e.target.checked)}
                                            className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                        />
                                        <Label htmlFor="include_first_month_fee" className="font-semibold text-sm cursor-pointer">
                                            First Month Tuition Fee
                                        </Label>
                                    </div>
                                    <span className="text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded font-medium">Recurring</span>
                                </div>

                                {data.include_first_month_fee ? (
                                    <>
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="first_month" className="text-xs">Billing Month</Label>
                                                <Input
                                                    id="first_month"
                                                    type="month"
                                                    value={data.first_month}
                                                    onChange={(e) => setData('first_month', e.target.value)}
                                                />
                                                <InputError message={errors.first_month} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="first_month_fee" className="text-xs">Fee Amount (৳)</Label>
                                                <Input
                                                    id="first_month_fee"
                                                    type="number"
                                                    min="0"
                                                    step="10"
                                                    value={data.first_month_fee}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setData((prev) => ({
                                                            ...prev,
                                                            first_month_fee: val,
                                                            first_month_fee_paid: prev.first_month_fee_paid === prev.first_month_fee ? val : prev.first_month_fee_paid,
                                                        }));
                                                    }}
                                                />
                                                <InputError message={errors.first_month_fee} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="first_month_fee_paid" className="text-xs font-medium text-green-700 dark:text-green-400">Amount Paid Now (৳)</Label>
                                                <Input
                                                    id="first_month_fee_paid"
                                                    type="number"
                                                    min="0"
                                                    max={data.first_month_fee}
                                                    step="10"
                                                    value={data.first_month_fee_paid}
                                                    onChange={(e) => setData('first_month_fee_paid', e.target.value)}
                                                />
                                                <InputError message={errors.first_month_fee_paid} />
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground flex justify-between pt-1">
                                            <span>Remaining Due:</span>
                                            <span className="font-mono font-medium text-red-600">
                                                ৳{Math.max(0, (Number(data.first_month_fee) || 0) - (Number(data.first_month_fee_paid) || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic py-3">
                                        First month fee will not be billed at admission. You can generate it later via Monthly Fee generation.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Summary Box & Payment Method */}
                        <div className="bg-muted/40 p-4 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-6">
                                <div>
                                    <div className="text-xs text-muted-foreground">Total Initial Payable</div>
                                    <div className="text-lg font-bold font-mono">৳{totalBilled.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-green-700 dark:text-green-400 font-medium">Total Paid Now</div>
                                    <div className="text-lg font-bold font-mono text-green-600">৳{totalPaid.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-red-600 font-medium">Remaining Due</div>
                                    <div className="text-lg font-bold font-mono text-red-600">৳{totalDue.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Label htmlFor="payment_method" className="text-xs whitespace-nowrap">Payment Method:</Label>
                                <select
                                    id="payment_method"
                                    className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="other">bKash / Nagad / Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing || data.class_subject_ids.length === 0}>
                            {processing ? 'Admitting Student...' : 'Admit Student'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/students">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

StudentCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Students', href: '/admin/students' },
        { title: 'New Admission', href: '/admin/students/create' },
    ],
};
