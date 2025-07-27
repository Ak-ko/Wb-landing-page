<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BrandStrategyElement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'order',
        'brand_strategy_id',
    ];

    public function brandStrategy()
    {
        return $this->belongsTo(BrandStrategy::class, 'brand_strategy_id');
    }

    public function items()
    {
        return $this->hasMany(BrandStrategyElementItem::class, 'brand_strategy_element_id')->orderBy('order', 'asc');
    }
}
