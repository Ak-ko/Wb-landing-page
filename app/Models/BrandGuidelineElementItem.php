<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandGuidelineElementItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_guideline_element_id'
    ];

    public function brandGuidelineElement()
    {
        return $this->belongsTo(BrandGuidelineElement::class);
    }
}
