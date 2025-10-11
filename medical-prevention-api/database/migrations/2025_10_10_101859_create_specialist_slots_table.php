<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('specialist_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('specialist_id')->constrained('specialists')->cascadeOnDelete();
            $table->foreignId('slot_id')->constrained('slots')->cascadeOnDelete();
            $table->foreignId('appointment_type_id')->constrained('appointment_types')->cascadeOnDelete();
            $table->boolean('is_available')->default(true);
            $table->integer('meeting_count')->default(0);
            $table->timestamp('last_meeting_at')->nullable();
            $table->timestamps();
            
            // Ensure unique combination
            $table->unique(['specialist_id', 'slot_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specialist_slots');
    }
};
