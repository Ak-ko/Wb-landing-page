<?php

namespace App\Listeners;

use App\Events\FileFullyUploadedAndReadyToSync;
use App\Jobs\MoveFileToStorageServerJob;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessFileSync implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(FileFullyUploadedAndReadyToSync $event): void
    {
        Log::info('FileFullyUploadedAndReadyToSync event received', [
            'filepond_ids' => $event->filepondIds,
            'target_directory' => $event->targetDirectory,
            'target_disk' => $event->targetDisk,
            'user_id' => $event->userId,
        ]);

        // Dispatch individual jobs for each FilePond ID
        foreach ($event->filepondIds as $filepondId) {
            try {
                dispatch(new MoveFileToStorageServerJob(
                    $filepondId,
                    $event->targetDirectory,
                    $event->targetDisk
                ));

                Log::info("File move job dispatched for FilePond ID: {$filepondId}");
            } catch (\Exception $e) {
                Log::error("Failed to dispatch file move job for FilePond ID: {$filepondId}", [
                    'error' => $e->getMessage(),
                    'user_id' => $event->userId,
                ]);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(FileFullyUploadedAndReadyToSync $event, \Throwable $exception): void
    {
        Log::error('ProcessFileSync listener failed', [
            'filepond_ids' => $event->filepondIds,
            'error' => $exception->getMessage(),
            'user_id' => $event->userId,
        ]);
    }
}
