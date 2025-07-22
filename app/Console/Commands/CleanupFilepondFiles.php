<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\FilepondController;

class CleanupFilepondFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'filepond:cleanup
                            {--force : Force cleanup without confirmation}
                            {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up orphaned FilePond temporary files older than the configured expiration time';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $isForced = $this->option('force');
        $expirationMinutes = config('filepond.expiration', 30);

        $this->info("FilePond Cleanup Command");
        $this->info("Expiration time: {$expirationMinutes} minutes");

        if ($isDryRun) {
            $this->warn("DRY RUN MODE: No files will actually be deleted");
        }

        if (!$isForced && !$isDryRun) {
            if (!$this->confirm('This will permanently delete orphaned temporary files. Do you want to continue?')) {
                $this->info('Cleanup cancelled.');
                return 0;
            }
        }

        $controller = new FilepondController();

        if ($isDryRun) {
            // For dry run, we'll count the files that would be deleted
            $cutoffTime = now()->subMinutes($expirationMinutes);
            $orphanedFiles = \RahulHaque\Filepond\Models\Filepond::where('created_at', '<', $cutoffTime)
                ->where('disk', config('filepond.temp_disk', 'local'))
                ->get();

            $this->info("Found {$orphanedFiles->count()} orphaned files that would be deleted:");

            foreach ($orphanedFiles as $file) {
                $this->line("- {$file->filename} (created: {$file->created_at})");
            }

            return 0;
        }

        $this->info('Starting cleanup...');

        $deletedCount = $controller->cleanupOrphanedFiles();

        if ($deletedCount > 0) {
            $this->info("✅ Successfully cleaned up {$deletedCount} orphaned files.");
        } else {
            $this->info("✨ No orphaned files found to clean up.");
        }

        return 0;
    }
}
