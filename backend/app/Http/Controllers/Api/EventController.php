<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of events
     */
    public function index(): JsonResponse
    {
        $events = Event::orderBy('created_at', 'desc')->get();

        // Add image URLs to the response
        $events = $events->map(function ($event) {
            $event->image_url = $event->event_image_url;
            return $event;
        });

        return response()->json([
            'success' => true,
            'data' => $events,
            'message' => 'Events retrieved successfully'
        ]);
    }

    /**
     * Store a newly created event
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            // Handle file upload
            if ($request->hasFile('event_image')) {
                $image = $request->file('event_image');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();

                // Store in storage/app/public/events
                $image->storeAs('events', $imageName, 'public');
                $validatedData['event_image'] = $imageName;
            }

            $event = Event::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => [
                    'event' => $event,
                    'image_url' => $event->event_image_url
                ],
                'message' => 'Event created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified event
     */
    public function show(Event $event): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'event' => $event,
                'image_url' => $event->event_image_url
            ],
            'message' => 'Event retrieved successfully'
        ]);
    }

    /**
     * Update the specified event
     */
    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            // Handle file upload
            if ($request->hasFile('event_image')) {
                // Delete old image if exists
                if ($event->event_image) {
                    Storage::disk('public')->delete('events/' . $event->event_image);
                }

                $image = $request->file('event_image');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $image->storeAs('events', $imageName, 'public');
                $validatedData['event_image'] = $imageName;
            }

            $event->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => [
                    'event' => $event->fresh(),
                    'image_url' => $event->event_image_url
                ],
                'message' => 'Event updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified event
     */
    public function destroy(Event $event): JsonResponse
    {
        try {
            // Delete image if exists
            if ($event->event_image) {
                Storage::disk('public')->delete('events/' . $event->event_image);
            }

            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete event',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}