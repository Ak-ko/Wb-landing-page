<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;

trait ChunkUploadHandler
{
    /**
     * Handle a chunk of an uploaded file using resumable.js.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleChunkUpload(Request $request)
    {
        // Create the file receiver
        $receiver = new FileReceiver('file', $request, HandlerFactory::classFromRequest($request));

        // Check if the upload is chunked
        if ($receiver->isUploaded() === false) {
            return response()->json([
                'success' => false,
                'message' => 'No file was uploaded',
            ], 400);
        }

        // Receive the file
        $save = $receiver->receive();

        // Check if the upload has finished (all chunks have been uploaded)
        if ($save->isFinished()) {
            // Save the file and return the response
            return $this->saveFile($save->getFile(), $request);
        }

        // We are still uploading chunks
        $handler = $save->handler();

        return response()->json([
            'success' => true,
            'chunkNumber' => $handler->getPercentageDone(),
            'progress' => $handler->getPercentageDone(),
        ]);
    }

    /**
     * Save the uploaded file to its final location.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    protected function saveFile($file, Request $request)
    {
        // Get the file mime type
        $filetype = $file->getMimeType();

        // Determine file extension and directory based on mime type
        $extension = $this->getExtensionFromMimeType($filetype);
        $directory = $this->getDirectoryFromMimeType($filetype);

        // Generate a unique filename
        $filename = Str::uuid() . '.' . $extension;
        $finalPath = $directory . '/' . $filename;

        // Move the file to the final location
        Storage::putFileAs(
            $directory,
            $file,
            $filename,
            config('filesystems.disks.' . config('filesystems.default') . '.visibility')
        );

        // Return the path to the final file
        return response()->json([
            'success' => true,
            'path' => $finalPath,
            'url' => Storage::url($finalPath),
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'filesize' => $file->getSize(),
            'filetype' => $filetype,
        ]);
    }

    /**
     * Get the file extension from a MIME type.
     *
     * @param  string  $mimeType
     * @return string
     */
    protected function getExtensionFromMimeType($mimeType)
    {
        $map = [
            // Images
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/svg+xml' => 'svg',

            // Videos
            'video/mp4' => 'mp4',
            'video/webm' => 'webm',
            'video/ogg' => 'ogv',
            'video/quicktime' => 'mov',

            // Documents
            'application/pdf' => 'pdf',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'application/vnd.ms-excel' => 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
        ];

        return $map[$mimeType] ?? 'bin';
    }

    /**
     * Get the storage directory from a MIME type.
     *
     * @param  string  $mimeType
     * @return string
     */
    protected function getDirectoryFromMimeType($mimeType)
    {
        if (strpos($mimeType, 'image/') === 0) {
            return 'images';
        }

        if (strpos($mimeType, 'video/') === 0) {
            return 'videos';
        }

        return 'files';
    }

    public function cancelChunkUpload(Request $request)
    {
        // The library handles cleanup automatically, but we can add additional cleanup if needed
        return response()->json([
            'success' => true,
            'message' => 'Upload cancelled successfully',
        ]);
    }
}
