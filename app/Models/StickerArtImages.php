<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StickerArtImages extends Model
{
    /** @use HasFactory<\Database\Factories\StickerArtImagesFactory> */
    use HasFactory, HasImage;

    protected $fillable = ['image', 'sticker_art_id'];

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
     * Get the illustration art that owns the image.
     */
    public function stickerArt()
    {
        return $this->belongsTo(StickerArt::class, 'sticker_art_id');
    }
}
