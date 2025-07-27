<?php

namespace App\Http\Controllers;

use App\Models\ComicArt;
use App\Models\ComicArtImages;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ComicArtController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ComicArt::query()->with(['images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $comicArts = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/comic-art/index', [
            'comicArts' => $comicArts,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/comic-art/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'required|array|min:1',
            'images.*' => 'required',
            'new_images' => 'nullable|array',
        ]);

        $comicArt = ComicArt::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Handle new images
        if (isset($validated['new_images']) && is_array($validated['new_images'])) {
            foreach ($validated['new_images'] as $index => $image) {
                $path = is_string($image) ? $image : $image;

                ComicArtImages::create([
                    'comic_art_id' => $comicArt->id,
                    'image' => $path,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('comic-art.index')
            ->with('success', 'Comic art created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ComicArt $comicArt)
    {
        $comicArt->load('images');

        return Inertia::render('admin/comic-art/show', [
            'comicArt' => $comicArt,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ComicArt $comicArt)
    {
        $comicArt->load('images');

        return Inertia::render('admin/comic-art/edit', [
            'comicArt' => $comicArt,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ComicArt $comicArt)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array|min:1',
            'images.*' => 'required',
            'new_images' => 'nullable|array',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'exists:comic_art_images,id',
        ]);

        $comicArt->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Handle removed images
        if (isset($validated['removed_images'])) {
            $imagesToDelete = ComicArtImages::whereIn('id', $validated['removed_images'])
                ->where('comic_art_id', $comicArt->id)
                ->get();

            foreach ($imagesToDelete as $image) {
                // Delete the file from storage
                $image->deleteImage($image->image);
                // Delete the record
                $image->delete();
            }
        }

        // Update order for existing images
        if (isset($validated['images']) && is_array($validated['images'])) {
            foreach ($validated['images'] as $index => $imagePath) {
                $existingImage = ComicArtImages::where('comic_art_id', $comicArt->id)
                    ->where('image', Str::after($imagePath, config('app.url')))
                    ->first();

                if ($existingImage) {
                    $existingImage->update(['order' => $index]);
                }
            }
        }

        // Handle new images
        if (isset($validated['new_images']) && is_array($validated['new_images'])) {
            $maxOrder = $comicArt->images()->max('order') ?? -1;

            foreach ($validated['new_images'] as $index => $image) {
                $path = is_string($image) ? $image : $image;

                ComicArtImages::create([
                    'comic_art_id' => $comicArt->id,
                    'image' => $path,
                    'order' => $maxOrder + $index + 1,
                ]);
            }
        }

        return redirect()->route('comic-art.index')
            ->with('success', 'Comic art updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ComicArt $comicArt)
    {
        // Delete associated images from storage
        foreach ($comicArt->images as $image) {
            $image->deleteImage($image->image);
        }

        // The comic art and its images will be deleted due to the cascade constraint
        $comicArt->delete();

        return redirect()->route('comic-art.index')
            ->with('success', 'comic art deleted successfully.');
    }

    /**
     * Display a listing of the published comic art.
     */
    public function comicArtList(Request $request)
    {
        $query = ComicArt::latest()->with(['images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $comicArts = $query->paginate(6)->withQueryString();

        return Inertia::render('comic-art/comic-art-page', [
            'comicArts' => $comicArts,
            'filters' => $request->only(['query', 'page']),
        ]);
    }

    /**
     * Display the specified comic art.
     */
    public function comicArtDetail(ComicArt $comicArt)
    {
        $comicArt->load('images');

        // Get related comic art
        $relatedcomicArts = ComicArt::where('id', '!=', $comicArt->id)
            ->with(['images'])
            ->take(3)
            ->get();

        return Inertia::render('comic-art/comic-art-detail', [
            'comicArt' => $comicArt,
            'relatedcomicArts' => $relatedcomicArts,
        ]);
    }
}
