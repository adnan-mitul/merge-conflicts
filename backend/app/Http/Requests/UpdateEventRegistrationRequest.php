<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRegistrationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $registration = $this->route('registration');

        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                'unique:event_registrations,email,' . $registration->id . ',id,event_id,' . $registration->event_id
            ],
            'student_id' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                'unique:event_registrations,student_id,' . $registration->id . ',id,event_id,' . $registration->event_id
            ],
            'phone_number' => 'sometimes|required|string|max:20',
            'department' => 'sometimes|required|string|max:100',
            'semester' => 'sometimes|required|string|max:20'
        ];
    }

    public function messages()
    {
        return [
            'email.unique' => 'This email is already registered for this event.',
            'student_id.unique' => 'This student ID is already registered for this event.'
        ];
    }
}