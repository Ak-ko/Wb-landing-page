<?php

namespace App\Http\Controllers;

use App\Events\FileFullyUploadedAndReadyToSync;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use RahulHaque\Filepond\Services\FilepondService;
use RahulHaque\Filepond\Models\Filepond as FilepondModel;
use Illuminate\Support\Facades\Storage;

class FilepondController extends Controller
{
    /**
     * Handle FilePond file upload (process)
     */
    public function process(Request $request, FilepondService $service)
    {
        try {
            // Check if chunk upload
            if ($request->hasHeader('upload-length')) {
                return Response::make($service->initChunk(), 200, ['content-type' => 'text/plain']);
            }

            // Validate the uploaded file
            $validator = $service->validator($request, [
                'required',
                'file',
                'max:' . (500 * 1024), // 500MB in KB
                'mimes:jpeg,jpg,png,gif,svg,webp,mp4,mov,avi,wmv,flv,webm,mkv,m4v'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $serverId = $service->store($request);

            return Response::make($serverId, 200, ['content-type' => 'text/plain']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * FilePond ./patch route logic for chunk uploads
     */
    public function patch(Request $request, FilepondService $service)
    {
        try {
            return Response::make('Ok', 200)->withHeaders(['Upload-Offset' => $service->chunk($request)]);
        } catch (\Exception $e) {
            return response('Error during chunk upload: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle FilePond file removal (revert)
     */
    public function revert(Request $request, FilepondService $service)
    {
        try {
            $serverId = $request->getContent();

            if (empty($serverId)) {
                return response()->json([
                    'error' => 'No server ID provided'
                ], 400);
            }

            // Try to retrieve the FilePond record
            $filepond = $service->retrieve($serverId);

            if (!$filepond) {
                // Still try to delete the physical file if it exists
                $this->cleanupOrphanedPhysicalFile($serverId);
                return Response::make('Ok', 200, ['content-type' => 'text/plain']);
            }

            // Get file info before deletion
            $disk = $filepond->disk ?? config('filepond.temp_disk', 'public');
            $filePath = $filepond->filepath;

            // Delete the database record first (use forceDelete to bypass soft deletes)
            try {
                $filepond->forceDelete(); // This actually removes the record from DB
            } catch (\Exception $e) {
                throw new \Exception('Failed to delete database record: ' . $e->getMessage());
            }

            // Then delete the physical file
            if (Storage::disk($disk)->exists($filePath)) {
                try {
                    Storage::disk($disk)->delete($filePath);
                } catch (\Exception $e) {
                    // Don't throw exception here since DB record is already deleted
                }
            }

            return Response::make('Ok', 200, ['content-type' => 'text/plain']);
        } catch (\Exception $e) {
            // Return a proper error response
            return response()->json([
                'error' => 'Failed to delete file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle FilePond file restoration and head requests
     */
    public function head(Request $request, FilepondService $service)
    {
        try {
            // If request has patch key, then its a head request for chunk upload
            if ($request->has('patch')) {
                return Response::make('Ok', 200)->withHeaders(['Upload-Offset' => $service->offset($request->patch)]);
            }

            // If request has restore key, then its a restore request
            if ($request->has('restore')) {
                [$filepond, $content] = $service->restore($request->restore);

                return Response::make($content, 200)->withHeaders([
                    'Access-Control-Expose-Headers' => 'Content-Disposition',
                    'Content-Type' => $filepond->mimetypes,
                    'Content-Disposition' => 'inline; filename="' . $filepond->filename . '"',
                ]);
            }

            return Response::make('Feature not implemented yet.', 406);
        } catch (\Exception $e) {
            return response('Error during head request: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle FilePond file loading (load)
     */
    public function load(Request $request, $serverId, FilepondService $service)
    {
        try {
            $filepond = $service->retrieve($serverId);

            if (!$filepond) {
                return response('File not found', 404);
            }

            [$filepond, $content] = $service->restore($serverId);

            $headers = [
                'Content-Type' => $filepond->mimetypes,
                'Content-Length' => strlen($content),
                'Content-Disposition' => 'inline; filename="' . $filepond->filename . '"'
            ];

            return response($content, 200, $headers);
        } catch (\Exception $e) {
            return response('Error loading file: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle FilePond file fetching (fetch)
     */
    public function fetch(Request $request)
    {
        try {
            $url = $request->get('fetch');

            if (!$url) {
                return response('No URL provided', 400);
            }

            // Parse the URL to get the file path
            $path = parse_url($url, PHP_URL_PATH);
            $path = ltrim($path, '/storage/');

            $disk = config('filepond.disk', 'public');

            if (!Storage::disk($disk)->exists($path)) {
                return response('File not found', 404);
            }

            $file = Storage::disk($disk)->get($path);
            $mimeType = mime_content_type(Storage::disk($disk)->path($path));
            $size = Storage::disk($disk)->size($path);

            $headers = [
                'Content-Type' => $mimeType,
                'Content-Length' => $size,
            ];

            return response($file, 200, $headers);
        } catch (\Exception $e) {
            return response('Error fetching file: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Convert FilePond temporary file to permanent storage
     */
    public function convertToPermanent($filepondId, $directory = 'uploads', FilepondService $service)
    {
        try {
            $filepond = $service->retrieve($filepondId);

            if (!$filepond) {
                throw new \Exception('FilePond file not found');
            }

            // Generate new filename for permanent storage
            $extension = pathinfo($filepond->filename, PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $extension;
            $permanentPath = $directory . '/' . $filename;

            // Get the file content and copy to permanent storage
            [$filepondModel, $content] = $service->restore($filepondId);
            $disk = config('filepond.disk', 'public');
            Storage::disk($disk)->put($permanentPath, $content);

            // Clean up temporary file
            $service->delete($filepond);

            return $permanentPath;
        } catch (\Exception $e) {
            throw new \Exception('Failed to convert temporary file to permanent: ' . $e->getMessage());
        }
    }

    /**
     * Clean up orphaned temporary files
     * This can be called via artisan command or scheduled job
     */
    public function cleanupOrphanedFiles()
    {
        try {
            $tempDisk = config('filepond.temp_disk', 'local');
            $tempFolder = config('filepond.temp_folder', 'temp');
            $expirationMinutes = config('filepond.expiration', 30);

            // Get all files older than expiration time
            $cutoffTime = now()->subMinutes($expirationMinutes);

            $orphanedFiles = FilepondModel::where('created_at', '<', $cutoffTime)
                ->where('disk', $tempDisk)
                ->get();

            $deletedCount = 0;

            foreach ($orphanedFiles as $filepond) {
                try {
                    if (Storage::disk($tempDisk)->exists($filepond->filepath)) {
                        Storage::disk($tempDisk)->delete($filepond->filepath);
                    }
                    $filepond->delete();
                    $deletedCount++;
                } catch (\Exception $e) {
                    // Silent fail for individual file cleanup
                }
            }

            return $deletedCount;
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Trigger file sync to move files from temp to permanent storage
     */
    public function triggerFileSync(Request $request)
    {
        try {
            $request->validate([
                'filepond_ids' => 'required|array',
                'filepond_ids.*' => 'required|string',
                'target_directory' => 'sometimes|string',
                'target_disk' => 'sometimes|string',
            ]);

            $filepondIds = $request->input('filepond_ids');
            $targetDirectory = $request->input('target_directory', 'images');
            $targetDisk = $request->input('target_disk', 'public');
            $userId = Auth::id();

            // Trigger the event to process files
            event(new FileFullyUploadedAndReadyToSync(
                $filepondIds,
                $targetDirectory,
                $targetDisk,
                $userId
            ));

            return response()->json([
                'success' => true,
                'message' => 'File sync triggered successfully',
                'data' => [
                    'filepond_ids' => $filepondIds,
                    'target_directory' => $targetDirectory,
                    'target_disk' => $targetDisk,
                    'files_count' => count($filepondIds)
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to trigger file sync: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cleanup orphaned physical files when no database record exists
     */
    private function cleanupOrphanedPhysicalFile($serverId)
    {
        try {
            $tempDisk = config('filepond.temp_disk', 'public');
            $tempFolder = config('filepond.temp_folder', 'temp');

            // The serverId is typically the filename in the temp folder
            $potentialPath = $tempFolder . '/' . $serverId;

            if (Storage::disk($tempDisk)->exists($potentialPath)) {
                Storage::disk($tempDisk)->delete($potentialPath);
            }
        } catch (\Exception $e) {
            // Silent fail for cleanup
        }
    }
}
