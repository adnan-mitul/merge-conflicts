<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRegistrationRequest;
use App\Http\Requests\UpdateEventRegistrationRequest;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventRegistrationController extends Controller
{
    /**
     * Get all registrations for a specific event (Admin only)
     */
    public function getEventRegistrations(Event $event): JsonResponse
    {
        $registrations = $event->registrations()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'event' => $event,
                'registrations' => $registrations,
                'total_registrations' => $registrations->count()
            ],
            'message' => 'Event registrations retrieved successfully'
        ]);
    }

    /**
     * Register a student for an event (Public)
     */
    public function store(StoreEventRegistrationRequest $request): JsonResponse
    {
        try {
            $registration = EventRegistration::create($request->validated());
            
            // Load the event relationship
            $registration->load('event');

            return response()->json([
                'success' => true,
                'data' => $registration,
                'message' => 'Successfully registered for the event'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to register for event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get registration details by ID (Admin or the registered user)
     */
    public function show(EventRegistration $registration): JsonResponse
    {
        $registration->load('event');

        return response()->json([
            'success' => true,
            'data' => $registration,
            'message' => 'Registration details retrieved successfully'
        ]);
    }

    /**
     * Update registration (Admin only)
     */
    public function update(UpdateEventRegistrationRequest $request, EventRegistration $registration): JsonResponse
    {
        try {
            $registration->update($request->validated());
            $registration->load('event');

            return response()->json([
                'success' => true,
                'data' => $registration,
                'message' => 'Registration updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update registration',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unregister from event (Public - by student_id and event_id)
     */
    public function unregister(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'student_id' => 'required|string',
        ]);

        try {
            $registration = EventRegistration::where('event_id', $request->event_id)
                ->where('student_id', $request->student_id)
                ->first();

            if (!$registration) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration not found'
                ], 404);
            }

            $registration->delete();

            return response()->json([
                'success' => true,
                'message' => 'Successfully unregistered from the event'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to unregister from event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete registration (Admin only)
     */
    public function destroy(EventRegistration $registration): JsonResponse
    {
        try {
            $registration->delete();

            return response()->json([
                'success' => true,
                'message' => 'Registration deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete registration',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if a student is registered for an event
     */
    public function checkRegistration(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'student_id' => 'required|string',
        ]);

        $registration = EventRegistration::where('event_id', $request->event_id)
            ->where('student_id', $request->student_id)
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'is_registered' => (bool) $registration,
                'registration' => $registration
            ],
            'message' => $registration ? 'Student is registered' : 'Student is not registered'
        ]);
    }

    /**
     * Get all events (Public - for registration form)
     */
    public function getAvailableEvents(): JsonResponse
    {
        $events = Event::orderBy('created_at', 'desc')->get();

        // Add image URLs and registration count
        $events = $events->map(function ($event) {
            $event->image_url = $event->event_image_url;
            $event->registration_count = $event->registrations()->count();
            return $event;
        });

        return response()->json([
            'success' => true,
            'data' => $events,
            'message' => 'Available events retrieved successfully'
        ]);
    }
}