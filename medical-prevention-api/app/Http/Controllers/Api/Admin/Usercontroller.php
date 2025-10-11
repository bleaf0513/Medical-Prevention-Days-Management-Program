<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller {
    public function index(){ 
        return response()->json(User::select('id','first_name','last_name','email','phone','created_at')->get());
     }
    public function show($id){ 
        return response()->json(User::with('bookings.appointmentType','bookings.day')->findOrFail($id));
     }
}
