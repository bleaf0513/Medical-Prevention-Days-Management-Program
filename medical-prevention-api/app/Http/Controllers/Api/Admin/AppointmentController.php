<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{AppointmentType,Day,Specialist,SpecialistSlot,SpecialistSpecialty};
use App\Services\SlotGenerator;

class AppointmentController extends Controller
{
    public function createType(Request $request)
    {
        $request->validate([
            'name'=>'required|string|unique:appointment_types,name',
            'average_duration'=>'required|int|min:1',
            'specialists_count'=>'required|int|min:1',
            'description'=>'nullable|string',
            'selected_specialists'=>'nullable|array',
            'selected_specialists.*'=>'exists:specialists,id',
            'selected_categories'=>'nullable|array',
            'selected_categories.*'=>'exists:specialist_specialties,id'
        ]);
        
        $type = AppointmentType::create($request->only(['name','average_duration','specialists_count','description']));
        
        // Link selected specialists to this appointment type
        if ($request->has('selected_specialists') && is_array($request->selected_specialists)) {
            Specialist::whereIn('id', $request->selected_specialists)
                ->update(['type_id' => $type->id]);
        }
        
        return response()->json(['type'=>$type->load('specialists.specialty')],201);
    }

    public function indexTypes(){ return response()->json(AppointmentType::with('specialists.specialty')->get()); }

    public function updateType(Request $request, $id)
    {
        $type = AppointmentType::findOrFail($id);
        $request->validate([
            'name'=>'required|string|unique:appointment_types,name,'.$id,
            'average_duration'=>'required|int|min:1',
            'specialists_count'=>'required|int|min:1',
            'description'=>'nullable|string',
            'selected_specialists'=>'nullable|array',
            'selected_specialists.*'=>'exists:specialists,id',
            'selected_categories'=>'nullable|array',
            'selected_categories.*'=>'exists:specialist_specialties,id'
        ]);
        
        $type->update($request->only(['name','average_duration','specialists_count','description']));
        
        // Unlink all specialists from this appointment type first
        Specialist::where('type_id', $type->id)->update(['type_id' => null]);
        
        // Link selected specialists to this appointment type
        if ($request->has('selected_specialists') && is_array($request->selected_specialists)) {
            Specialist::whereIn('id', $request->selected_specialists)
                ->update(['type_id' => $type->id]);
        }
        
        return response()->json(['message'=>'Appointment type updated','type'=>$type->load('specialists.specialty')]);
    }

    public function deleteType($id)
    {
        $type = AppointmentType::findOrFail($id);
        $type->delete();
        return response()->json(['message'=>'Appointment type deleted']);
    }

    public function createDay(Request $request)
    {
        $request->validate([
            'date'=>'required|date|unique:days,date',
            'start_time'=>'required|date_format:H:i',
            'end_time'=>'required|date_format:H:i|after:start_time',
            'break_start'=>'nullable|date_format:H:i',
            'break_end'=>'nullable|date_format:H:i|after:break_start'
        ]);
        
        try {
            $day = Day::create($request->only(['date','start_time','end_time','break_start','break_end']));
            SlotGenerator::generateForDay($day);
            return response()->json(['message'=>'Day created & slots generated','day'=>$day],201);
        } catch (\Exception $e) {
            return response()->json(['message'=>'Failed to create day: ' . $e->getMessage()], 500);
        }
    }

