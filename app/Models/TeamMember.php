<?php

namespace App\Models;

use App\Enums\TeamMemberType;
use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeamMember extends Model
{
    /** @use HasFactory<\Database\Factories\TeamMemberFactory> */
    use HasFactory, SoftDeletes, HasImage;

    protected $fillable = [
        'name',
        'designation',
        'mascot_image',
        'email',
        'phone',
        'social_links',
        'image',
        'color',
        'type',
        'order',
        'is_active',
        'bio'
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_active' => 'boolean',
        'type' => TeamMemberType::class
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
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

    public function getMascotImageAttribute($value)
    {
        if (!$value) {
            return null;
        }

        return $this->getImageUrl($value);
    }
}
