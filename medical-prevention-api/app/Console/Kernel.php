<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Send reminders one day before appointments
        $schedule->call(function () {
            \App\Services\ReminderService::sendDayBeforeReminders();
        })->dailyAt('09:00');

        // Send reminders one hour before appointments
        $schedule->call(function () {
            \App\Services\ReminderService::sendHourBeforeReminders();
        })->hourly();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
