<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComicArtImages extends Model
{
    /** @use HasFactory<\Database\Factories\ComicArtImagesFactory> */
    use HasFactory, HasImage;

    protected $fillable = ['image', 'comic_art_id'];

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
    public function comicArt()
    {
        return $this->belongsTo(ComicArt::class, 'illustration_art_id');
    }
}
