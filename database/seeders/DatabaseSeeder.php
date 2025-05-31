<?php

namespace Database\Seeders;

use App\Models\BusinessPackageAddon;
use App\Models\CompanyPolicy;
use App\Models\Tag;
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

        Tag::factory()->create([
            'name' => 'Laravel',
            'color' => '#f7df1e'
        ]);

        BusinessPackageAddon::factory(19)->create();
    }
}
