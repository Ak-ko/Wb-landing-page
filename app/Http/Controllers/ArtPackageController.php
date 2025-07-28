<?php

namespace App\Http\Controllers;

use App\Models\ArtPackage;
use App\Enums\ArtPackageType;
use App\Traits\HasDuplicateFunctionality;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ArtPackageController extends Controller
{
    use HasDuplicateFunctionality;

    public function index(Request $request)
    {
        $filters = $request->only(['query', 'type']);

        $packages = ArtPackage::query()
            ->with(['items', 'prices'])
            ->when($filters['query'] ?? null, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($filters['type'] ?? null, function ($query, $type) {
                $query->where('type', $type);
            })
            ->paginate($request->input('perPage', 5))
            ->withQueryString();

        $types = collect(ArtPackageType::cases())->map(fn($case) => [
            'name' => ucwords($case->name),
            'value' => $case->value,
        ]);

        return Inertia::render('admin/art-packages/index', [
            'packages' => $packages,
            'types' => $types,
            'filters' => $request->only(['query', 'type']),
        ]);
    }

    public function create()
    {
        $types = collect(ArtPackageType::cases())->map(fn($case) => [
            'name' => ucwords($case->name),
            'value' => $case->value,
        ]);

        return Inertia::render('admin/art-packages/create', [
            'types' => $types,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:' . implode(',', array_column(ArtPackageType::cases(), 'value')),
            'color' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.item' => 'required|string|max:255',
            'prices' => 'required|array|min:1',
            'prices.*.price' => 'required|string',
            'prices.*.duration' => 'required|string|max:255',
        ], [
            'items.*.item.required' => 'Item description is required.',
            'prices.*.price.required' => 'Price is required.',
            'prices.*.duration.required' => 'Duration is required.',
        ]);

        $artPackage = ArtPackage::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'type' => $validated['type'],
            'color' => $validated['color'],
        ]);

        foreach ($validated['items'] as $itemData) {
            $artPackage->items()->create([
                'item' => $itemData['item'],
            ]);
        }

        foreach ($validated['prices'] as $priceData) {
            $artPackage->prices()->create([
                'price' => $priceData['price'],
                'duration' => $priceData['duration'],
            ]);
        }

        return redirect()->route('art-packages.index')->with('success', 'Art package created successfully.');
    }

    public function show(ArtPackage $artPackage)
    {
        return Inertia::render('admin/art-packages/show', [
            'artPackage' => $artPackage->load(['items', 'prices']),
        ]);
    }

    public function edit(ArtPackage $artPackage)
    {
        $types = collect(ArtPackageType::cases())->map(fn($case) => [
            'name' => ucwords($case->name),
            'value' => $case->value,
        ]);

        return Inertia::render('admin/art-packages/edit', [
            'package' => $artPackage->load(['items', 'prices']),
            'types' => $types,
        ]);
    }

    public function update(Request $request, ArtPackage $artPackage)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:' . implode(',', array_column(ArtPackageType::cases(), 'value')),
            'color' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.item' => 'required|string|max:255',
            'prices' => 'required|array|min:1',
            'prices.*.price' => 'required|string',
            'prices.*.duration' => 'required|string|max:255',
        ], [
            'items.*.item.required' => 'Item description is required.',
            'prices.*.price.required' => 'Price is required.',
            'prices.*.duration.required' => 'Duration is required.',
        ]);

        $artPackage->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'type' => $validated['type'],
            'color' => $validated['color'],
        ]);

        // Delete existing items and prices
        $artPackage->items()->delete();
        $artPackage->prices()->delete();

        // Create new items
        foreach ($validated['items'] as $itemData) {
            $artPackage->items()->create([
                'item' => $itemData['item'],
            ]);
        }

        // Create new prices
        foreach ($validated['prices'] as $priceData) {
            $artPackage->prices()->create([
                'price' => $priceData['price'],
                'duration' => $priceData['duration'],
            ]);
        }

        return redirect()->route('art-packages.index')->with('success', 'Art package updated successfully.');
    }

    public function destroy(ArtPackage $artPackage)
    {
        // This will cascade delete related items and prices due to foreign key constraints
        $artPackage->delete();

        return redirect()->route('art-packages.index')->with('success', 'Art package deleted successfully.');
    }

    public function duplicate(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:art_packages,id',
        ]);

        $originalPackage = ArtPackage::with(['items', 'prices'])->findOrFail($request->id);

        $duplicatedPackage = DB::transaction(function () use ($originalPackage) {
            // Create the duplicated package
            $duplicateData = [
                'title' => $originalPackage->title . ' (Copy)',
                'description' => $originalPackage->description,
                'type' => $originalPackage->type,
                'color' => $originalPackage->color,
            ];

            $duplicatedPackage = ArtPackage::create($duplicateData);

            // Duplicate items
            foreach ($originalPackage->items as $item) {
                $duplicatedPackage->items()->create([
                    'item' => $item->item,
                ]);
            }

            // Duplicate prices
            foreach ($originalPackage->prices as $price) {
                $duplicatedPackage->prices()->create([
                    'price' => $price->price,
                    'duration' => $price->duration,
                ]);
            }

            return $duplicatedPackage;
        });

        return back()->with('duplicated_id', $duplicatedPackage->id);
    }
}
