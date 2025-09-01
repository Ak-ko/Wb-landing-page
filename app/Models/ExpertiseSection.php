<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpertiseSection extends Model
{
    protected $fillable = [
        'title',
        'type',
        'plans',
        'color',
        'order',
        'is_active',
    ];

    protected $casts = [
        'plans' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
