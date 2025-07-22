<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'client_origin',
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

    protected $appends = ['team_size', 'status'];

    public function getTeamSizeAttribute()
    {
        return $this->members->count();
    }

    public function getStatusAttribute()
    {
        return $this->is_published ? 'Published' : 'Draft';
    }

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

    public function members(): BelongsToMany
    {
        return $this
            ->belongsToMany(TeamMember::class, 'branding_project_members')
            ->withPivot('is_lead');
    }


    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
