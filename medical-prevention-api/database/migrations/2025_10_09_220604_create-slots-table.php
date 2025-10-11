<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('day_id')->constrained('days')->cascadeOnDelete();
            $table->foreignId('type_id')->constrained('appointment_types')->cascadeOnDelete();
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('capacity')->default(1);
            $table->integer('booked')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('slots');
    }
};
