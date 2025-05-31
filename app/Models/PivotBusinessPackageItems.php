<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PivotBusinessPackageItems extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_package_id',
        'business_package_item_id'
    ];

    public function businessPackage()
    {
        return $this->belongsTo(BusinessPackages::class);
    }

    public function businessPackageItem()
    {
        return $this->belongsTo(BusinessPackageItems::class);
    }
}
