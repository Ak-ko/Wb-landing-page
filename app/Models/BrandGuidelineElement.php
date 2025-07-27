<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BrandGuidelineElement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'order',
        'business_brand_guideline_id'
    ];

    public function businessBrandGuideline()
    {
        return $this->belongsTo(BusinessBrandGuideline::class);
    }

    public function items()
    {
        return $this->hasMany(BrandGuidelineElementItem::class)->orderBy('order', 'asc');
    }
}
