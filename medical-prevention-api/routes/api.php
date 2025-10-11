<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AppointmentController;
use App\Http\Controllers\Api\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Api\Admin\UserController;

// Test route to verify API is working
Route::get('test', function () {
    return response()->json(['message' => 'API is working!', 'status' => 'success']);
});

Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);

Route::get('appointments',[BookingController::class,'available']);
Route::get('appointment-types',[AppointmentController::class,'indexTypes']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('book',[BookingController::class,'book']);
    Route::get('bookings',[BookingController::class,'myBookings']);
});

Route::prefix('admin')->group(function(){
    Route::post('login',[AdminAuthController::class,'login']);
    // Route::post('register',[AdminAuthController::class,'register']);
    Route::middleware('auth:sanctum')->group(function(){
        Route::post('register',[AdminAuthController::class,'register']);
        Route::get('list',[AdminAuthController::class,'list']);
        Route::put('{id}',[AdminAuthController::class,'update']);
        Route::delete('{id}',[AdminAuthController::class,'destroy']);

        Route::post('appointment-types',[AppointmentController::class,'createType']);
        Route::get('appointment-types',[AppointmentController::class,'indexTypes']);
        Route::put('appointment-types/{id}',[AppointmentController::class,'updateType']);
        Route::delete('appointment-types/{id}',[AppointmentController::class,'deleteType']);
        
        Route::get('specialist-specialties',[AppointmentController::class,'indexSpecialties']);
        Route::post('specialists',[AppointmentController::class,'createSpecialist']);
        Route::get('specialists',[AppointmentController::class,'indexSpecialists']);
        Route::put('specialists/{id}',[AppointmentController::class,'updateSpecialist']);
        Route::delete('specialists/{id}',[AppointmentController::class,'deleteSpecialist']);
        
        Route::post('days',[AppointmentController::class,'createDay']);
        Route::get('days',[AppointmentController::class,'indexDays']);
        Route::get('days/{id}',[AppointmentController::class,'showDay']);
        Route::put('days/{id}',[AppointmentController::class,'updateDay']);
        Route::delete('days/{id}',[AppointmentController::class,'deleteDay']);
        Route::post('generate-slots/{day_id}',[AppointmentController::class,'regenerateSlots']);

        Route::get('bookings',[AdminBookingController::class,'index']);
        Route::put('bookings/{id}/attendance',[AdminBookingController::class,'markAttendance']);
        Route::delete('bookings/{id}',[AdminBookingController::class,'cancel']);

        Route::get('users',[UserController::class,'index']);
        Route::get('users/{id}',[UserController::class,'show']);
        
        // Specialist Slots Management
        Route::get('specialist-slots',[AppointmentController::class,'indexSpecialistSlots']);
        Route::post('specialist-slots',[AppointmentController::class,'createSpecialistSlots']);
        Route::put('specialist-slots/{id}/availability',[AppointmentController::class,'updateSpecialistSlotAvailability']);
    });
});
