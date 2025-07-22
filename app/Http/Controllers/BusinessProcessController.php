<?php

namespace App\Http\Controllers;

use App\Models\BusinessProcess;
use App\Traits\ChunkUploadHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessProcessController extends Controller
{
    use ChunkUploadHandler;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = BusinessProcess::query();

        if ($request->has('query') && !empty($request->query('query'))) {
            $searchQuery = $request->query('query');
            $query->where('title', 'like', "%{$searchQuery}%")
                ->orWhere('description', 'like', "%{$searchQuery}%");
        }

        $businessProcesses = $query->latest()->paginate($request->query('perPage', 10));

        return Inertia::render('admin/business-processes/index', [
            'businessProcesses' => $businessProcesses,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/business-processes/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'color_tag' => 'nullable|string|max:50',
            'step' => 'nullable|integer|unique:business_processes,step',
            'is_active' => 'boolean',
        ]);

        BusinessProcess::create($validated);

        return redirect()->route('business-processes.index')->with('success', 'Creative process created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BusinessProcess $businessProcess)
    {
        return Inertia::render('admin/business-processes/show', [
            'businessProcess' => $businessProcess,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BusinessProcess $businessProcess)
    {
        return Inertia::render('admin/business-processes/edit', [
            'businessProcess' => $businessProcess,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BusinessProcess $businessProcess)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'color_tag' => 'nullable|string|max:50',
            'step' => 'nullable|integer|unique:business_processes,step,' . $businessProcess->id . ',id',
            'is_active' => 'boolean',
        ]);

        $businessProcess->update($validated);

        return redirect()->route('business-processes.index')->with('success', 'Creative process updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BusinessProcess $businessProcess)
    {
        $businessProcess->delete();

        return redirect()->route('business-processes.index')->with('success', 'Creative process deleted successfully.');
    }
}
