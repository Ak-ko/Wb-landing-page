<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Taggable extends Model
{
    use HasFactory;

    protected $fillable = ['tag_id', 'taggable_id', 'taggable_type'];

    /**
     * Get the tag associated with this taggable.
     */
    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }

    /**
     * Get the taggable model.
     */
    public function taggable(): MorphTo
    {
        return $this->morphTo();
    }
}
