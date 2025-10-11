<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SpecialistSpecialty;

class SpecialistSpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specialties = [
            [
                'name' => 'Centro Antifumo',
                'description' => 'Smoking cessation and tobacco addiction treatment specialists'
            ],
            [
                'name' => 'Nutrizionista',
                'description' => 'Nutritional consultation and dietary planning specialists'
            ],
            [
                'name' => 'Screening Epatite C',
                'description' => 'Hepatitis C screening and prevention specialists'
            ],
            [
                'name' => 'Prevenzione Andrologica',
                'description' => 'Male health prevention and consultation specialists'
            ]
        ];

        foreach ($specialties as $specialty) {
            SpecialistSpecialty::firstOrCreate(
                ['name' => $specialty['name']],
                $specialty
            );
        }
    }
}