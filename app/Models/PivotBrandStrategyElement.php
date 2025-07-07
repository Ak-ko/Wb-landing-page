<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PivotBrandStrategyElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_strategy_id',
        'brand_strategy_element_id',
    ];

    public function brandStrategy()
    {
        return $this->belongsTo(BrandStrategy::class, 'brand_strategy_id');
    }

    public function element()
    {
        return $this->belongsTo(BrandStrategyElement::class, 'brand_strategy_element_id');
    }
}
