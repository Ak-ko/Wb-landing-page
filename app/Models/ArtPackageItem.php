<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtPackageItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item',
        'art_package_id',
    ];

    public function artPackage(): BelongsTo
    {
        return $this->belongsTo(ArtPackage::class);
    }
}
