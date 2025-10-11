<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model {
    protected $fillable = ['booking_id','type','sent_at','status'];
    protected $casts = ['sent_at'=>'datetime'];
    public function booking(){ return $this->belongsTo(Booking::class,'booking_id'); }
}
