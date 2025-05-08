<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory, HasImage;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'position',
        'company',
        'description',
        'image',
        'color_tag',
    ];

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
