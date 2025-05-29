<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PivotBusinessBrandGuidelineElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_brand_guideline_id',
        'business_brand_guideline_element_id'
    ];

    public function businessBrandGuideline()
    {
        return $this->belongsTo(BusinessBrandGuideline::class);
    }

    public function brandGuidelineElement()
    {
        return $this->belongsTo(BrandGuidelineElement::class);
    }
}
