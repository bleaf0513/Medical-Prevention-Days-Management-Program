<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class AppointmentType extends Model {
    protected $fillable = ['name','average_duration','description','specialists_count'];
    public function specialists(){ return $this->hasMany(Specialist::class,'type_id'); }
    public function slots(){ return $this->hasMany(Slot::class,'type_id'); }
    public function bookings(){ return $this->hasMany(Booking::class,'type_id'); }
}
