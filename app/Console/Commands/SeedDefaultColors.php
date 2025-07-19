<?php

namespace App\Console\Commands;

use App\Models\Color;
use Illuminate\Console\Command;

class SeedDefaultColors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'colors:seed-defaults {--force : Force seed even if colors already exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the colors table with default color suggestions for production';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Check if colors already exist
        if (Color::count() > 0 && !$this->option('force')) {
            $this->warn('Colors already exist in the database.');
            if (!$this->confirm('Do you want to continue and add more colors?')) {
                $this->info('Operation cancelled.');
                return;
            }
        }

        $this->info('Seeding default color suggestions...');

        // Colors for white background
        $whiteBgColors = [
            '#E53726', // Chillie Red
            '#1274EF', // Crayola Blue
            '#FF1466', // Folly
            '#00B250', // Pigment Green
            '#00A899', // Persian Green
            '#FEC901', // Jonquil
            '#F1621D', // Pantone Orange
            '#8914FF', // Electric Violet
            '#FE7CE5', // Web Violet
            '#780303', // Barn Red
            '#656565', // Dim Gray
            '#F5F5F5', // White Smoke
        ];

        // Colors for black background
        $blackBgColors = [
            '#E53726', // Chillie Red
            '#3E8FF3', // Chefchaouen Blue
            '#0BDA68', // Malachite
            '#0BDCC9', // Turquoise
            '#9E3CFF', // Veronica
            '#A01515', // Penn Red
            '#2E2E2E', // Jet
        ];

        $bar = $this->output->createProgressBar(count($whiteBgColors) + count($blackBgColors));
        $bar->start();

        $createdCount = 0;
        $skippedCount = 0;

        // Insert white background colors
        foreach ($whiteBgColors as $color) {
            $existing = Color::where('color', $color)
                ->where('type', 'white_bg')
                ->first();

            if (!$existing) {
                Color::create([
                    'color' => $color,
                    'type' => 'white_bg',
                ]);
                $createdCount++;
            } else {
                $skippedCount++;
            }
            $bar->advance();
        }

        // Insert black background colors
        foreach ($blackBgColors as $color) {
            $existing = Color::where('color', $color)
                ->where('type', 'black_bg')
                ->first();

            if (!$existing) {
                Color::create([
                    'color' => $color,
                    'type' => 'black_bg',
                ]);
                $createdCount++;
            } else {
                $skippedCount++;
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ Seeding completed!");
        $this->line("📊 Created: {$createdCount} new colors");
        $this->line("⏭️  Skipped: {$skippedCount} existing colors");
        $this->line("📝 Total colors in database: " . Color::count());

        // Display summary
        $whiteBgCount = Color::where('type', 'white_bg')->count();
        $blackBgCount = Color::where('type', 'black_bg')->count();

        $this->table(
            ['Background Type', 'Count'],
            [
                ['White Background', $whiteBgCount],
                ['Black Background', $blackBgCount],
                ['Total', $whiteBgCount + $blackBgCount],
            ]
        );

        $this->info('🎨 Default color suggestions are now available for the color picker!');
    }
}
