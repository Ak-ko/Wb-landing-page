<?php

namespace App\Models;

use App\Enums\TagType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'color', 'text_color', 'type'];

    protected $casts = [
        'type' => TagType::class,
    ];

    public function brandingProjects(): MorphToMany
    {
        return $this->morphedByMany(BrandingProject::class, 'taggable');
    }

    public function blogs(): MorphToMany
    {
        return $this->morphedByMany(Blog::class, 'taggable');
    }

    /**
     * Get all tags that are associated with branding projects.
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getBrandingProjectTags()
    {
        return self::whereHas('brandingProjects')->get();
    }

    /**
     * Get branding projects that have this specific tag.
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getBrandingProjects()
    {
        return $this->brandingProjects()->get();
    }
}
