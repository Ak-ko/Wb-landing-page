<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPackages extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_text',
        'price',
        'currency',
        'color',
        'is_recommended',
        'is_discount',
        'discount_price_text',
        'discount_description',
        'discount_end_date',
        'business_brand_guideline_id',
        'brand_strategy_id',
    ];

    protected $casts = [
        'price' => 'double',
        'is_recommended' => 'boolean',
        'is_discount' => 'boolean',
    ];

    public function businessPackageItems()
    {
        return $this->belongsToMany(BusinessPackageItems::class, 'pivot_business_package_items', 'business_package_id', 'business_package_item_id', 'id', 'id');
    }

    public function brandGuideline()
    {
        return $this->belongsTo(BusinessBrandGuideline::class, 'business_brand_guideline_id', 'id');
    }

    public function brandStrategy()
    {
        return $this->belongsTo(BrandStrategy::class, 'brand_strategy_id', 'id');
    }

    public function durations()
    {
        return $this->hasMany(BusinessPackageDuration::class, 'business_package_id', 'id');
    }

    public function discount($query)
    {
        $query
            ->where('is_discount', true)
            ->where('discount_end_date', '>=', now());
    }
}
