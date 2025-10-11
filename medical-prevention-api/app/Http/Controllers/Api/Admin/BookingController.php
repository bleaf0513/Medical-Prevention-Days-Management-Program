<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Booking,Slot};
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingCancelled;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $q = Booking::with(['user','appointmentType','day','slot']);
        if ($request->has('search')) {
            $term = $request->search;
            $q->whereHas('user', fn($qq)=>$qq->where('last_name','like',"%$term%")->orWhere('email','like',"%$term%"))->orWhere('booking_code','like',"%$term%");
        }
        
        $bookings = $q->orderByDesc('created_at')->get();
        
        // Transform bookings to match frontend expectations
        $transformedBookings = $bookings->map(function($booking) {
            return [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'visitor_first_name' => $booking->user->first_name ?? '',
                'visitor_last_name' => $booking->user->last_name ?? '',
                'visitor_email' => $booking->user->email ?? '',
                'type_name' => $booking->appointmentType->name ?? '',
                'day_date' => $booking->day->date ?? '',
                'time' => $booking->slot->start_time . ' - ' . $booking->slot->end_time,
                'confirmed' => $booking->confirmed,
                'attended' => $booking->attended,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at
            ];
        });
        
        return response()->json($transformedBookings);
    }

    public function markAttendance($id){
        $b = Booking::findOrFail($id); $b->attended = true; $b->save(); return response()->json(['message'=>'Attendance marked','booking'=>$b]);
    }

    public function cancel($id){
        $b = Booking::findOrFail($id); $slot = Slot::find($b->slot_id); if ($slot && $slot->booked>0){ $slot->decrement('booked'); } $b->delete(); 
        // Mail::to($b->user->email)->send(new BookingCancelled($b)); // Temporarily disabled
        return response()->json(['message'=>'Booking cancelled']); 
    }
}
