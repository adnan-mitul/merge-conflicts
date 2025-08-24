<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventRegistrationController;

/*
|--------------------------------------------------------------------------
| API Routes (Token-based Sanctum)
|--------------------------------------------------------------------------
| These endpoints authenticate with Authorization: Bearer <token>.
| No cookies. No CSRF.
*/

// -------- Public (no auth) --------
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Optional: email verification
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed'])->name('verification.verify');
});

Route::get('/events/available', [EventRegistrationController::class, 'getAvailableEvents']);
Route::post('/event-registrations', [EventRegistrationController::class, 'store']);
Route::post('/event-registrations/unregister', [EventRegistrationController::class, 'unregister']);
Route::post('/event-registrations/check', [EventRegistrationController::class, 'checkRegistration']);


// -------- Protected (Bearer token) --------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);

    Route::post('/auth/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])
        ->middleware('throttle:6,1');

    Route::get('/dashboard', [DashboardController::class, 'index']);
});

// --------------------
// ADMIN-ONLY EVENT-CREATE FORM ROUTES
// --------------------
Route::middleware(['auth:sanctum', 'admin.only'])->group(function () {
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
    // Registration management
    Route::get('/admin/events/{event}/registrations', [EventRegistrationController::class, 'getEventRegistrations']);
    Route::get('/admin/registrations/{registration}', [EventRegistrationController::class, 'show']);
    Route::put('/admin/registrations/{registration}', [EventRegistrationController::class, 'update']);
    Route::delete('/admin/registrations/{registration}', [EventRegistrationController::class, 'destroy']);


});