<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessBrandGuideline extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description'
    ];

    public function elements()
    {
        return $this->hasMany(BrandGuidelineElement::class);
    }

    public function businessPackages()
    {
        return $this->hasMany(BusinessPackages::class);
    }
}
