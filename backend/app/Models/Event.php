<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'event_time',
        'location_type',
        'location',
        'category',
        'capacity',
        'organizer',
        'event_image',
        'event_features',
    ];

    protected $casts = [
        'event_features' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'event_time' => 'datetime:H:i',
    ];

    // Accessor for image URL
    public function getEventImageUrlAttribute()
    {
        return $this->event_image ? asset('storage/events/' . $this->event_image) : null;
    }
    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    // Optional: Add a method to get registration count
    public function getRegistrationCountAttribute()
    {
        return $this->registrations()->count();
    }
    // One event has many registrations
    
}