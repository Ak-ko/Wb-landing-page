<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'is_published',
        'color'
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function images(): HasMany
    {
        return $this->hasMany(BlogImage::class);
    }

    public function primaryImage()
    {
        return $this->hasMany(BlogImage::class)->where('is_primary', true)->first();
    }
}
