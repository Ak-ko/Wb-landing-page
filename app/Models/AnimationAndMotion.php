<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnimationAndMotion extends Model
{
    /** @use HasFactory<\Database\Factories\ComicArtFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'animation_and_motions';

    protected $fillable = [
        'title',
        'description'
    ];

    public function images()
    {
        return $this->hasMany(AnimationAndMotionImage::class, 'animation_and_motion_id')->orderBy('order');
    }
}
