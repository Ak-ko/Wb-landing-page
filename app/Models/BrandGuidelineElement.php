<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BrandGuidelineElement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'order'
    ];

    public function items()
    {
        return $this->hasMany(BrandGuidelineElementItem::class);
    }
}
