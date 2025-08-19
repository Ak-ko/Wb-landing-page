<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory;

    protected $fillable = [
        'question',
        'answer',
        'color',
        'is_published',
        'order'
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
