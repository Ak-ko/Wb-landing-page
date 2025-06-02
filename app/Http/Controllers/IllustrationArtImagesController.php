<?php

namespace App\Http\Controllers;

use App\Models\IllustrationArtImages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IllustrationArtImagesController extends Controller
{
    /**
     * Store a newly created image.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|file|image|max:10240', // 10MB max
            'illustration_art_id' => 'required|exists:illustration_art,id',
        ]);

        $image = new IllustrationArtImages();
        $path = $image->saveImage($validated['image'], 'illustration-art-images');

        $image->image = $path;
        $image->illustration_art_id = $validated['illustration_art_id'];
        $image->save();

        return response()->json($image);
    }

    /**
     * Remove the specified image from storage.
     */
    public function destroy(IllustrationArtImages $image)
    {
        // Delete the file from storage
        $image->deleteImage($image->image);

        // Delete the record
        $image->delete();

        return response()->noContent();
    }

    /**
     * Upload an image without associating it with an illustration art.
     */
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|file|image|max:10240', // 10MB max
        ]);

        $image = new IllustrationArtImages();
        $path = $image->saveImage($validated['image'], 'illustration-art-images');

        return response()->json([
            'path' => $path,
            'url' => Storage::url($path),
        ]);
    }

    /**
     * Delete an image from storage by path.
     */
    public function deleteByPath(Request $request)
    {
        $validated = $request->validate([
            'path' => 'required|string',
        ]);

        $image = new IllustrationArtImages();
        $result = $image->deleteImage($validated['path']);

        return response()->json(['success' => $result]);
    }
}
