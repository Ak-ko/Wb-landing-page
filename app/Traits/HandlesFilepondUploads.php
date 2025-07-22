<?php

namespace App\Traits;

use App\Jobs\MoveFileToStorageServerJob;
use RahulHaque\Filepond\Models\Filepond as FilepondModel;
use RahulHaque\Filepond\Services\FilepondService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

trait HandlesFilepondUploads
{
    /**
     * Convert FilePond temporary files to permanent storage
     *
     * @param array $filepondIds Array of FilePond IDs
     * @param string $directory Target directory for permanent storage
     * @return array Array of permanent file paths
     */
    public function convertFilepondToPermanent(array $filepondIds, string $directory = 'images'): array
    {
        $permanentPaths = [];
        $service = app(FilepondService::class);
        $disk = config('filepond.disk', 'public');

        foreach ($filepondIds as $filepondId) {
            try {
                $filepond = $service->retrieve($filepondId);

                if (!$filepond) {
                    continue; // Skip if FilePond record not found
                }

                // Generate new filename for permanent storage
                $extension = pathinfo($filepond->filename, PATHINFO_EXTENSION);
                $filename = uniqid() . '.' . $extension;
                $permanentPath = $directory . '/' . $filename;

                // Get the file content and copy to permanent storage
                [$filepondModel, $content] = $service->restore($filepondId);
                Storage::disk($disk)->put($permanentPath, $content);

                $permanentPaths[] = $permanentPath;

                // Clean up temporary file
                $service->delete($filepond);
            } catch (\Exception $e) {
                Log::error('Failed to convert FilePond file to permanent: ' . $e->getMessage());
                continue; // Skip this file and continue with others
            }
        }

        return $permanentPaths;
    }



    /**
     * Clean up old files when updating
     *
     * @param array $oldPaths Array of old file paths to potentially delete
     * @param array $newPaths Array of new file paths to keep
     */
    public function cleanupOldFiles(array $oldPaths, array $newPaths): void
    {
        $pathsToDelete = array_diff($oldPaths, $newPaths);
        $disk = config('filepond.disk', 'public');

        foreach ($pathsToDelete as $path) {
            try {
                if (Storage::disk($disk)->exists($path)) {
                    Storage::disk($disk)->delete($path);
                }
            } catch (\Exception $e) {
                Log::error('Failed to delete old file: ' . $path . ' - ' . $e->getMessage());
            }
        }
    }

    /**
     * Delete files from storage
     *
     * @param array $filePaths Array of file paths to delete
     */
    public function deleteFiles(array $filePaths): void
    {
        $disk = config('filepond.disk', 'public');

        foreach ($filePaths as $path) {
            try {
                if (Storage::disk($disk)->exists($path)) {
                    Storage::disk($disk)->delete($path);
                }
            } catch (\Exception $e) {
                Log::error('Failed to delete file: ' . $path . ' - ' . $e->getMessage());
            }
        }
    }

    /**
     * Handle mixed file input - separates FilePond IDs from existing file paths
     * Note: FilePond files are automatically moved to permanent storage after upload
     *
     * @param array $files Array containing both FilePond IDs and existing file paths
     * @return array Array containing separated 'filepond_ids' and 'existing_paths'
     */
    public function handleMixedFileInput(array $files): array
    {
        $filepondIds = [];
        $existingPaths = [];

        // Separate FilePond IDs from existing file paths
        foreach ($files as $file) {
            if (is_string($file) && (str_contains($file, '/') || str_contains($file, '\\'))) {
                // This looks like a file path
                $existingPaths[] = $file;
            } else {
                // This looks like a FilePond ID
                $filepondIds[] = $file;
            }
        }

        return [
            'filepond_ids' => $filepondIds,
            'existing_paths' => $existingPaths,
            'all_files' => $files
        ];
    }

    /**
     * Get permanent file paths for FilePond IDs (for files that have been processed)
     * This method waits for the queue job to complete and returns the permanent paths
     *
     * @param array $filepondIds Array of FilePond IDs
     * @param int $maxWaitSeconds Maximum seconds to wait for processing (default: 30)
     * @return array Array of permanent file paths
     */
    public function getProcessedFilePaths(array $filepondIds, int $maxWaitSeconds = 30): array
    {
        $permanentPaths = [];
        $startTime = time();

        foreach ($filepondIds as $filepondId) {
            $waitTime = 0;
            $found = false;

            // Wait for the file to be processed and moved to permanent storage
            while ($waitTime < $maxWaitSeconds) {
                // Check if file exists in permanent storage
                $possiblePath = 'images/' . $filepondId; // This would be the expected path

                if (Storage::disk('public')->exists($possiblePath)) {
                    $permanentPaths[] = $possiblePath;
                    $found = true;
                    break;
                }

                // Wait a bit before checking again
                sleep(1);
                $waitTime = time() - $startTime;
            }

            if (!$found) {
                Log::warning("FilePond file not found after processing: {$filepondId}");
            }
        }

        return $permanentPaths;
    }
}
