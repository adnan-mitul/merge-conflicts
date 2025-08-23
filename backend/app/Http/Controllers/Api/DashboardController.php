<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $dashboardData = [
            'user' => $user,
            'role' => $user->role,
        ];

        // Return different dashboard data based on role
        switch ($user->role) {
            case 'admin':
                $dashboardData['data'] = [
                    'title' => 'Admin Dashboard',
                    'permissions' => ['manage_users', 'view_reports', 'system_settings'],
                    'stats' => [
                        'total_users' => User::count(),
                        'admin_users' => User::where('role', 'admin')->count(),
                        'regular_users' => User::where('role', 'user')->count(),
                    ],
                    'quick_actions' => [
                        'manage_users' => '/api/admin/users',
                        'system_settings' => '/api/admin/settings',
                        'reports' => '/api/admin/reports'
                    ]
                ];
                break;

            case 'user':
                $dashboardData['data'] = [
                    'title' => 'User Dashboard',
                    'permissions' => ['view_profile', 'update_profile'],
                    'stats' => [
                        'profile_completion' => 80,
                        'last_login' => $user->updated_at,
                    ],
                    'quick_actions' => [
                        'edit_profile' => '/api/profile',
                        'notifications' => '/api/notifications'
                    ]
                ];
                break;

            default:
                $dashboardData['data'] = [
                    'title' => 'Dashboard',
                    'permissions' => [],
                    'message' => 'Welcome to your dashboard'
                ];
        }

        return response()->json($dashboardData);
    }
}