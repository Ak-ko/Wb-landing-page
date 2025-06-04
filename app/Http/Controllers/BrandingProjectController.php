<?php

namespace App\Http\Controllers;

use App\Models\BrandingProject;
use App\Models\BrandingProjectImage;
use App\Models\BrandingProjectMember;
use App\Models\Tag;
use App\Models\TeamMember;
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
        $teamMembers = TeamMember::all();

        return Inertia::render('admin/branding-projects/create', [
            'tags' => $tags,
            'teamMembers' => $teamMembers,
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
            'service_fees' => 'required|numeric',
            'year' => 'required|numeric',
            'project_keywords' => 'required|string',
            'industry_type' => 'required|string',
            'project_scopes' => 'required|string',
            'project_link' => 'required|string',
            'is_published' => 'required|boolean',
            'tags' => 'required|array',
            'tags.*' => 'exists:tags,id',
            'images' => 'required|array',
            'images.*' => 'required',
            'primary_image_index' => 'nullable|integer',
            'project_members' => 'required|array',
            'project_members.*' => 'required',
        ]);

        $brandingProject = BrandingProject::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'client_company' => $validated['client_company'],
            'client_name' => $validated['client_name'] ?? null,
            'client_email' => $validated['client_email'] ?? null,
            'client_phone' => $validated['client_phone'] ?? null,
            'service_fees' => $validated['service_fees'] ?? null,
            'year' => $validated['year'],
            'project_keywords' => $validated['project_keywords'],
            'project_scopes' => $validated['project_scopes'],
            'project_link' => $validated['project_link'],
            'industry_type' => $validated['industry_type'],
            'is_published' => $validated['is_published'],
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

        if (isset($validated['project_members'])) {
            foreach ($validated['project_members'] as $member) {
                BrandingProjectMember::create([
                    'branding_project_id' => $brandingProject->id,
                    'team_member_id' => $member['team_member_id'],
                    'is_lead' => $member['is_lead'] ?? false,
                ]);
            }
        }

        return redirect()->route('branding-projects.index')
            ->with('success', 'Branding project created successfully.');
    }

    public function show(BrandingProject $brandingProject)
    {
        $brandingProject->load(['tags', 'images', 'members']);

        return Inertia::render('admin/branding-projects/show', [
            'brandingProject' => $brandingProject,
        ]);
    }

    public function edit(BrandingProject $brandingProject)
    {
        $tags = Tag::all();
        $teamMembers = TeamMember::all();

        return Inertia::render('admin/branding-projects/edit', [
            'brandingProject' => $brandingProject->load(['tags', 'images', 'members']),
            'tags' => $tags,
            'teamMembers' => $teamMembers
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
            'year' => 'required|numeric',
            'project_keywords' => 'required|string',
            'project_scopes' => 'required|string',
            'project_link' => 'required|string',
            'industry_type' => 'required|string',
            'is_published' => 'required|boolean',
            'tags' => 'required|array',
            'tags.*' => 'exists:tags,id',
            'images' => 'nullable|array',
            'images.*' => 'required',
            'primary_image_id' => 'nullable|integer',
            'primary_image_index' => 'nullable|integer',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'exists:branding_project_images,id',
            'project_members' => 'required|array',
            'project_members.*' => 'required',
        ]);

        $brandingProject->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'client_company' => $validated['client_company'],
            'client_name' => $validated['client_name'] ?? null,
            'client_email' => $validated['client_email'] ?? null,
            'client_phone' => $validated['client_phone'] ?? null,
            'service_fees' => $validated['service_fees'] ?? null,
            'industry_type' => $validated['industry_type'],
            'project_keywords' => $validated['project_keywords'],
            'project_scopes' => $validated['project_scopes'],
            'project_link' => $validated['project_link'],
            'is_published' => $validated['is_published'],
            'year' => $validated['year'],
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

        if ($request->has('primary_image_id') && $request->input('primary_image_index') === null) {
            $brandingProject->images()->update(['is_primary' => false]);

            BrandingProjectImage::where('id', $request->input('primary_image_id'))
                ->where('branding_project_id', $brandingProject->id)
                ->update(['is_primary' => true]);
        }

        if (isset($validated['project_members'])) {
            $brandingProject->members()->detach();

            foreach ($validated['project_members'] as $member) {
                BrandingProjectMember::create([
                    'branding_project_id' => $brandingProject->id,
                    'team_member_id' => $member['team_member_id'],
                    'is_lead' => $member['is_lead'] ?? false,
                ]);
            }
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

    public function projectsList(Request $request)
    {
        $query = BrandingProject::with(['tags', 'images', 'members'])
            ->published()
            ->latest();

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('client_company', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->tag);
            });
        }

        $projects = $query->paginate(12)->withQueryString();
        $tags = Tag::whereHas('brandingProjects')->get();

        return Inertia::render('branding-projects/branding-projects-page', [
            'projects' => $projects,
            'tags' => $tags,
            'filters' => $request->only(['query', 'tag']),
        ]);
    }

    public function projectDetail(BrandingProject $project)
    {
        $project->load(['tags', 'images', 'members']);

        $relatedProjects = BrandingProject::with(['tags', 'images'])
            ->published()
            ->where('id', '!=', $project->id)
            ->whereHas('tags', function ($query) use ($project) {
                $query->whereIn('tags.id', $project->tags->pluck('id'));
            })
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('branding-projects/branding-project-detail', [
            'project' => $project,
            'relatedProjects' => $relatedProjects,
        ]);
    }
}
