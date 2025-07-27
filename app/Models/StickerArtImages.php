<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StickerArtImages extends Model
{
    /** @use HasFactory<\Database\Factories\StickerArtImagesFactory> */
    use HasFactory, HasImage;

    protected $fillable = [
        'sticker_art_id',
        'image',
        'order',
    ];

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
     * Get the illustration art that owns the image.
     */
    public function stickerArt()
    {
        return $this->belongsTo(StickerArt::class, 'sticker_art_id');
    }
}
