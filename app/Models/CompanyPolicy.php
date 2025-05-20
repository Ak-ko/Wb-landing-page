<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyPolicy extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyPolicyFactory> */
    use HasFactory;

    protected $fillable = [
        'mission',
        'vision',
        'core_values',
        'terms_and_conditions',
        'user_id',
    ];
}
