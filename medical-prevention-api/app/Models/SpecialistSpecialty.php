<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialistSpecialty extends Model
{
    protected $fillable = [
        'name',
        'description'
    ];

    // Relationships
    public function specialists()
    {
        return $this->hasMany(Specialist::class, 'specialty_id');
    }
}