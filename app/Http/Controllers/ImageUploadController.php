<?php

namespace App\Http\Controllers;

use App\Traits\ChunkUploadHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    use ChunkUploadHandler;

    public function uploadImage(Request $request)
    {
        return $this->handleChunkUpload($request);
    }

    /**
     * Cancel an in-progress image upload.
     */
    public function cancelUpload(Request $request)
    {
        return $this->cancelChunkUpload($request);
    }

    public function deleteImage()
    {
        try {
            $path = explode('storage/', request('path'))[1];

            if (Storage::exists($path)) {
                Storage::delete($path);
                return response()->json(['success' => true, 'message' => 'Image deleted successfully']);
            }

            return response()->json(['success' => false, 'message' => 'Image not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting image: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error deleting image: ' . $e->getMessage()], 500);
        }
    }
}
