<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {
    use HasApiTokens, Notifiable;
    protected $fillable = ['first_name','last_name','email','phone','pin'];
    protected $hidden = ['pin'];
    public function bookings() { return $this->hasMany(Booking::class); }
    public function getFullNameAttribute(){ return "{$this->first_name} {$this->last_name}"; }
}
