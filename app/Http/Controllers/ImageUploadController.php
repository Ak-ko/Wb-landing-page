<?php

namespace App\Http\Controllers;

use App\Traits\ChunkUploadHandler;
use Illuminate\Http\Request;

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
}
