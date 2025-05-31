<?php

namespace App\Http\Controllers;

use App\Models\BusinessPackageAddon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessPackageAddonController extends Controller
{
    public function index(Request $request)
    {
        $businessPackageAddons = BusinessPackageAddon::query()
            ->when($request->input('query'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        $filters = $request->only(['query']);

        return Inertia::render('admin/business-package-addons/index', [
            'businessPackageAddons' => $businessPackageAddons,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/business-package-addons/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:business_package_addons',
            'price_text' => 'required|string',
            'currency' => 'required|string|max:3',
        ], [
            'price_text.required' => 'The price field is required.',
        ]);

        BusinessPackageAddon::create($validated);

        return redirect()->route('add-on-packages.index')->with('success', 'Package created successfully.');
    }

    public function show($id)
    {
        return Inertia::render('admin/business-package-addons/show', [
            'businessPackageAddon' => BusinessPackageAddon::findOrFail($id),
        ]);
    }

    public function edit($id)
    {
        return Inertia::render('admin/business-package-addons/edit', [
            'businessPackageAddon' => BusinessPackageAddon::findOrFail($id),
        ]);
    }

    public function update(Request $request, $id)
    {
        $businessPackageAddon = BusinessPackageAddon::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:business_package_addons,name,' . $businessPackageAddon->id,
            'price_text' => 'required|string',
            'currency' => 'required|string|max:3',
        ], [
            'price_text.required' => 'The price field is required.',
        ]);

        $businessPackageAddon->update($validated);

        return redirect()->route('add-on-packages.index')->with('success', 'Package updated successfully.');
    }

    public function destroy($id)
    {
        $businessPackageAddon = BusinessPackageAddon::findOrFail($id);

        $businessPackageAddon->delete();

        return redirect()->route('add-on-packages.index')->with('success', 'Package deleted successfully.');
    }
}
