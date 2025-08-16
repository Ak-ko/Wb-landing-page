<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvailableWork extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'color',
        'is_published',
        'order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('created_at');
    }
}
