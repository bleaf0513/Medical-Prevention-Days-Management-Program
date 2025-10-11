<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Specialist extends Model {
    protected $fillable = ['first_name','last_name','email','type_id','specialty_id'];
    
    public function appointmentType(){ 
        return $this->belongsTo(AppointmentType::class,'type_id'); 
    }
    
    public function specialty()
    {
        return $this->belongsTo(SpecialistSpecialty::class, 'specialty_id');
    }
    
    public function specialistSlots()
    {
        return $this->hasMany(SpecialistSlot::class);
    }
    
    public function bookings()
    {
        return $this->hasManyThrough(Booking::class, SpecialistSlot::class, 'specialist_id', 'slot_id', 'id', 'slot_id');
    }
    
    // Get total meeting count for this specialist
    public function getTotalMeetingsAttribute()
    {
        return $this->specialistSlots()->sum('meeting_count');
    }
    
    // Get available slots count
    public function getAvailableSlotsCountAttribute()
    {
        return $this->specialistSlots()->where('is_available', true)->count();
    }
}
