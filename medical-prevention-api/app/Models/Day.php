<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Day extends Model {
    protected $fillable = ['date','start_time','end_time','break_start','break_end'];
    protected $casts = ['date' => 'date'];
    public function slots(){ return $this->hasMany(Slot::class,'day_id'); }
    public function bookings(){ return $this->hasMany(Booking::class,'day_id'); }
}
