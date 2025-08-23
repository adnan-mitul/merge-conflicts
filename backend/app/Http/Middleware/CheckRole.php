<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated',
                'error' => 'Please login to access this resource'
            ], 401);
        }

        $user = $request->user();

        // Check if user has a role assigned
        if (!$user->role) {
            return response()->json([
                'message' => 'Access denied',
                'error' => 'No role assigned to user'
            ], 403);
        }

        // Check if user's role is in the allowed roles
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Forbidden',
                'error' => 'Insufficient permissions to access this resource',
                'required_roles' => $roles,
                'user_role' => $user->role
            ], 403);
        }

        return $next($request);
    }
}