<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Booking, Slot, Day, AppointmentType};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmed;

class BookingController extends Controller
{
    public function available()
    {
        $days = Day::with(['slots.appointmentType'])->orderBy('date')->get();
        return response()->json($days);
    }

    public function book(Request $request)
    {
        $request->validate(['type_id'=>'required|exists:appointment_types,id','day_id'=>'required|exists:days,id','slot_id'=>'required|exists:slots,id']);
        $user = $request->user();
        if (!$user) return response()->json(['message'=>'Unauthenticated'],401);

        $exists = Booking::where('user_id',$user->id)->where('type_id',$request->type_id)->where('day_id',$request->day_id)->exists();
        if ($exists) return response()->json(['message'=>'Already booked this type for that day'],422);

        $booking = DB::transaction(function() use($request,$user){
            $slot = Slot::lockForUpdate()->findOrFail($request->slot_id);
            if ($slot->booked >= $slot->capacity) abort(422,'Slot full');
            $slot->booked++;
            $slot->save();
            return Booking::create([
                'user_id'=>$user->id,
                'type_id'=>$request->type_id,
                'day_id'=>$request->day_id,
                'slot_id'=>$slot->id,
                'booking_code'=>Str::upper(Str::random(10)),
                'confirmed'=>true
            ]);
        });

        // Mail::to($user->email)->send(new BookingConfirmed($booking)); // Temporarily disabled
        return response()->json(['message'=>'Booking confirmed','booking'=>$booking->load(['appointmentType','day','slot'])],201);
    }


    public function myBookings(Request $request)
    {
        $user = $request->user();
        $bookings = Booking::with(['appointmentType','day','slot'])->where('user_id',$user->id)->orderByDesc('created_at')->get();
        
        // Transform bookings to include flattened fields for frontend compatibility
        $transformedBookings = $bookings->map(function($booking) {
            return [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'appointment_type_id' => $booking->type_id,
                'day_id' => $booking->day_id,
                'slot_id' => $booking->slot_id,
                'confirmed' => $booking->confirmed,
                'attended' => $booking->attended,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,
                // Keep original relationships for reference
                'appointmentType' => $booking->appointmentType,
                'day' => $booking->day,
                'slot' => $booking->slot
            ];
        });
        
        return response()->json($transformedBookings);
    }
}
