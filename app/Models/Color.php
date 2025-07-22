<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Color extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'color',
        'type',
    ];

    /**
     * Scope to get colors for white background
     */
    public function scopeForWhiteBackground($query)
    {
        return $query->where('type', 'white_bg');
    }

    /**
     * Scope to get colors for black background
     */
    public function scopeForBlackBackground($query)
    {
        return $query->where('type', 'black_bg');
    }

    /**
     * Get colors grouped by type
     */
    public static function getGroupedColors()
    {
        return [
            'white_bg' => self::forWhiteBackground()->get(),
            'black_bg' => self::forBlackBackground()->get(),
        ];
    }
}
