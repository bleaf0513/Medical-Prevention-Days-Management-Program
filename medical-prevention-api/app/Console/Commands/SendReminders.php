<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use App\Models\Booking;
use App\Mail\BookingConfirmed;
use App\Mail\BookingCancelled;
use App\Mail\ReminderMail; // create similar to BookingConfirmed if you want
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendReminders extends Command {
    protected $signature = 'reminders:send';
    protected $description = 'Send reminders 1 day and 1 hour before appointments';
    public function handle() {
        $now = Carbon::now();
        // day-before
        $targetDate = $now->copy()->addDay()->toDateString();
        $bookingsDayBefore = Booking::with('user','day','slot')->whereHas('day', fn($q)=>$q->whereDate('date',$targetDate))->get();
        foreach($bookingsDayBefore as $b){
            // send day-before mail
            Mail::to($b->user->email)->send(new \App\Mail\ReminderMail($b,'day'));
        }
        // one-hour reminders
        $targetDateTime = $now->copy()->addHour();
        $bookings = Booking::with(['user','day','slot'])->get();
        foreach($bookings as $b){
            $appointmentDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $b->day->date->format('Y-m-d') . ' ' . $b->slot->start_time);
            if ($appointmentDateTime->between($targetDateTime->copy()->subMinutes(1), $targetDateTime->copy()->addMinutes(1))) {
                Mail::to($b->user->email)->send(new \App\Mail\ReminderMail($b,'hour'));
            }
        }
        $this->info('Reminders processed');
    }
}
