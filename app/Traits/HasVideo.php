<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait HasVideo
{
    /**
     * Get the full URL for an image.
     *
     * @param  string  $path
     * @return string
     */
    public function getImageUrl($path)
    {
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        return Storage::url($path);
    }

    /**
     * Save an image to storage.
     *
     * @param  \Illuminate\Http\UploadedFile|string  $image
     * @param  string  $directory
     * @return string
     */
    public function saveImage($image, $directory = 'videos')
    {
        if (is_string($image) && (filter_var($image, FILTER_VALIDATE_URL) || Storage::exists($image))) {
            return $image;
        }

        if ($image && !is_string($image)) {
            $path = $image->store($directory);
            return $path;
        }

        return null;
    }

    /**
     * Delete an image from storage.
     *
     * @param  string|null  $path
     * @return bool
     */
    public function deleteImage($path)
    {
        if (!$path) {
            return false;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            $base = rtrim(Storage::url(''), '/');
            $path = ltrim(str_replace($base, '', $path), '/');
        }

        return Storage::delete($path);
    }
}
