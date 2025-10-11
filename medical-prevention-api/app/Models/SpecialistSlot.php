<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialistSlot extends Model
{
    protected $fillable = [
        'specialist_id',
        'slot_id', 
        'appointment_type_id',
        'is_available',
        'meeting_count',
        'last_meeting_at'
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'last_meeting_at' => 'datetime'
    ];

    // Relationships
    public function specialist()
    {
        return $this->belongsTo(Specialist::class);
    }

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }

    public function appointmentType()
    {
        return $this->belongsTo(AppointmentType::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'slot_id', 'slot_id');
    }
}
