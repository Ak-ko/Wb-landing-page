<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandingProjectMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'branding_project_id',
        'team_member_id',
        'is_lead',
    ];

    public function brandingProject(): BelongsTo
    {
        return $this->belongsTo(BrandingProject::class);
    }
}
