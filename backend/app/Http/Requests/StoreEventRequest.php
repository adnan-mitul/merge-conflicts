<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Add your authorization logic here
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'event_time' => 'required|date_format:H:i',
            'location_type' => 'required|in:offline,virtual',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'capacity' => 'required|integer|min:1',
            'organizer' => 'required|string|max:255',
            'event_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            'event_features' => 'required|array|min:1',
            'event_features.*' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'start_date.after_or_equal' => 'Start date must be today or a future date.',
            'end_date.after_or_equal' => 'End date must be on or after the start date.',
            'event_features.required' => 'At least one event feature is required.',
            'event_features.*.required' => 'Event feature cannot be empty.',
            'location_type.in' => 'Location type must be either offline or virtual.',
        ];
    }
}