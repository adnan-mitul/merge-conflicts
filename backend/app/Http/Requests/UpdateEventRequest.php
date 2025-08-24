<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'start_date' => 'sometimes|required|date|after_or_equal:today',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'event_time' => 'sometimes|required|date_format:H:i',
            'location_type' => 'sometimes|required|in:offline,virtual',
            'location' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:100',
            'capacity' => 'sometimes|required|integer|min:1',
            'organizer' => 'sometimes|required|string|max:255',
            'event_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_features' => 'sometimes|required|array|min:1',
            'event_features.*' => 'required|string|max:100',
        ];
    }
}