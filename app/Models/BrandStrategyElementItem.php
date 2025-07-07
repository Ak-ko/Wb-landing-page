<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandStrategyElementItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'order',
        'brand_strategy_element_id',
    ];

    public function element()
    {
        return $this->belongsTo(BrandStrategyElement::class, 'brand_strategy_element_id');
    }
}
