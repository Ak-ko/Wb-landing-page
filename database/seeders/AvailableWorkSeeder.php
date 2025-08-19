<?php

namespace Database\Seeders;

use App\Models\AvailableWork;
use Illuminate\Database\Seeder;

class AvailableWorkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $availableWorks = [
            [
                'label' => 'Logo Design',
                'color' => '#3b82f6',
                'text_color' => '#ffffff',
                'is_published' => true,
                'order' => 1,
            ],
            [
                'label' => 'Brand Identity',
                'color' => '#10b981',
                'text_color' => '#ffffff',
                'is_published' => true,
                'order' => 2,
            ],
            [
                'label' => 'Web Design',
                'color' => '#f59e0b',
                'text_color' => '#000000',
                'is_published' => true,
                'order' => 3,
            ],
            [
                'label' => 'Illustration',
                'color' => '#8b5cf6',
                'text_color' => '#ffffff',
                'is_published' => true,
                'order' => 4,
            ],
            [
                'label' => 'Animation',
                'color' => '#ef4444',
                'text_color' => '#ffffff',
                'is_published' => true,
                'order' => 5,
            ],
        ];

        foreach ($availableWorks as $work) {
            AvailableWork::updateOrCreate(
                ['label' => $work['label']],
                $work
            );
        }
    }
}
