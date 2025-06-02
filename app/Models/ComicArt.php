<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComicArt extends Model
{
    /** @use HasFactory<\Database\Factories\ComicArtFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'comic_art';

    protected $fillable = [
        'title',
        'description'
    ];

    public function images()
    {
        return $this->hasMany(ComicArtImages::class, 'comic_art_id');
    }
}
