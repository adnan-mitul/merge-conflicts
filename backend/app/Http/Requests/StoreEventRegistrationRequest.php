<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRegistrationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('event_registrations')->where(function ($query) {
                    return $query->where('event_id', $this->input('event_id'));
                })
            ],
            'student_id' => [
                'required',
                'string',
                'max:50',
                Rule::unique('event_registrations')->where(function ($query) {
                    return $query->where('event_id', $this->input('event_id'));
                })
            ],
            'phone_number' => 'required|string|max:20',
            'department' => 'required|string|max:100',
            'semester' => 'required|string|max:20'
        ];
    }


    public function messages()
    {
        return [
            'email.unique' => 'This email is already registered for this event.',
            'student_id.unique' => 'This student ID is already registered for this event.',
            'event_id.exists' => 'The selected event does not exist.'
        ];
    }
}