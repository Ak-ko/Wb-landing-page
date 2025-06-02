<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StickerArt extends Model
{
    /** @use HasFactory<\Database\Factories\StickerArtFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'sticker_art';

    protected $fillable = [
        'title',
        'description'
    ];

    public function images()
    {
        return $this->hasMany(StickerArtImages::class, 'sticker_art_id');
    }
}
