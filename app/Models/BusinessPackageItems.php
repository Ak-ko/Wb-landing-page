<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPackageItems extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function businessPackage()
    {
        return $this->belongsToMany(BusinessPackages::class, 'pivot_business_package_items',  'business_package_item_id', 'business_package_id', 'id', 'id');
    }
}
