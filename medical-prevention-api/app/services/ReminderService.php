<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Notification;
use App\Mail\AppointmentReminder;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class ReminderService
{
    /**
     * Send reminders one day before appointments
     */
    public static function sendDayBeforeReminders(): void
    {
        $tomorrow = Carbon::tomorrow()->format('Y-m-d');
        
        $bookings = Booking::with(['user', 'appointmentType', 'day'])
            ->whereHas('day', function($query) use ($tomorrow) {
                $query->where('date', $tomorrow);
            })
            ->where('confirmed', true)
            ->whereDoesntHave('notifications', function($query) {
                $query->where('type', 'day_before_reminder');
            })
            ->get();

        foreach ($bookings as $booking) {
            try {
                Mail::to($booking->user->email)->send(new AppointmentReminder($booking, 'day_before'));
                
                // Log the notification
                Notification::create([
                    'booking_id' => $booking->id,
                    'type' => 'day_before_reminder',
                    'sent_date' => now(),
                    'status' => 'sent'
                ]);
                
                \Log::info("Day before reminder sent to {$booking->user->email} for booking {$booking->booking_code}");
            } catch (\Exception $e) {
                \Log::error("Failed to send day before reminder to {$booking->user->email}: " . $e->getMessage());
                
                // Log failed notification
                Notification::create([
                    'booking_id' => $booking->id,
                    'type' => 'day_before_reminder',
                    'sent_date' => now(),
                    'status' => 'failed'
                ]);
            }
        }
    }

    /**
     * Send reminders one hour before appointments
     */
    public static function sendHourBeforeReminders(): void
    {
        $now = Carbon::now();
        $oneHourFromNow = $now->copy()->addHour();
        
        $bookings = Booking::with(['user', 'appointmentType', 'day'])
            ->whereHas('day', function($query) use ($now) {
                $query->where('date', $now->format('Y-m-d'));
            })
            ->where('confirmed', true)
            ->whereDoesntHave('notifications', function($query) {
                $query->where('type', 'hour_before_reminder');
            })
            ->get()
            ->filter(function($booking) use ($now, $oneHourFromNow) {
                $bookingTime = Carbon::createFromFormat('H:i:s', $booking->time);
                $appointmentDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $booking->day->date . ' ' . $bookingTime->format('H:i:s'));
                
                return $appointmentDateTime->between($now, $oneHourFromNow);
            });

        foreach ($bookings as $booking) {
            try {
                Mail::to($booking->user->email)->send(new AppointmentReminder($booking, 'hour_before'));
                
                // Log the notification
                Notification::create([
                    'booking_id' => $booking->id,
                    'type' => 'hour_before_reminder',
                    'sent_date' => now(),
                    'status' => 'sent'
                ]);
                
                \Log::info("Hour before reminder sent to {$booking->user->email} for booking {$booking->booking_code}");
            } catch (\Exception $e) {
                \Log::error("Failed to send hour before reminder to {$booking->user->email}: " . $e->getMessage());
                
                // Log failed notification
                Notification::create([
                    'booking_id' => $booking->id,
                    'type' => 'hour_before_reminder',
                    'sent_date' => now(),
                    'status' => 'failed'
                ]);
            }
        }
    }
}
