<?php
namespace App\Services;

use App\Models\Day;
use App\Models\AppointmentType;
use App\Models\Slot;
use Carbon\Carbon;

class SlotGenerator
{
    public static function generateForDay(Day $day): void
    {
        $types = AppointmentType::all();
        foreach ($types as $type) {
            $duration = $type->average_duration;
            $capacity = $type->specialists_count;

            $ranges = [];
            if ($day->break_start && $day->break_end) {
                $ranges[] = [$day->start_time, $day->break_start];
                $ranges[] = [$day->break_end, $day->end_time];
            } else {
                $ranges[] = [$day->start_time, $day->end_time];
            }

            foreach ($ranges as [$rangeStart, $rangeEnd]) {
                $current = Carbon::createFromFormat('H:i:s', $rangeStart);
                $end = Carbon::createFromFormat('H:i:s', $rangeEnd);

                while ($current->lessThan($end)) {
                    $slotStart = $current->format('H:i:s');
                    $slotEnd = $current->copy()->addMinutes($duration)->format('H:i:s');
                    if (Carbon::createFromFormat('H:i:s', $slotEnd)->greaterThan($end)) break;

                    Slot::firstOrCreate(
                        ['day_id'=>$day->id,'type_id'=>$type->id,'start_time'=>$slotStart],
                        ['end_time'=>$slotEnd,'capacity'=>$capacity,'booked'=>0]
                    );

                    $current->addMinutes($duration);
                }
            }
        }
    }
}
