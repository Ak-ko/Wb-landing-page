<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPackageDuration extends Model
{
    /** @use HasFactory<\Database\Factories\BusinessPackageDurationFactory> */
    use HasFactory;

    protected $fillable = [
        'duration',
        'duration_remarks',
        'business_package_id',
    ];

    public function businessPackage()
    {
        return $this->belongsTo(BusinessPackages::class, 'business_package_id', 'id');
    }
}
