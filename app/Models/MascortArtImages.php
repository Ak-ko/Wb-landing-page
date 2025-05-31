<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MascortArtImages extends Model
{
    /** @use HasFactory<\Database\Factories\MascortArtImagesFactory> */
    use HasFactory, HasImage;

    protected $fillable = [
        'mascort_art_id',
        'image',
        'is_primary',
        'is_mascot',
    ];

    public function mascortArt()
    {
        return $this->belongsTo(MascortArt::class);
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
}
