<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    /** @use HasFactory<\Database\Factories\TeamMemberFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'designation',
        'mascot_image',
        'email',
        'phone',
        'social_links',
        'image',
        'color',
        'is_active'
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_active' => 'boolean'
    ];
}
