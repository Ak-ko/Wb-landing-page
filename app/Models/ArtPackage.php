<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Enums\ArtPackageType;

class ArtPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'color',
    ];

    protected $casts = [
        'type' => ArtPackageType::class,
    ];

    public function items(): HasMany
    {
        return $this->hasMany(ArtPackageItem::class);
    }

    public function prices(): HasMany
    {
        return $this->hasMany(ArtPackagePrice::class);
    }
}
