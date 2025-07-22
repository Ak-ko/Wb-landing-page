<?php

namespace App\Http\Controllers;

use App\Models\Color;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $colors = Color::getGroupedColors();

        return Inertia::render('admin/theme-colors/index', [
            'colors' => $colors,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not needed since we're using modal
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'type' => ['required', 'in:white_bg,black_bg'],
        ], [
            'color.regex' => 'Color must be a valid hex color code (e.g., #FF0000)',
        ]);

        Color::create($validated);

        return redirect()->back()->with('success', 'Color added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Color $color)
    {
        // Not needed for this implementation
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Color $color)
    {
        // Not needed since we're using modal
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Color $color)
    {
        $validated = $request->validate([
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'type' => ['required', 'in:white_bg,black_bg'],
        ], [
            'color.regex' => 'Color must be a valid hex color code (e.g., #FF0000)',
        ]);

        $color->update($validated);

        return redirect()->back()->with('success', 'Color updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $color = Color::find($id);

        if (!$color) {
            return redirect()->back()->with('error', 'Color not found');
        }

        $color->delete();

        return redirect()->back()->with('success', 'Color removed successfully!');
    }
}
