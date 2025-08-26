<?php

namespace App\Http\Controllers;

use App\Enums\TagType;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $query = Tag::query();

        if ($request->has('query') && $request->query !== '') {
            $searchQuery = $request->query('query');
            $query->where('name', 'like', "%{$searchQuery}%");
        }

        $tags = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/tags/index', [
            'tags' => $tags,
            'filters' => $request->only(['query']),
            'tagTypes' => TagType::options(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'text_color' => 'required|string|max:255',
            'type' => 'nullable|string|in:' . implode(',', array_column(TagType::cases(), 'value')),
        ]);

        Tag::create($validated);

        return redirect()->route('tags.index')
            ->with('success', 'Tag created successfully.');
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'text_color' => 'required|string|max:255',
            'type' => 'nullable|string|in:' . implode(',', array_column(TagType::cases(), 'value')),
        ]);

        $tag->update($validated);

        return redirect()->route('tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->route('tags.index')
            ->with('success', 'Tag deleted successfully.');
    }
}
