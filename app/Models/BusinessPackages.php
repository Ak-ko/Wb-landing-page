<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPackages extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_text',
        'price',
        'currency',
        'duration',
        'revision_remarks'
    ];

    protected $casts = [
        'price' => 'double'
    ];
}
