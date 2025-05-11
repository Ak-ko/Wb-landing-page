<?php

namespace App\Http\Controllers;

use App\Models\BrandingProject;
use App\Models\BrandingProjectImage;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandingProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = BrandingProject::query()
            ->with(['tags', 'images' => function ($query) {
                $query->where('is_primary', true);
            }]);

        if ($request->has('query') && $request->query !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('client_company', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $brandingProjects = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/branding-projects/index', [
            'brandingProjects' => $brandingProjects,
            'filters' => $request->only(['query']),
        ]);
    }

    public function create()
    {
        $tags = Tag::all();

        return Inertia::render('admin/branding-projects/create', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_company' => 'required|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_phone' => 'nullable|string|max:255',
            'service_fees' => 'nullable|numeric',
            'service_start_date' => 'nullable|date',
            'service_end_date' => 'nullable|date|after_or_equal:service_start_date',
            'tags' => 'required|array',
            'tags.*' => 'exists:tags,id',
            'images' => 'required|array',
            'images.*' => 'required', // Changed from 'image|max:5120' to handle both files and strings
            'primary_image_index' => 'nullable|integer',
        ]);

        $brandingProject = BrandingProject::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'client_company' => $validated['client_company'],
            'client_name' => $validated['client_name'] ?? null,
            'client_email' => $validated['client_email'] ?? null,
            'client_phone' => $validated['client_phone'] ?? null,
            'service_fees' => $validated['service_fees'] ?? null,
            'service_start_date' => $validated['service_start_date'] ?? null,
            'service_end_date' => $validated['service_end_date'] ?? null,
        ]);

        if (isset($validated['tags'])) {
            $brandingProject->tags()->attach($validated['tags']);
        }

        if (isset($validated['images']) && is_array($validated['images'])) {
            $primaryIndex = $request->input('primary_image_index', 0);

            foreach ($validated['images'] as $index => $image) {
                if (is_string($image)) {
                    $path = $image;
                }

                BrandingProjectImage::create([
                    'branding_project_id' => $brandingProject->id,
                    'image' => $path,
                    'is_primary' => $index == $primaryIndex,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('branding-projects.index')
            ->with('success', 'Branding project created successfully.');
    }

    public function show(BrandingProject $brandingProject)
    {
        $brandingProject->load(['tags', 'images']);

        return Inertia::render('admin/branding-projects/show', [
            'brandingProject' => $brandingProject,
        ]);
    }

    public function edit(BrandingProject $brandingProject)
    {

        $tags = Tag::all();

        return Inertia::render('admin/branding-projects/edit', [
            'brandingProject' => $brandingProject->load(['tags', 'images']),
            'tags' => $tags,
        ]);
    }

    public function update(Request $request, BrandingProject $brandingProject)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_company' => 'required|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_phone' => 'nullable|string|max:255',
            'service_fees' => 'nullable|numeric',
            'service_start_date' => 'nullable|date',
            'service_end_date' => 'nullable|date|after_or_equal:service_start_date',
            'tags' => 'required|array',
            'tags.*' => 'exists:tags,id',
            'images' => 'nullable|array',
            'images.*' => 'required', // Changed from 'image|max:5120' to handle both files and strings
            'primary_image_id' => 'nullable|integer',
            'primary_image_index' => 'nullable|integer',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'exists:branding_project_images,id',
        ]);

        $brandingProject->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'client_company' => $validated['client_company'],
            'client_name' => $validated['client_name'] ?? null,
            'client_email' => $validated['client_email'] ?? null,
            'client_phone' => $validated['client_phone'] ?? null,
            'service_fees' => $validated['service_fees'] ?? null,
            'service_start_date' => $validated['service_start_date'] ?? null,
            'service_end_date' => $validated['service_end_date'] ?? null,
        ]);

        if (isset($validated['tags'])) {
            $brandingProject->tags()->sync($validated['tags']);
        } else {
            $brandingProject->tags()->detach();
        }

        if (isset($validated['removed_images'])) {
            $imagesToDelete = BrandingProjectImage::whereIn('id', $validated['removed_images'])
                ->where('branding_project_id', $brandingProject->id)
                ->get();

            foreach ($imagesToDelete as $image) {
                $image->delete();
            }
        }

        if (isset($validated['images']) && is_array($validated['images'])) {
            $existingImagesCount = $brandingProject->images()->count();
            $primaryIndex = $request->input('primary_image_index');

            if ($primaryIndex !== null) {
                $brandingProject->images()->update(['is_primary' => false]);
            }

            foreach ($validated['images'] as $index => $image) {
                if (is_string($image)) {
                    $path = $image;
                } else {
                    $path = $image->store('branding-projects', 'public');
                }

                BrandingProjectImage::create([
                    'branding_project_id' => $brandingProject->id,
                    'image' => $path,
                    'is_primary' => $primaryIndex !== null && $index == $primaryIndex,
                    'order' => $existingImagesCount + $index,
                ]);
            }
        }

        // Update primary image if needed
        if ($request->has('primary_image_id') && $request->input('primary_image_index') === null) {
            $brandingProject->images()->update(['is_primary' => false]);

            BrandingProjectImage::where('id', $request->input('primary_image_id'))
                ->where('branding_project_id', $brandingProject->id)
                ->update(['is_primary' => true]);
        }

        return redirect()->route('branding-projects.index')
            ->with('success', 'Branding project updated successfully.');
    }

    public function destroy(BrandingProject $brandingProject)
    {
        // Delete associated images from storage
        foreach ($brandingProject->images as $image) {
            Storage::disk('public')->delete($image->image);
        }

        $brandingProject->delete();

        return redirect()->route('branding-projects.index')
            ->with('success', 'Branding project deleted successfully.');
    }
}
