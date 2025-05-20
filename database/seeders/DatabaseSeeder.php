<?php

namespace Database\Seeders;

use App\Models\CompanyPolicy;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@demo.com',
        ]);

        CompanyPolicy::factory()->create([
            'user_id' => User::first()->id,
        ]);
    }
}
