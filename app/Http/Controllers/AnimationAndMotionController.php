<?php

namespace App\Http\Controllers;

use App\Models\AnimationAndMotion;
use App\Models\AnimationAndMotionImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnimationAndMotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AnimationAndMotion::query()->with(['images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $animationAndMotions = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();


        return Inertia::render('admin/animation-and-motion/index', [
            'animationAndMotions' => $animationAndMotions,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/animation-and-motion/create');
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

        $animationAndMotion = AnimationAndMotion::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Handle images
        if (isset($validated['images']) && is_array($validated['images'])) {
            foreach ($validated['images'] as $index => $image) {
                if (is_string($image)) {
                    $path = $image;
                }

                AnimationAndMotionImage::create([
                    'animation_and_motion_id' => $animationAndMotion->id,
                    'image' => $path,
                ]);
            }
        }

        return redirect()->route('animation-and-motion.index')
            ->with('success', 'Animation and Motion created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AnimationAndMotion $animationAndMotion)
    {
        $animationAndMotion->load('images');

        return Inertia::render('admin/animation-and-motion/show', [
            'animationAndMotion' => $animationAndMotion,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AnimationAndMotion $animationAndMotion)
    {
        $animationAndMotion->load('images');

        return Inertia::render('admin/animation-and-motion/edit', [
            'animationAndMotion' => $animationAndMotion,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AnimationAndMotion $animationAndMotion)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array|min:1',
            'images.*' => 'required',
            'new_images' => 'nullable|array',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'exists:animation_and_motion_images,id',
        ]);

        $animationAndMotion->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Handle removed images
        if (isset($validated['removed_images'])) {
            $imagesToDelete = AnimationAndMotionImage::whereIn('id', $validated['removed_images'])
                ->where('animation_and_motion_id', $animationAndMotion->id)
                ->get();

            foreach ($imagesToDelete as $image) {
                // Delete the file from storage
                $image->deleteImage($image->image);
                // Delete the record
                $image->delete();
            }
        }

        // Handle existing images
        $existingImagesCount = $animationAndMotion->images()->count();

        // Handle new images
        if (isset($validated['new_images']) && is_array($validated['new_images'])) {
            foreach ($validated['new_images'] as $index => $image) {
                AnimationAndMotionImage::create([
                    'animation_and_motion_id' => $animationAndMotion->id,
                    'image' => $image['file'],
                ]);
            }
        }


        return redirect()->route('animation-and-motion.index')
            ->with('success', 'Animation and Motion updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AnimationAndMotion $animationAndMotion)
    {
        // Delete associated images from storage
        foreach ($animationAndMotion->images as $image) {
            $image->deleteImage($image->image);
        }

        // The Animation and Motion and its images will be deleted due to the cascade constraint
        $animationAndMotion->delete();

        return redirect()->route('animation-and-motion.index')
            ->with('success', 'Animation and Motion deleted successfully.');
    }

    /**
     * Display a listing of the published Animation and Motion.
     */
    public function animationArtList(Request $request)
    {
        $query = AnimationAndMotion::latest()->with(['images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $animationAndMotions = $query->paginate(6)->withQueryString();

        return Inertia::render('animation-and-motion/animation-and-motion-page', [
            'animationAndMotions' => $animationAndMotions,
            'filters' => $request->only(['query', 'page']),
        ]);
    }

    /**
     * Display the specified Animation and Motion.
     */
    public function comicArtDetail(AnimationAndMotion $animationAndMotion)
    {
        $animationAndMotion->load('images');

        // Get related Animation and Motion
        $relatedAnimationAndMotions = AnimationAndMotion::where('id', '!=', $animationAndMotion->id)
            ->with(['images'])
            ->take(3)
            ->get();

        return Inertia::render('animation-and-motion/animation-and-motion-detail', [
            'animationAndMotion' => $animationAndMotion,
            'relatedAnimationAndMotions' => $relatedAnimationAndMotions,
        ]);
    }
}
