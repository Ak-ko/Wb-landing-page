<?php

namespace App\Models;

use App\Traits\HasImage;
use App\Traits\HasVideo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnimationAndMotionImage extends Model
{
    /** @use HasFactory<\Database\Factories\AnimationAndMotionImageFactory> */
    use HasFactory, HasVideo;

    protected $fillable = ['image', 'animation_and_motion_id', 'order'];

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
     * Get the animation and motion that owns the image.
     */
    public function animationAndMotion()
    {
        return $this->belongsTo(AnimationAndMotion::class, 'animation_and_motion_id');
    }
}
