<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class IllustrationArt extends Model
{
    /** @use HasFactory<\Database\Factories\IllustrationArtFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'illustration_art';

    protected $fillable = [
        'title',
        'description'
    ];


    public function images()
    {
        return $this->hasMany(IllustrationArtImages::class, 'illustration_art_id');
    }
}
