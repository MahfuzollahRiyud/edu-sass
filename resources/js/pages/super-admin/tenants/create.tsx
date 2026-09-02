import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

export default function TenantsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/super-admin/tenants');
    }

    return (
        <>
            <Head title="Create Coaching Center" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create Coaching Center
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Add a new coaching center and its admin account.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl space-y-8"
                >
                    {/* Coaching Center Info */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">
                            Center Information
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Center Name *
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="ABC Coaching Center"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">
                                    Slug (auto-generated)
                                </Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData('slug', e.target.value)
                                    }
                                    placeholder="abc-coaching-center"
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
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="info@abccoaching.com"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    placeholder="01XXXXXXXXX"
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                placeholder="123 Main Street, City"
                            />
                            <InputError message={errors.address} />
                        </div>
                    </div>

                    {/* Admin Account */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">
                            Admin Account
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Create the admin account for this coaching center.
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="admin_name">
                                    Admin Name *
                                </Label>
                                <Input
                                    id="admin_name"
                                    value={data.admin_name}
                                    onChange={(e) =>
                                        setData('admin_name', e.target.value)
                                    }
                                    placeholder="John Doe"
                                    required
                                />
                                <InputError message={errors.admin_name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin_email">
                                    Admin Email *
                                </Label>
                                <Input
                                    id="admin_email"
                                    type="email"
                                    value={data.admin_email}
                                    onChange={(e) =>
                                        setData('admin_email', e.target.value)
                                    }
                                    placeholder="admin@abccoaching.com"
                                    required
                                />
                                <InputError message={errors.admin_email} />
                            </div>
                        </div>
                        <div className="max-w-sm space-y-2">
                            <Label htmlFor="admin_password">
                                Admin Password *
                            </Label>
                            <Input
                                id="admin_password"
                                type="password"
                                value={data.admin_password}
                                onChange={(e) =>
                                    setData('admin_password', e.target.value)
                                }
                                placeholder="Min 8 characters"
                                required
                            />
                            <InputError message={errors.admin_password} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Creating...'
                                : 'Create Coaching Center'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/super-admin/tenants">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TenantsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/super-admin/dashboard' },
        { title: 'Coaching Centers', href: '/super-admin/tenants' },
        { title: 'Create', href: '/super-admin/tenants/create' },
    ],
};
