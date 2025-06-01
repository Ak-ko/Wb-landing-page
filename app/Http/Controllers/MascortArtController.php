<?php

namespace App\Http\Controllers;

use App\Models\MascortArt;
use App\Models\MascortArtImages;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MascortArtController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = MascortArt::query()->with(['images' => function ($q) {
            $q->where('is_primary', true);
        }]);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $mascortArts = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/mascort-art/index', [
            'mascortArts' => $mascortArts,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/mascort-art/create');
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
            'primary_image_id' => 'nullable|integer',
            'mascot_image_id' => 'nullable|integer',
        ]);

        $mascortArt = MascortArt::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        if (isset($validated['images']) && is_array($validated['images'])) {
            foreach ($validated['images'] as $index => $image) {
                if (is_string($image)) {
                    $path = $image;
                }

                MascortArtImages::create([
                    'mascort_art_id' => $mascortArt->id,
                    'image' => $path,
                    'is_primary' => false,
                    'is_mascot' => false,
                ]);
            }

            // Set primary and mascot images after all images are created
            if (isset($validated['primary_image_id'])) {
                MascortArtImages::where('mascort_art_id', $mascortArt->id)
                    ->where('id', $validated['primary_image_id'])
                    ->update(['is_primary' => true]);
            }

            if (isset($validated['mascot_image_id'])) {
                MascortArtImages::where('mascort_art_id', $mascortArt->id)
                    ->where('id', $validated['mascot_image_id'])
                    ->update(['is_mascot' => true]);
            }
        }

        return redirect()->route('mascort-art.index')->with('success', 'Mascort art created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(MascortArt $mascortArt)
    {
        $mascortArt->load('images');

        return Inertia::render('admin/mascort-art/show', [
            'mascortArt' => $mascortArt,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MascortArt $mascortArt)
    {
        $mascortArt->load('images');

        return Inertia::render('admin/mascort-art/edit', [
            'mascortArt' => $mascortArt,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MascortArt $mascortArt)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'required',
            'new_images' => 'nullable|array',
            'primary_image_id' => 'nullable|integer',
            'mascot_image_id' => 'nullable|integer',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'exists:mascort_art_images,id',
        ]);

        $mascortArt->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Handle removed images
        if (isset($validated['removed_images'])) {
            MascortArtImages::whereIn('id', $validated['removed_images'])->delete();
        }

        // Reset all primary and mascot flags
        MascortArtImages::where('mascort_art_id', $mascortArt->id)
            ->update(['is_primary' => false, 'is_mascot' => false]);

        // Set new primary image
        if (isset($validated['primary_image_id'])) {
            MascortArtImages::where('mascort_art_id', $mascortArt->id)
                ->where('id', $validated['primary_image_id'])
                ->update(['is_primary' => true]);
        }

        // Set new mascot image
        if (isset($validated['mascot_image_id'])) {
            MascortArtImages::where('mascort_art_id', $mascortArt->id)
                ->where('id', $validated['mascot_image_id'])
                ->update(['is_mascot' => true]);
        }

        // Handle new images
        if (isset($validated['new_images']) && is_array($validated['new_images'])) {
            foreach ($validated['new_images'] as $image) {
                if (is_string($image)) {
                    $path = $image;
                }

                MascortArtImages::create([
                    'mascort_art_id' => $mascortArt->id,
                    'image' => $path,
                    'is_primary' => false,
                    'is_mascot' => false,
                ]);
            }
        }

        return redirect()->route('mascort-art.index')->with('success', 'Mascort art updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MascortArt $mascortArt)
    {
        $mascortArt->images()->delete();
        $mascortArt->delete();

        return redirect()->route('mascort-art.index')->with('success', 'Mascot art deleted successfully.');
    }
}
