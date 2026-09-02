import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, CheckCircle2, GraduationCap, Lock, Mail, MapPin, Phone, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';

export default function RegisterInstitution() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register-institution');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setData((prev) => ({
            ...prev,
            name: val,
            slug: prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                : prev.slug,
        }));
    };

    return (
        <>
            <Head title="Register Coaching Institution — EduSaaS" />
            <div className="min-h-screen bg-muted/30 py-6 sm:py-10 px-4 sm:px-6 lg:px-12 flex flex-col justify-center">
                {/* Wide desktop container */}
                <div className="max-w-5xl mx-auto w-full space-y-6">
                    {/* Top Navigation */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <span>Already registered?</span>
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Card Container */}
                    <div className="bg-card text-card-foreground border border-border/80 shadow-2xl rounded-2xl overflow-hidden">
                        {/* Header Banner */}
                        <div className="bg-primary/5 border-b border-border/60 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5">
                                    <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
                                        <GraduationCap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                                            Register Your Coaching Center
                                        </h1>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                            Multi-tenant cloud platform for classes, admissions, routines, attendance & fees.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Self-Service Onboarding
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 sm:gap-6 text-xs text-muted-foreground pt-3 border-t border-primary/10">
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-4 w-4 text-primary" /> Dedicated Tenant Database Isolation
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4 text-primary" /> Super Admin Verification Workflow
                                </span>
                            </div>
                        </div>

                        {/* Form Body: 2 Wide Columns on Desktop, 1 Column on Mobile */}
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10 space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                                {/* Left Column: 1. Coaching / Institution Details */}
                                <div className="space-y-5">
                                    <div className="border-b border-border/60 pb-2.5">
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            1. Coaching / Institution Details
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Coaching / Institution Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                onChange={handleNameChange}
                                                placeholder="e.g. Apex Coaching Academy"
                                                className="h-10 text-sm"
                                                required
                                                autoFocus
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="slug" className="text-sm font-medium">
                                                Institute Identifier / Subdomain Slug
                                            </Label>
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-xs sm:text-sm h-10 font-mono">
                                                    edu-sass.test/
                                                </span>
                                                <Input
                                                    id="slug"
                                                    name="slug"
                                                    value={data.slug}
                                                    onChange={(e) => setData('slug', e.target.value)}
                                                    placeholder="apex-coaching"
                                                    className="rounded-l-none h-10 font-mono text-sm"
                                                />
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">
                                                Unique URL identifier for your coaching portal.
                                            </p>
                                            <InputError message={errors.slug} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone" className="text-sm font-medium">
                                                Contact Phone Number <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="017XXXXXXXX"
                                                    className="pl-9 h-10 text-sm"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-sm font-medium">
                                                Institute Official Email
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="info@apexcoaching.com"
                                                    className="pl-9 h-10 text-sm"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="address" className="text-sm font-medium">
                                                Campus / Center Address
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    placeholder="House 42, Road 11, Dhanmondi, Dhaka"
                                                    className="pl-9 h-10 text-sm"
                                                />
                                            </div>
                                            <InputError message={errors.address} />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: 2. Primary Administrator Account */}
                                <div className="space-y-5">
                                    <div className="border-b border-border/60 pb-2.5">
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            2. Primary Administrator Account
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="admin_name" className="text-sm font-medium">
                                                Admin Full Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="admin_name"
                                                name="admin_name"
                                                value={data.admin_name}
                                                onChange={(e) => setData('admin_name', e.target.value)}
                                                placeholder="Principal / Director Name"
                                                className="h-10 text-sm"
                                                required
                                            />
                                            <InputError message={errors.admin_name} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="admin_email" className="text-sm font-medium">
                                                Admin Login Email <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="admin_email"
                                                name="admin_email"
                                                type="email"
                                                value={data.admin_email}
                                                onChange={(e) => setData('admin_email', e.target.value)}
                                                placeholder="admin@apexcoaching.com"
                                                className="h-10 text-sm"
                                                required
                                            />
                                            <InputError message={errors.admin_email} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="admin_password" className="text-sm font-medium">
                                                Password <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="admin_password"
                                                    name="admin_password"
                                                    type="password"
                                                    value={data.admin_password}
                                                    onChange={(e) => setData('admin_password', e.target.value)}
                                                    placeholder="Minimum 8 characters"
                                                    className="pl-9 h-10 text-sm"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.admin_password} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="admin_password_confirmation" className="text-sm font-medium">
                                                Confirm Password <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="admin_password_confirmation"
                                                    name="admin_password_confirmation"
                                                    type="password"
                                                    value={data.admin_password_confirmation}
                                                    onChange={(e) => setData('admin_password_confirmation', e.target.value)}
                                                    placeholder="Repeat password"
                                                    className="pl-9 h-10 text-sm"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.admin_password_confirmation} />
                                        </div>

                                        {/* Notice Box */}
                                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-900 dark:text-amber-200">
                                            <strong>Note:</strong> Your registration will be reviewed by the Super Admin. You will be able to log in to your coaching dashboard once approved.
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full h-11 text-base font-semibold shadow-md mt-2"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner className="mr-2" />}
                                            Submit Registration Request
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        © {new Date().getFullYear()} EduSaaS Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
}

RegisterInstitution.layout = (page: React.ReactNode) => page;
