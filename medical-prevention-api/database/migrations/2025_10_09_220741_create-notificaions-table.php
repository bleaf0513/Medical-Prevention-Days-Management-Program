<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->string('type');
            $table->timestamp('sent_at')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('notifications');
    }
};
