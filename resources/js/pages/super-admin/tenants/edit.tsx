import { Head, useForm, Link, router } from '@inertiajs/react';
import { KeyRound, ShieldCheck, UserCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { Tenant, User } from '@/types';

type Props = {
    tenant: Tenant & { admins?: User[] };
};

export default function TenantsEdit({ tenant }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name,
        slug: tenant.slug,
        email: tenant.email ?? '',
        phone: tenant.phone ?? '',
        address: tenant.address ?? '',
    });

    const [selectedAdminId, setSelectedAdminId] = useState<number | null>(
        tenant.admins?.[0]?.id ?? null,
    );
    const [newPassword, setNewPassword] = useState('');
    const [resetting, setResetting] = useState(false);
    const [resetMessage, setResetMessage] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/super-admin/tenants/${tenant.id}`);
    }

    function handleResetPassword(e: FormEvent) {
        e.preventDefault();
        if (!selectedAdminId || !newPassword) return;

        setResetting(true);
        router.post(
            `/super-admin/tenants/${tenant.id}/reset-admin-password`,
            {
                admin_user_id: selectedAdminId,
                new_password: newPassword,
            },
            {
                onSuccess: () => {
                    setNewPassword('');
                    setResetMessage('Password updated successfully!');
                    setTimeout(() => setResetMessage(''), 4000);
                },
                onFinish: () => setResetting(false),
            },
        );
    }

    return (
        <>
            <Head title={`Edit — ${tenant.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit Coaching Center
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update institution information and admin credentials.
                    </p>
                </div>

                {/* Main Tenant Information Form */}
                <div className="bg-card border rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Center Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    required
                                />
                                <InputError message={errors.slug} />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Center Details'}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/super-admin/tenants">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Admin Password Reset Section */}
                <div className="bg-card border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-base">
                        <KeyRound className="h-5 w-5 text-primary" />
                        <h2>Reset Coaching Admin Password</h2>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        As Super Admin, you can set a new password for the coaching center's administrator account at any time.
                    </p>

                    {tenant.admins && tenant.admins.length > 0 ? (
                        <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Select Admin Account</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={selectedAdminId ?? ''}
                                        onChange={(e) => setSelectedAdminId(Number(e.target.value))}
                                    >
                                        {tenant.admins.map((adm) => (
                                            <option key={adm.id} value={adm.id}>
                                                {adm.name} ({adm.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password (min 8 chars)</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>

                            {resetMessage && (
                                <p className="text-xs text-green-600 font-medium">{resetMessage}</p>
                            )}

                            <Button
                                type="submit"
                                variant="secondary"
                                disabled={resetting || !newPassword || newPassword.length < 8}
                            >
                                {resetting ? 'Resetting...' : 'Set New Password'}
                            </Button>
                        </form>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">
                            No admin user accounts associated with this coaching center.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

TenantsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/super-admin/dashboard' },
        { title: 'Coaching Centers', href: '/super-admin/tenants' },
        { title: 'Edit', href: '#' },
    ],
};
