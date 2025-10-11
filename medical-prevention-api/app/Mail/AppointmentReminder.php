<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $reminderType;

    /**
     * Create a new message instance.
     */
    public function __construct(Booking $booking, string $reminderType)
    {
        $this->booking = $booking;
        $this->reminderType = $reminderType;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->reminderType === 'day_before' 
            ? 'Appointment Reminder - Tomorrow' 
            : 'Appointment Reminder - In 1 Hour';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-reminder',
            with: [
                'booking' => $this->booking,
                'reminderType' => $this->reminderType,
                'user' => $this->booking->user,
                'appointmentType' => $this->booking->appointmentType,
                'day' => $this->booking->day,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
