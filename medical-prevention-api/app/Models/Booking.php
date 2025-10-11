<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model {
    protected $fillable = ['user_id','type_id','day_id','slot_id','booking_code','confirmed','attended'];
    protected $casts = ['confirmed'=>'boolean','attended'=>'boolean'];
    public function user(){ return $this->belongsTo(User::class); }
    public function appointmentType(){ return $this->belongsTo(AppointmentType::class,'type_id'); }
    public function day(){ return $this->belongsTo(Day::class,'day_id'); }
    public function slot(){ return $this->belongsTo(Slot::class,'slot_id'); }
    public function notifications(){ return $this->hasMany(Notification::class,'booking_id'); }
}
