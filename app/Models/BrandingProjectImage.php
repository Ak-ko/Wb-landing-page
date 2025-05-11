<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandingProjectImage extends Model
{
    use HasFactory;

    protected $fillable = ['branding_project_id', 'image', 'is_primary', 'order'];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function brandingProject(): BelongsTo
    {
        return $this->belongsTo(BrandingProject::class);
    }
}
