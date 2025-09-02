<?php

namespace App\Http\Controllers;

use App\Models\ExpertiseSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpertiseSectionController extends Controller
{
    public function index(Request $request)
    {
        $query = ExpertiseSection::query();

        if ($request->has('query') && $request->query !== '') {
            $searchQuery = $request->query('query');
            $query->where('title', 'like', "%{$searchQuery}%")
                ->orWhere('type', 'like', "%{$searchQuery}%");
        }

        $expertiseSections = $query->ordered()
            ->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/expertise-sections/index', [
            'expertiseSections' => $expertiseSections,
            'filters' => $request->only(['query']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/expertise-sections/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:business,established',
            'plans' => 'required|array|min:1',
            'plans.*.text' => 'required|string|max:255',
            'plans.*.order' => 'required|integer|min:0',
            'color' => 'required|string|max:7', // hex color
            'order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Sort plans by order
        $plans = collect($validated['plans'])->sortBy('order')->values()->toArray();
        $validated['plans'] = $plans;

        ExpertiseSection::create($validated);

        return redirect()->route('expertise-sections.index')
            ->with('success', 'Expertise section created successfully.');
    }

    public function show(ExpertiseSection $expertiseSection)
    {
        return Inertia::render('admin/expertise-sections/show', [
            'expertiseSection' => $expertiseSection,
        ]);
    }

    public function edit(ExpertiseSection $expertiseSection)
    {
        return Inertia::render('admin/expertise-sections/edit', [
            'expertiseSection' => $expertiseSection,
        ]);
    }

    public function update(Request $request, ExpertiseSection $expertiseSection)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:business,established',
            'plans' => 'required|array|min:1',
            'plans.*.text' => 'required|string|max:255',
            'plans.*.order' => 'required|integer|min:0',
            'color' => 'required|string|max:7', // hex color
            'order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Sort plans by order
        $plans = collect($validated['plans'])->sortBy('order')->values()->toArray();
        $validated['plans'] = $plans;

        $expertiseSection->update($validated);

        return redirect()->route('expertise-sections.index')
            ->with('success', 'Expertise section updated successfully.');
    }

    public function destroy(ExpertiseSection $expertiseSection)
    {
        $expertiseSection->delete();

        return redirect()->route('expertise-sections.index')
            ->with('success', 'Expertise section deleted successfully.');
    }

    // API method for frontend
    public function getActiveSections()
    {
        $sections = ExpertiseSection::active()
            ->ordered()
            ->get();

        return response()->json($sections);
    }
}
