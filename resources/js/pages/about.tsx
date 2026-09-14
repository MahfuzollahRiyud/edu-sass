import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BookOpen,
    Building2,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    DollarSign,
    GraduationCap,
    HelpCircle,
    Layers,
    Lock,
    LogIn,
    Receipt,
    Shield,
    Sparkles,
    UserCheck,
    Users,
} from 'lucide-react';
import PublicFooter from '@/components/public-footer';
import PublicHeader from '@/components/public-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { SharedData } from '@/types';

export default function AboutPage() {
    const { auth } = usePage<SharedData>().props;

    const steps = [
        {
            number: '01',
            title: 'প্রতিষ্ঠান রেজিস্ট্রেশন (Institute Registration)',
            desc: 'পরিচালক প্রতিষ্ঠানের নাম, যোগাযোগের নম্বর ও বিবরণ দিয়ে খুব সহজে রেজিস্ট্রেশন সম্পন্ন করেন। সুপার এডমিনের দ্রুত ভেরিফিকেশনের পর আপনার কোচিং অ্যাক্টিভ হয়ে যায়।',
            icon: Building2,
            tag: 'First Step',
        },
        {
            number: '02',
            title: 'একাডেমিক কাঠামো ও ফি সেটআপ (Classes & Batches)',
            desc: 'আপনার কোচিংয়ের ক্লাসসমূহ (যেমন: Class 8, 9, 10, SSC, HSC), সেকশন/ব্যাচ এবং বিষয়সমূহ তৈরি করুন। প্রতিটি ক্লাস বা বিষয়ের জন্য স্ট্যান্ডার্ড মাসিক ফি নির্ধারণ করুন।',
            icon: Layers,
            tag: 'Configuration',
        },
        {
            number: '03',
            title: 'শিক্ষক ও শিক্ষার্থী অন্তর্ভুক্তি (Onboard Users)',
            desc: 'শিক্ষকদের অ্যাকাউন্ট তৈরি করে দিন। শিক্ষার্থীদের দ্রুত অ্যাডমিশন ফর্মে নাম, রোল ও ব্যাচ সিলেক্ট করে এনরোল করুন। প্রতিটি ইউজারের জন্য স্বয়ংক্রিয় পোর্টাল তৈরি হয়।',
            icon: Users,
            tag: 'Enrollment',
        },
        {
            number: '04',
            title: 'সাপ্তাহিক ক্লাস রুটিন তৈরি (Routine & Timetable)',
            desc: 'কোন দিন কোন সময়ে কোন শিক্ষক কোন বিষয়ের ক্লাস নেবেন তা সংঘাতমুক্ত (Conflict-Free) রুটিন বিল্ডারে সেট করুন। শিক্ষক ও শিক্ষার্থীদের ড্যাশবোর্ডে এটি লাইভ হয়ে যায়।',
            icon: Calendar,
            tag: 'Scheduling',
        },
        {
            number: '05',
            title: 'দৈনিক ডিজিটাল হাজিরা (Class Attendance)',
            desc: 'শিক্ষক ক্লাসে প্রবেশ করে মোবাইল বা কম্পিউটারে এক ক্লিকে উপস্থিত ও অনুপস্থিত মার্ক করবেন। উপস্থিতির হার স্বয়ংক্রিয়ভাবে শিক্ষার্থীদের প্রোফাইলে আপডেট হয়।',
            icon: UserCheck,
            tag: 'Daily Activity',
        },
        {
            number: '06',
            title: 'ফি কালেকশন ও মানি রিসিট (Fee Collection & Receipts)',
            desc: 'শিক্ষার্থীদের কাছ থেকে টিউশন ফি গ্রহণ করে তাত্ক্ষণিক প্রফেশনাল মানি রিসিট প্রিন্ট বা ডিজিটাল কপি প্রদান করুন। বকেয়া ও আদায়ের হিসাব থাকবে শতভাগ নির্ভুল।',
            icon: Receipt,
            tag: 'Finance',
        },
    ];

    const painPoints = [
        {
            icon: BookOpen,
            title: 'কাগজ-কলম ও এক্সেলে হিসাবের ভোগান্তি দূর',
            subtitle: 'No More Paper Registers',
            desc: 'ম্যানুয়াল খাতা হারিয়ে যাওয়া, পাতা নষ্ট হওয়া কিংবা এক্সেলে ভুল এন্ট্রির দিন শেষ। সকল একাডেমিক ও আর্থিক রেকর্ড ক্লাউডে আজীবন সুরক্ষিত।',
        },
        {
            icon: DollarSign,
            title: 'শূন্য বকেয়া ও স্বচ্ছ ফি ট্র্যাকিং',
            subtitle: 'Zero Fee Leakage',
            desc: 'কোন শিক্ষার্থী কোন মাসের ফি পরিশোধ করেছে এবং কার কত টাকা বকেয়া আছে তা এক ক্লিকে দেখুন। সাথে পাবেন অফিশিয়াল মানি রিসিট।',
        },
        {
            icon: Clock,
            title: 'ক্ল্যাশ-মুক্ত স্মার্ট সাপ্তাহিক রুটিন',
            subtitle: 'Conflict-Free Timetable',
            desc: 'একই শিক্ষক একই সময়ে দুই ব্যাচে পড়ার কোনো সম্ভাবনা নেই। শিক্ষক ও শিক্ষার্থী উভয়েই যেকোনো সময় নিজেদের রুটিন দেখতে পারেন।',
        },
        {
            icon: Lock,
            title: 'সম্পূর্ণ আলাদা ও নিরাপদ ডেটাবেস',
            subtitle: 'Multi-Tenant Data Privacy',
            desc: 'আপনার কোচিং সেন্টারের কোনো তথ্য বা শিক্ষার্থীর তালিকা অন্য কোনো প্রতিষ্ঠান দেখতে পারবে না। শতভাগ আইসোলেশন ও ডেটা নিরাপত্তা।',
        },
    ];

    const faqs = [
        {
            q: 'একটি কোচিং সেন্টারে কি একাধিক ব্যাচ বা শাখা পরিচালনা করা সম্ভব?',
            a: 'হ্যাঁ, প্রতিটি ক্লাসের অধীনে আপনি যত খুশি সেকশন বা ব্যাচ তৈরি করতে পারবেন এবং শিক্ষার্থীদের নির্দিষ্ট ব্যাচে ভাগ করে রুটিন ও হাজিরা নিতে পারবেন।',
        },
        {
            q: 'ফি রিসিট কি সাধারণ প্রিন্টারে প্রিন্ট করা যায়?',
            a: 'হ্যাঁ! যেকোনো সাধারণ ডেক্সটপ প্রিন্টার অথবা লেজার প্রিন্টার থেকে এক ক্লিকে পরিষ্কার ও মার্জিত অফিসিয়াল মানি রিসিট প্রিন্ট করা সম্ভব।',
        },
        {
            q: 'শিক্ষকরা কি অন্য শিক্ষকদের ক্লাস বা অর্থনৈতিক তথ্য দেখতে পাবেন?',
            a: 'না। EduFlow-তে রোল-বেসড সিকিউরিটি আছে। শিক্ষকরা শুধুমাত্র তাদের জন্য নির্ধারিত ক্লাস, রুটিন এবং শিক্ষার্থীদের হাজিরা ও মার্কস দেখতে ও ম্যানেজ করতে পারবেন।',
        },
        {
            q: 'রেজিস্ট্রেশন করার কতক্ষণ পর আমরা সফটওয়্যার ব্যবহার শুরু করতে পারব?',
            a: 'রেজিস্ট্রেশন ফর্ম সাবমিট করার পর প্ল্যাটফর্মের সুপার এডমিন অনুমোদন দিলে সাথে সাথেই আপনি আপনার কোচিং ড্যাশবোর্ডে লগইন করে কার্যক্রম শুরু করতে পারবেন।',
        },
    ];

    return (
        <>
            <Head title="About & How It Works — EduFlow SaaS" />
            <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
                <PublicHeader currentPage="about" />

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border/60 bg-gradient-to-b from-muted/30 to-background">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-xs">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                আধুনিক কোচিং ও একাডেমি পরিচালনার পূর্ণাঙ্গ সমাধান
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
                                কোচিং সেন্টার ম্যানেজমেন্টকে করুন আরও সহজ, সুশৃঙ্খল ও গতিশীল
                            </h1>

                            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                                <strong>EduFlow</strong> হলো একটি সম্পূর্ণ ক্লাউড-ভিত্তিক মাল্টি-টেন্যান্ট প্ল্যাটফর্ম — যা কোচিং সেন্টারের ভর্তি, রুটিন, হাজিরা, পরীক্ষার ফলাফল এবং ফি আদায়কে নিয়ে এসেছে এক ছাতার নিচে।
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                                {auth?.user ? (
                                    <Button size="lg" asChild className="px-7 shadow-md">
                                        <Link href="/dashboard">
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button size="lg" asChild className="px-7 shadow-md">
                                            <Link href="/register-institution">
                                                <Building2 className="mr-2 h-4 w-4" />
                                                Register Coaching Center
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" asChild className="px-7">
                                            <Link href="/login">
                                                <LogIn className="mr-2 h-4 w-4" />
                                                Sign In to Portal
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Why Coaching Centers Need EduFlow */}
                    <section className="py-16 sm:py-20 border-b border-border/60 max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
                                Why EduFlow?
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                কেন আপনার কোচিংয়ের জন্য EduFlow প্রয়োজন?
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                খাতা-কলম আর সনাতন পদ্ধতির হিসাবের কারণে কোচিংয়ের মূল্যবান সময় ও টাকা নষ্ট হওয়া বন্ধ করুন।
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {painPoints.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <Card key={idx} className="border-border/60 hover:border-primary/50 transition-all shadow-xs hover:shadow-md">
                                        <CardContent className="p-6 space-y-3">
                                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-primary font-medium mt-0.5">{item.subtitle}</p>
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* Step-by-Step How It Works */}
                    <section className="py-16 sm:py-20 border-b border-border/60 bg-muted/20">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6">
                            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                                <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
                                    How It Works
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    স্টেপ-বাই-স্টেপ: প্ল্যাটফর্মটি কীভাবে কাজ করে?
                                </h2>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    রেজিস্ট্রেশন থেকে শুরু করে দৈনিক হাজিরা ও ফি কালেকশন — শুরু করা একদম সহজ!
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {steps.map((step, idx) => {
                                    const StepIcon = step.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="relative bg-card border border-border/60 rounded-xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-black text-primary/30 tracking-tight">
                                                        {step.number}
                                                    </span>
                                                    <Badge variant="secondary" className="text-[11px] font-medium">
                                                        {step.tag}
                                                    </Badge>
                                                </div>
                                                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <StepIcon className="h-4.5 w-4.5" />
                                                </div>
                                                <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                                                    {step.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Tailored Portals (Who is it for?) */}
                    <section className="py-16 sm:py-20 border-b border-border/60 max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
                                Dedicated Roles
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                সকলের জন্য স্বতন্ত্র ড্যাশবোর্ড ও সুবিধা
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                পরিচালক, শিক্ষক ও শিক্ষার্থী — প্রত্যেকের জন্য রয়েছে আলাদা ডেডিকেটেড ইন্টারফেস।
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Admin */}
                            <Card className="border-border/60 shadow-xs flex flex-col justify-between">
                                <CardContent className="p-6 space-y-4">
                                    <div className="size-11 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">কোচিং এডমিন (Admin)</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">প্রতিষ্ঠান প্রধান বা ম্যানেজমেন্টের জন্য</p>
                                    </div>
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>নতুন শিক্ষার্থী অ্যাডমিশন ও ব্যাচ বরাদ্দ</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>মাসিক টিউশন ফি কালেকশন ও মানি রিসিট প্রদান</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>শিক্ষকদের ক্লাসে অ্যাসাইন ও রুটিন চূড়ান্তকরণ</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>প্রতিষ্ঠানের সম্পূর্ণ অর্থনৈতিক ও একাডেমিক ওভারভিউ</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Teacher */}
                            <Card className="border-border/60 shadow-xs flex flex-col justify-between">
                                <CardContent className="p-6 space-y-4">
                                    <div className="size-11 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">শিক্ষকবৃন্দ (Teachers)</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">ক্লাস ও একাডেমিক পরিচালনার জন্য</p>
                                    </div>
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>সাপ্তাহিক ক্লাসের শিডিউল ও সময়সূচি দেখা</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>ক্লাসে উপস্থিত শিক্ষার্থীদের লাইভ ডিজিটাল হাজিরা</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>পরীক্ষার মার্কস এন্ট্রি ও রেজাল্ট শিট প্রস্তুত</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>অনুপস্থিত শিক্ষার্থীদের তালিকা পর্যবেক্ষণ</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Student */}
                            <Card className="border-border/60 shadow-xs flex flex-col justify-between">
                                <CardContent className="p-6 space-y-4">
                                    <div className="size-11 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                        <GraduationCap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">শিক্ষার্থীবৃন্দ (Students)</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">ব্যক্তিগত পোর্টাল ও অগ্রগতি দেখার জন্য</p>
                                    </div>
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>নিজের সাপ্তাহিক ক্লাসের সময়সূচি ও রুম নম্বর</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>উপস্থিতির শতকরা হার (Attendance Summary)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>পরিশোধিত ও বকেয়া ফির হিসাব স্বচ্ছভাবে দেখা</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                            <span>অফিসিয়াল মানি রিসিট ডাউনলোড ও ভিউ করা</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-16 sm:py-20 border-b border-border/60 bg-muted/20">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6">
                            <div className="text-center mb-12 space-y-3">
                                <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
                                    FAQ
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    সচরাচর জিজ্ঞাসিত প্রশ্নাবলি
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    EduFlow সম্পর্কে আপনার যেকোনো সাধারণ প্রশ্নের উত্তর জেনে নিন।
                                </p>
                            </div>

                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-2"
                                    >
                                        <div className="flex items-center gap-2.5 font-semibold text-sm sm:text-base text-foreground">
                                            <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                                            <span>{faq.q}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-muted-foreground pl-6 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Banner */}
                    <section className="py-16 sm:py-24 text-center max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-primary/10 p-8 sm:p-12 space-y-6 shadow-sm">
                            <div className="size-12 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto">
                                <Award className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                                আজই আপনার কোচিং সেন্টারকে ডিজিটালাইজ করুন
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                                কোনো ঝামেলা ছাড়াই সরাসরি রেজিস্ট্রেশন করুন এবং আপনার কোচিং সেন্টারের সকল কাজকে নিয়ে আসুন গতিশীল আধুনিক ক্লাউড সিস্টেমে।
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                                <Button size="lg" asChild className="px-8 shadow-md">
                                    <Link href="/register-institution">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        রেজিস্ট্রেশন করুন (Register Institute)
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="px-7">
                                    <Link href="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        লগইন করুন (Sign In)
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </section>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
