<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamMemberController extends Controller
{
    public function index(Request $request)
    {
        $query = TeamMember::query();

        if ($request->has('query') && $request->query('query')) {
            $searchTerm = $request->query('query');
            $query->where('name', 'like', "%{$searchTerm}%")
                ->orWhere('designation', 'like', "%{$searchTerm}%");
        }

        $teamMembers = $query->orderBy('name')
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/team-members/index', [
            'teamMembers' => $teamMembers,
            'filters' => $request->only(['query']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/team-members/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'mascot_image' => 'required|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'social_links' => 'nullable|json',
            'image' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'bio' => 'nullable|string|max:255',
        ]);

        TeamMember::create($validated);

        return redirect()->route('team-members.index')
            ->with('success', 'Team member created successfully.');
    }

    public function edit(TeamMember $teamMember)
    {
        return Inertia::render('admin/team-members/edit', [
            'teamMember' => $teamMember,
        ]);
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'mascot_image' => 'required|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'social_links' => 'nullable|json',
            'image' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'bio' => 'nullable|string|max:255',
        ]);

        $teamMember->update($validated);

        return redirect()->route('team-members.index')
            ->with('success', 'Team member updated successfully.');
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();

        return redirect()->route('team-members.index')
            ->with('success', 'Team member deleted successfully.');
    }

    public function toggleActive(TeamMember $teamMember)
    {
        $teamMember->is_active = !$teamMember->is_active;
        $teamMember->save();

        return back()->with('success', 'Team member status updated successfully.');
    }
}
