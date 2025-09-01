<?php

namespace App\Http\Controllers;

use App\Models\ProjectShowcase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectShowcaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProjectShowcase::ordered();

        if ($request->filled('query')) {
            $query->where('content', 'like', '%' . $request->get('query') . '%');
        }

        $projectShowcases = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/project-showcases/index', [
            'projectShowcases' => $projectShowcases,
            'filters' => [
                'query' => $request->get('query'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/project-showcases/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'image' => 'required|string',
            'is_featured' => 'boolean',
            'order' => 'required|integer|min:0',
        ]);

        ProjectShowcase::create($validated);

        return redirect()->route('project-showcases.index')
            ->with('success', 'Project Showcase created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectShowcase $projectShowcase)
    {
        return Inertia::render('admin/project-showcases/show', [
            'projectShowcase' => $projectShowcase,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjectShowcase $projectShowcase)
    {
        return Inertia::render('admin/project-showcases/edit', [
            'projectShowcase' => $projectShowcase,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProjectShowcase $projectShowcase)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'image' => 'required|string',
            'is_featured' => 'boolean',
            'order' => 'required|integer|min:0',
        ]);

        $projectShowcase->update($validated);

        return redirect()->route('project-showcases.index')
            ->with('success', 'Project Showcase updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectShowcase $projectShowcase)
    {
        $projectShowcase->delete();

        return redirect()->route('project-showcases.index')
            ->with('success', 'Project Showcase deleted successfully.');
    }
}
