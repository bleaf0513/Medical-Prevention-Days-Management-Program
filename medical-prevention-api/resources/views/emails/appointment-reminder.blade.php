<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Reminder</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .booking-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Medical Prevention Appointment Reminder</h1>
    </div>
    
    <div class="content">
        <h2>Hello {{ $user->first_name }} {{ $user->last_name }}!</h2>
        
        @if($reminderType === 'day_before')
            <div class="highlight">
                <strong>⏰ Reminder:</strong> You have a medical prevention appointment tomorrow!
            </div>
        @else
            <div class="highlight">
                <strong>⏰ Reminder:</strong> You have a medical prevention appointment in 1 hour!
            </div>
        @endif
        
        <div class="booking-details">
            <h3>📋 Appointment Details</h3>
            <p><strong>Booking Code:</strong> <code>{{ $booking->booking_code }}</code></p>
            <p><strong>Appointment Type:</strong> {{ $appointmentType->name }}</p>
            <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($day->date)->format('l, F j, Y') }}</p>
            <p><strong>Time:</strong> {{ \Carbon\Carbon::createFromFormat('H:i:s', $booking->time)->format('g:i A') }}</p>
            <p><strong>Duration:</strong> {{ $appointmentType->average_duration }} minutes</p>
            
            @if($appointmentType->description)
                <p><strong>Description:</strong> {{ $appointmentType->description }}</p>
            @endif
        </div>
        
        <div class="highlight">
            <h4>📝 Important Notes:</h4>
            <ul>
                <li>Please arrive 10 minutes before your scheduled time</li>
                <li>Bring a valid ID and your booking code</li>
                <li>If you need to cancel or reschedule, please contact us as soon as possible</li>
            </ul>
        </div>
        
        <p>We look forward to seeing you for your medical prevention appointment!</p>
        
        <p>Best regards,<br>
        Medical Prevention Team</p>
    </div>
    
    <div class="footer">
        <p>This is an automated reminder. Please do not reply to this email.</p>
        <p>If you have any questions, please contact our support team.</p>
    </div>
</body>
</html>
