<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class Administrator extends Authenticatable {
    use HasApiTokens, Notifiable;
    protected $fillable = ['first_name','last_name','email','password'];
    protected $hidden = ['password'];
    public function setPasswordAttribute($value){ $this->attributes['password'] = Hash::make($value); }
}
