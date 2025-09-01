<?php

namespace Database\Seeders;

use App\Models\ExpertiseSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpertiseSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $businessPlans = [
            ['text' => 'Logo & Branding or rebranding', 'order' => 0],
            ['text' => 'Brand Strategy & Guidelines', 'order' => 1],
            ['text' => 'Illustration or Digital Art', 'order' => 2],
            ['text' => 'Mascot Design', 'order' => 3],
            ['text' => 'Comic Art', 'order' => 4],
            ['text' => 'One-time Requests', 'order' => 5],
        ];

        $artPlans = [
            ['text' => 'Social media designs', 'order' => 0],
            ['text' => 'UI / UX Designs', 'order' => 1],
            ['text' => 'Unlimited Artworks', 'order' => 2],
            ['text' => 'Unlimited requests', 'order' => 3],
            ['text' => 'Unlimited Brands', 'order' => 4],
            ['text' => 'Unlimited Users', 'order' => 5],
        ];

        ExpertiseSection::create([
            'title' => 'Setting up your New Business?',
            'type' => 'business',
            'plans' => $businessPlans,
            'color' => '#1CB3CE',
            'order' => 0,
            'is_active' => true,
        ]);

        ExpertiseSection::create([
            'title' => 'Expanding Your Established Business?',
            'type' => 'established',
            'plans' => $artPlans,
            'color' => '#EF4444', // This would be the chillie-red color
            'order' => 1,
            'is_active' => true,
        ]);
    }
}
