<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Concerns\BelongsToTenant;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $role
 * @property int|null $tenant_id
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'role', 'tenant_id', 'is_active'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use BelongsToTenant, HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            /* @chisel-2fa */
            'two_factor_confirmed_at' => 'datetime',
            /* @end-chisel-2fa */
        ];
    }

    /**
     * Check if the user is a Super Admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    /**
     * Check if the user is a Tenant Admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if the user is a Teacher.
     */
    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    /**
     * Check if the user is a Student.
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Get the dashboard route for this user based on their role.
     */
    public function dashboardRoute(): string
    {
        return match ($this->role) {
            'super_admin' => 'super-admin.dashboard',
            'admin' => 'admin.dashboard',
            'teacher' => 'teacher.dashboard',
            'student' => 'student.dashboard',
            default => 'dashboard',
        };
    }
}
