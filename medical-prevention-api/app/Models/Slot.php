<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Slot extends Model {
    protected $fillable = ['day_id','type_id','start_time','end_time','capacity','booked'];
    protected $appends = ['available'];
    public function day(){ return $this->belongsTo(Day::class,'day_id'); }
    public function appointmentType(){ return $this->belongsTo(AppointmentType::class,'type_id'); }
    public function bookings(){ return $this->hasMany(Booking::class); }
    public function getAvailableAttribute(){ return max($this->capacity - $this->booked, 0); }
}
