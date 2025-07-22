<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RahulHaque\Filepond\Models\Filepond as FilepondModel;
use RahulHaque\Filepond\Services\FilepondService;

class MoveFileToStorageServerJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filepondId;
    protected $targetDirectory;
    protected $targetDisk;

    /**
     * Create a new job instance.
     *
     * @param string $filepondId The FilePond temporary file ID
     * @param string $targetDirectory Target directory (default: 'images')
     * @param string $targetDisk Target storage disk (default: 'public')
     */
    public function __construct(string $filepondId, string $targetDirectory = 'images', string $targetDisk = 'public')
    {
        $this->filepondId = $filepondId;
        $this->targetDirectory = $targetDirectory;
        $this->targetDisk = $targetDisk;
    }

    /**
     * Execute the job.
     */
    public function handle(): ?string
    {
        try {
            $service = app(FilepondService::class);
            $filepond = $service->retrieve($this->filepondId);

            if (!$filepond) {
                Log::warning("FilePond file not found for ID: {$this->filepondId}");
                return null;
            }

            // Generate new filename for permanent storage
            $extension = pathinfo($filepond->filename, PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $extension;
            $permanentPath = $this->targetDirectory . '/' . $filename;

            // Get the file content from temp storage
            [$filepondModel, $content] = $service->restore($this->filepondId);

            // Store file in permanent storage
            Storage::disk($this->targetDisk)->put($permanentPath, $content);

            // Verify the file was saved successfully
            if (!Storage::disk($this->targetDisk)->exists($permanentPath)) {
                throw new \Exception('Failed to save file to permanent storage');
            }

            // Clean up temporary file
            $this->cleanupTempFile($service, $filepond);

            Log::info("File moved successfully from temp to permanent storage: {$permanentPath}");

            return $permanentPath;
        } catch (\Exception $e) {
            Log::error("Failed to move FilePond file to storage server: {$e->getMessage()}", [
                'filepond_id' => $this->filepondId,
                'target_directory' => $this->targetDirectory,
                'target_disk' => $this->targetDisk,
            ]);

            // Re-throw the exception so the job can be retried
            throw $e;
        }
    }

    /**
     * Clean up the temporary file and database record
     *
     * @param FilepondService $service
     * @param FilepondModel $filepond
     */
    protected function cleanupTempFile(FilepondService $service, FilepondModel $filepond): void
    {
        try {
            // Get temp file info before deletion
            $tempDisk = $filepond->disk ?? config('filepond.temp_disk', 'public');
            $tempFilePath = $filepond->filepath;

            // Delete the database record (use forceDelete to bypass soft deletes)
            $filepond->forceDelete();

            // Delete the physical temp file
            if (Storage::disk($tempDisk)->exists($tempFilePath)) {
                Storage::disk($tempDisk)->delete($tempFilePath);
            }

            Log::info("Temp file cleaned up successfully: {$tempFilePath}");
        } catch (\Exception $e) {
            Log::error("Failed to cleanup temp file: {$e->getMessage()}", [
                'filepond_id' => $this->filepondId,
                'temp_filepath' => $filepond->filepath ?? 'unknown',
            ]);
            // Don't re-throw here as the main file move was successful
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("MoveFileToStorageServerJob failed: {$exception->getMessage()}", [
            'filepond_id' => $this->filepondId,
            'target_directory' => $this->targetDirectory,
            'target_disk' => $this->targetDisk,
        ]);
    }
}
