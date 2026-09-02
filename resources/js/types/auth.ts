export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student';

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    tenant_id: number | null;
    is_active: boolean;
    email_verified_at: string | null;
    /* @chisel-2fa */
    two_factor_enabled?: boolean;
    /* @end-chisel-2fa */
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type Tenant = {
    id: number;
    name: string;
    slug: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason?: string | null;
    users_count?: number;
    created_at: string;
    updated_at: string;
};

export type SharedData = {
    name: string;
    auth: Auth;
    tenant: { id: number; name: string; email?: string; phone?: string; address?: string } | null;
    isImpersonating?: boolean;
    impersonatorRole?: string | null;
    sidebarOpen: boolean;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

/* @chisel-2fa */
export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
/* @end-chisel-2fa */

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};
