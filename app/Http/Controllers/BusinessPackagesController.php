<?php

namespace App\Http\Controllers;

use App\Models\BusinessPackages;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessPackagesController extends Controller
{
    public function index(Request $request)
    {
        $packages = BusinessPackages::query()
            ->with('businessPackageItems:id')
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/business-packages/index', [
            'packages' => $packages,
            'filters' => $request->only(['query']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/business-packages/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price_text' => 'required|string',
            'currency' => 'required|string|max:3',
            'revision_remarks' => 'required|string',
            'items' => 'required|array|min:2',
            'duration' => 'required|string|max:255',
            'items.*.name' => 'required|string|max:255',
        ], [
            'items.*.name.required' => 'Item name is required.',
        ]);


        $businessPackage = BusinessPackages::create($validated);

        foreach ($validated['items'] as $itemData) {
            $businessPackage->businessPackageItems()->create($itemData);
        }

        return redirect()->route('business-packages.index')->with('success', 'Package created successfully.');
    }

    public function show(BusinessPackages $businessPackage)
    {
        return Inertia::render('admin/business-packages/show', ['businessPackage' => $businessPackage->load('businessPackageItems')]);
    }

    public function edit(BusinessPackages $businessPackage)
    {
        return Inertia::render('admin/business-packages/edit', ['package' => $businessPackage->load('businessPackageItems')]);
    }

    public function update(Request $request, BusinessPackages $businessPackage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_text' => 'nullable|string',
            'currency' => 'nullable|string|max:3',
            'revision_remarks' => 'nullable|string',
            'items' => 'required|array|min:2',
            'duration' => 'required|string|max:255',
            'items.*.name' => 'required|string|max:255',
        ], [
            'items.*.name.required' => 'Item name is required.',
        ]);

        $businessPackage->update($validated);

        $businessPackage->businessPackageItems()->delete();
        $businessPackage->businessPackageItems()->detach();

        foreach ($validated['items'] as $itemData) {
            $businessPackage->businessPackageItems()->create($itemData);
        }

        return redirect()->route('business-packages.index')->with('success', 'Package updated successfully.');
    }

    public function destroy(BusinessPackages $businessPackage)
    {
        $businessPackage->delete();

        return redirect()->route('business-packages.index')->with('success', 'Package deleted successfully.');
    }
}
