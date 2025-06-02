<?php

namespace App\Http\Controllers;

use App\Models\IllustrationArt;
use App\Models\IllustrationArtImages;
use App\Traits\IllustrationArtTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IllustrationArtController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = IllustrationArt::query()->with(['images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $illustrationArts = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/illustration-art/index', [
            'illustrationArts' => $illustrationArts,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/illustration-art/create');
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
        ]);

        $illustrationArt = IllustrationArt::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Handle images
        if (isset($validated['images']) && is_array($validated['images'])) {
            foreach ($validated['images'] as $index => $image) {
                if (is_string($image)) {
                    $path = $image;
                }

                IllustrationArtImages::create([
                    'illustration_art_id' => $illustrationArt->id,
                    'image' => $path,
                ]);
            }
        }

        return redirect()->route('illustration-art.index')
            ->with('success', 'Illustration art created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(IllustrationArt $illustrationArt)
    {
        $illustrationArt->load('images');

        return Inertia::render('admin/illustration-art/show', [
            'illustrationArt' => $illustrationArt,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(IllustrationArt $illustrationArt)
    {
        $illustrationArt->load('images');

        return Inertia::render('admin/illustration-art/edit', [
            'illustrationArt' => $illustrationArt,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IllustrationArt $illustrationArt)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array|min:1',
            'images.*' => 'required',
            'new_images' => 'nullable|array',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'exists:illustration_art_images,id',
        ]);

        $illustrationArt->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Handle removed images
        if (isset($validated['removed_images'])) {
            $imagesToDelete = IllustrationArtImages::whereIn('id', $validated['removed_images'])
                ->where('illustration_art_id', $illustrationArt->id)
                ->get();

            foreach ($imagesToDelete as $image) {
                // Delete the file from storage
                $image->deleteImage($image->image);
                // Delete the record
                $image->delete();
            }
        }

        // Handle existing images
        $existingImagesCount = $illustrationArt->images()->count();

        // Handle new images
        if (isset($validated['new_images']) && is_array($validated['new_images'])) {
            foreach ($validated['new_images'] as $index => $image) {
                IllustrationArtImages::create([
                    'illustration_art_id' => $illustrationArt->id,
                    'image' => $image['file'],
                ]);
            }
        }

        return redirect()->route('illustration-art.index')
            ->with('success', 'Illustration art updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IllustrationArt $illustrationArt)
    {
        // Delete associated images from storage
        foreach ($illustrationArt->images as $image) {
            $image->deleteImage($image->image);
        }

        // The illustration art and its images will be deleted due to the cascade constraint
        $illustrationArt->delete();

        return redirect()->route('illustration-art.index')
            ->with('success', 'Illustration art deleted successfully.');
    }

    /**
     * Display a listing of the published illustration art.
     */
    public function illustrationArtList(Request $request)
    {
        $query = IllustrationArt::latest()->with(['images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $illustrationArts = $query->paginate(6)->withQueryString();

        return Inertia::render('illustration-art/illustration-art-page', [
            'illustrationArts' => $illustrationArts,
            'filters' => $request->only(['query', 'page']),
        ]);
    }

    /**
     * Display the specified illustration art.
     */
    public function illustrationArtDetail(IllustrationArt $illustrationArt)
    {
        $illustrationArt->load('images');

        // Get related illustration art
        $relatedIllustrationArts = IllustrationArt::where('id', '!=', $illustrationArt->id)
            ->with(['images'])
            ->take(3)
            ->get();

        return Inertia::render('illustration-art/illustration-art-detail', [
            'illustrationArt' => $illustrationArt,
            'relatedIllustrationArts' => $relatedIllustrationArts,
        ]);
    }
}