    public function updateDay(Request $request, $id)
    {
        try {
            $day = Day::findOrFail($id);
            $request->validate([
                'date' => 'required|date',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'break_start' => 'nullable|date_format:H:i',
                'break_end' => 'nullable|date_format:H:i|after:break_start'
            ]);
            
            $day->update($request->only(['date', 'start_time', 'end_time', 'break_start', 'break_end']));
            return response()->json(['message' => 'Day updated successfully', 'day' => $day]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Day not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update day: ' . $e->getMessage()], 500);
        }
    }

    public function deleteDay($id)
    {
        $day = Day::findOrFail($id);
        $day->delete();
        return response()->json(['message' => 'Day deleted successfully']);
    }

    public function indexDays(){ return response()->json(Day::with('slots')->get()); }

    public function showDay($id)
    {
        try {
            $day = Day::findOrFail($id);
            return response()->json(['day' => $day]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Day not found'], 404);
        }
    }

    public function regenerateSlots($day_id){ $day = Day::findOrFail($day_id); SlotGenerator::generateForDay($day); return response()->json(['message'=>'Slots regenerated']); }

    // Specialist Specialties Management
    public function indexSpecialties()
    {
        return response()->json(SpecialistSpecialty::all());
    }

    // Specialist Management
    public function createSpecialist(Request $request)
    {
        $request->validate([
            'first_name'=>'required|string',
            'last_name'=>'required|string',
            'email'=>'nullable|email',
            'specialty_id'=>'required|exists:specialist_specialties,id'
        ]);
        $specialist = Specialist::create($request->only(['first_name','last_name','email','specialty_id']));
        return response()->json(['specialist'=>$specialist->load('specialty')],201);
    }

    public function indexSpecialists(){ return response()->json(Specialist::with(['appointmentType', 'specialty', 'specialistSlots'])->get()); }

    public function updateSpecialist(Request $request, $id)
    {
        $specialist = Specialist::findOrFail($id);
        $request->validate([
            'first_name'=>'required|string',
            'last_name'=>'required|string',
            'email'=>'nullable|email',
            'specialty_id'=>'required|exists:specialist_specialties,id'
        ]);
        $specialist->update($request->only(['first_name','last_name','email','specialty_id']));
        return response()->json(['message'=>'Specialist updated','specialist'=>$specialist->load('specialty')]);
    }

    public function deleteSpecialist($id)
    {
        $specialist = Specialist::findOrFail($id);
        $specialist->delete();
        return response()->json(['message'=>'Specialist deleted']);
    }

    // Specialist Slots Management
    public function indexSpecialistSlots()
    {
        $specialists = Specialist::with(['specialistSlots.slot', 'specialistSlots.appointmentType', 'appointmentType'])
            ->get();
            
        // Transform data to show each specialist-appointment type combination
        $result = [];
        foreach ($specialists as $specialist) {
            // If specialist has appointment type, show that combination
            if ($specialist->appointmentType) {
                $result[] = [
                    'id' => $specialist->id . '_' . $specialist->appointmentType->id,
                    'specialist_id' => $specialist->id,
                    'first_name' => $specialist->first_name,
                    'last_name' => $specialist->last_name,
                    'email' => $specialist->email,
                    'appointment_type' => $specialist->appointmentType,
                    'specialty' => $specialist->specialty,
                    'specialist_slots' => $specialist->specialistSlots->where('appointment_type_id', $specialist->appointmentType->id),
                    'total_slots' => $specialist->specialistSlots->where('appointment_type_id', $specialist->appointmentType->id)->count(),
                    'available_slots' => $specialist->specialistSlots->where('appointment_type_id', $specialist->appointmentType->id)->where('is_available', true)->count(),
                ];
            }
        }
            
        return response()->json($result);
    }

    public function createSpecialistSlots(Request $request)
    {
        $request->validate([
            'specialist_id' => 'required|exists:specialists,id',
            'slot_ids' => 'required|array',
            'slot_ids.*' => 'exists:slots,id',
            'appointment_type_id' => 'required|exists:appointment_types,id'
        ]);

        $specialistSlots = [];
        foreach ($request->slot_ids as $slotId) {
            $specialistSlots[] = SpecialistSlot::create([
                'specialist_id' => $request->specialist_id,
                'slot_id' => $slotId,
                'appointment_type_id' => $request->appointment_type_id,
                'is_available' => true,
                'meeting_count' => 0
            ]);
        }

        return response()->json(['message' => 'Specialist slots created', 'slots' => $specialistSlots], 201);
    }

    public function updateSpecialistSlotAvailability(Request $request, $id)
    {
        $specialistSlot = SpecialistSlot::findOrFail($id);
        $request->validate(['is_available' => 'required|boolean']);
        
        $specialistSlot->update(['is_available' => $request->is_available]);
        
        return response()->json(['message' => 'Availability updated', 'slot' => $specialistSlot]);
    }
}
