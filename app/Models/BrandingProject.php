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
        'industry_type',
        'year',
        'project_keywords',
        'project_scopes',
        'project_link',
        'is_published'
    ];

    protected $casts = [
        'service_fees' => 'decimal:2',
        'is_published' => 'boolean'
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

    public function members(): HasMany
    {
        return $this->hasMany(BrandingProjectMember::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
