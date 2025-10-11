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
        Schema::table('specialists', function (Blueprint $table) {
            $table->foreignId('specialty_id')->nullable()->constrained('specialist_specialties')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('specialists', function (Blueprint $table) {
            $table->dropForeign(['specialty_id']);
            $table->dropColumn('specialty_id');
        });
    }
};