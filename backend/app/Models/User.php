<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Role constants
     */
    const ROLE_ADMIN   = 'admin';
    const ROLE_STUDENT = 'student';   // ✅ only keep what you need

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Default role = student
     */
    protected $attributes = [
        'role' => self::ROLE_STUDENT,
    ];

    /** Helpers */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isStudent(): bool
    {
        return $this->role === self::ROLE_STUDENT;
    }

    /**
     * Get all available roles
     */
    public static function getAllRoles(): array
    {
        return [
            self::ROLE_ADMIN,
            self::ROLE_STUDENT,
        ];
    }

    /**
     * Role label
     */
    public function getRoleDisplayAttribute(): string
    {
        return match ($this->role) {
            self::ROLE_ADMIN   => 'Administrator',
            self::ROLE_STUDENT => 'Student',
            default            => 'Unknown',
        };
    }

    /** Query scopes */
    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    public function scopeAdmins($query)
    {
        return $query->byRole(self::ROLE_ADMIN);
    }

    public function scopeStudents($query)
    {
        return $query->byRole(self::ROLE_STUDENT);
    }
}
