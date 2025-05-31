<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MascortArt extends Model
{
    /** @use HasFactory<\Database\Factories\MascortArtFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
    ];

    public function images()
    {
        return $this->hasMany(MascortArtImages::class);
    }
}
