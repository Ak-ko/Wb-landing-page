<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BrandingProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'client_company',
        'client_name',
        'client_email',
        'client_phone',
        'service_fees',
        'service_start_date',
        'service_end_date',
    ];

    protected $casts = [
        'service_start_date' => 'date',
        'service_end_date' => 'date',
        'service_fees' => 'decimal:2',
    ];


    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function images(): HasMany
    {
        return $this->hasMany(BrandingProjectImage::class);
    }

    public function primaryImage()
    {
        return $this->hasMany(BrandingProjectImage::class)->where('is_primary', true)->first();
    }
}
