<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPackageAddon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price_text',
        'price',
        'currency',
        'revision_remarks'
    ];

    protected $casts = [
        'price' => 'double'
    ];
}
