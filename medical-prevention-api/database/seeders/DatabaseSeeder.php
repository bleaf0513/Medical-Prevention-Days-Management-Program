<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create test user only if it doesn't exist
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'first_name' => 'Test',
                'last_name' => 'User',
                'phone' => '1234567890',
                'pin' => '12345678',
            ]
        );

        // Seed administrator
        $this->call(AdministratorSeeder::class);

        // Seed specialist specialties
        $this->call(SpecialistSpecialtySeeder::class);
    }
}
