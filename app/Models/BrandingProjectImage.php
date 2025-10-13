<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandingProjectImage extends Model
{
    use HasFactory, HasImage;

    protected $fillable = ['branding_project_id', 'image', 'is_primary', 'order'];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function brandingProject(): BelongsTo
    {
        return $this->belongsTo(BrandingProject::class);
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::addGlobalScope('order', function ($query) {
            $query->orderBy('order', 'asc');
        });
    }

    /**
     * Get the image attribute with full URL.
     *
     * @param  string|null  $value
     * @return string|null
     */
    public function getImageAttribute($value)
    {
        if (!$value) {
            return null;
        }

        return $this->getImageUrl($value);
    }

    /**
     * Get the raw image path without Storage::url() transformation.
     * Useful for operations that need the actual stored path.
     *
     * @return string|null
     */
    public function getRawImagePath()
    {
        return $this->getRawOriginal('image');
    }
}
