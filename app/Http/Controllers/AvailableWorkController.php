<?php

namespace App\Http\Controllers;

use App\Models\AvailableWork;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailableWorkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AvailableWork::query();

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('label', 'like', "%{$searchQuery}%");
            });
        }

        $availableWorks = $query->ordered()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/available-works/index', [
            'availableWorks' => $availableWorks,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/available-works/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'color' => 'required|string|max:7',
            'text_color' => 'required|string|max:7',
            'is_published' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        AvailableWork::create([
            'label' => $validated['label'],
            'color' => $validated['color'],
            'text_color' => $validated['text_color'],
            'is_published' => $validated['is_published'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return redirect()->route('available-works.index')->with('success', 'Available work created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AvailableWork $availableWork)
    {
        return Inertia::render('admin/available-works/show', [
            'availableWork' => $availableWork,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AvailableWork $availableWork)
    {
        return Inertia::render('admin/available-works/edit', [
            'availableWork' => $availableWork,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AvailableWork $availableWork)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'color' => 'required|string|max:7',
            'text_color' => 'required|string|max:7',
            'is_published' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        $availableWork->update([
            'label' => $validated['label'],
            'color' => $validated['color'],
            'text_color' => $validated['text_color'],
            'is_published' => $validated['is_published'] ?? $availableWork->is_published,
            'order' => $validated['order'] ?? $availableWork->order,
        ]);

        return redirect()->route('available-works.index')
            ->with('success', 'Available work updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AvailableWork $availableWork)
    {
        $availableWork->delete();

        return redirect()->route('available-works.index')->with('success', 'Available work deleted successfully.');
    }
}
