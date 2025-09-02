<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessProcess extends Model
{
    use HasFactory, HasImage;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'image',
        'color_tag',
        'step',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'step' => 'integer',
    ];

    /**
     * Get the image URL attribute.
     *
     * @return string|null
     */
    public function getImageAttribute($value)
    {
        return $this->getImageUrl($value);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
