<?php

namespace Database\Seeders;

use App\Models\AvailableWork;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                'label' => 'Brand Guidelines',
                'color' => '#FEC901',
                'order' => 1,
                'is_published' => true,
            ],
            [
                'label' => 'Social Media Designs',
                'color' => '#FF5A01',
                'order' => 2,
                'is_published' => true,
            ],
            [
                'label' => 'Logos',
                'color' => '#1274EF',
                'order' => 3,
                'is_published' => true,
            ],
            [
                'label' => 'Branding',
                'color' => '#FF1466',
                'order' => 4,
                'is_published' => true,
            ],
            [
                'label' => 'Rebranding',
                'color' => '#101010',
                'order' => 5,
                'is_published' => true,
            ],
        ];

        foreach ($availableWorks as $work) {
            AvailableWork::create($work);
        }
    }
}
