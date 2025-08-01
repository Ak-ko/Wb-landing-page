<?php

namespace App\Http\Controllers;

use App\Models\StickerArt;
use App\Models\StickerArtImages;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StickerArtController extends Controller
{
    public function index(Request $request)
    {
        $query = StickerArt::query()->with(['images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $stickerArts = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/sticker-art/index', [
            'stickerArts' => $stickerArts,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/sticker-art/create');
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

        $stickerArt = StickerArt::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        if (isset($validated['images']) && is_array($validated['images'])) {
            foreach ($validated['images'] as $index => $image) {
                if (is_string($image)) {
                    $path = $image;
                }

                StickerArtImages::create([
                    'sticker_art_id' => $stickerArt->id,
                    'image' => $path,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('sticker-art.index')
            ->with('success', 'Sticker art created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StickerArt $stickerArt)
    {
        $stickerArt->load('images');

        return Inertia::render('admin/sticker-art/show', [
            'stickerArt' => $stickerArt,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StickerArt $stickerArt)
    {
        $stickerArt->load('images');

        return Inertia::render('admin/sticker-art/edit', [
            'stickerArt' => $stickerArt,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StickerArt $stickerArt)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'required',
            'new_images' => 'nullable|array',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'exists:sticker_art_images,id',
        ]);

        $stickerArt->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        if (isset($validated['removed_images'])) {
            StickerArtImages::whereIn('id', $validated['removed_images'])->delete();
        }

        if (isset($validated['images']) && is_array($validated['images'])) {
            foreach ($validated['images'] as $index => $imagePath) {
                $existingImage = StickerArtImages::where('sticker_art_id', $stickerArt->id)
                    ->where('image', $imagePath)
                    ->first();

                if ($existingImage) {
                    $existingImage->update(['order' => $index]);
                }
            }
        }

        if (isset($validated['new_images']) && is_array($validated['new_images'])) {
            $maxOrder = $stickerArt->images()->max('order') ?? -1;

            foreach ($validated['new_images'] as $index => $image) {
                if (is_string($image)) {
                    $path = $image;
                }

                StickerArtImages::create([
                    'sticker_art_id' => $stickerArt->id,
                    'image' => $path,
                    'order' => $maxOrder + $index + 1,
                ]);
            }
        }

        return redirect()->route('sticker-art.index')
            ->with('success', 'Sticker Art updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StickerArt $stickerArt)
    {
        $stickerArt->images()->delete();
        $stickerArt->delete();

        return redirect()->route('sticker-art.index')
            ->with('success', 'Sticker Art deleted successfully.');
    }

    /**
     * Display a listing of the published comic art.
     */
    public function stickerArtList(Request $request)
    {
        $query = StickerArt::latest()->with(['images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $stickerArts = $query->paginate(6)->withQueryString();

        return Inertia::render('sticker-art/comic-art-page', [
            'stickerArts' => $stickerArts,
            'filters' => $request->only(['query', 'page']),
        ]);
    }

    /**
     * Display the specified comic art.
     */
    public function stickerArtDetail(StickerArt $stickerArt)
    {
        $stickerArt->load('images');

        // Get related comic art
        $relatedcomicArts = StickerArt::where('id', '!=', $stickerArt->id)
            ->with(['images'])
            ->take(3)
            ->get();

        return Inertia::render('sticker-art/sticker-art-detail', [
            'stickerArt' => $stickerArt,
            'relatedcomicArts' => $relatedcomicArts,
        ]);
    }
}
