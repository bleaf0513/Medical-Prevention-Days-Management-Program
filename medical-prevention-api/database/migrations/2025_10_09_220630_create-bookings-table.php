<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('type_id')->constrained('appointment_types')->cascadeOnDelete();
            $table->foreignId('day_id')->constrained('days')->cascadeOnDelete();
            $table->foreignId('slot_id')->constrained('slots')->cascadeOnDelete();
            $table->string('booking_code')->unique();
            $table->boolean('confirmed')->default(true);
            $table->boolean('attended')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('bookings');
    }
};
