<?php

namespace App\Http\Controllers;

use App\Models\BrandStrategy;
use App\Models\BrandStrategyElement;
use App\Models\BrandStrategyElementItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BrandStrategyController extends Controller
{
    public function index(Request $request)
    {
        $strategies = BrandStrategy::with('elements.items')
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/brand-strategies/index', [
            'strategies' => $strategies,
            'filters' => $request->only(['query']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/brand-strategies/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'elements' => 'required|array|min:1',
            'elements.*.title' => 'required|string|max:255',
            'elements.*.order' => 'nullable|numeric',
            'elements.*.items' => 'required|array|min:1',
            'elements.*.items.*.title' => 'required|string|max:255',
            'elements.*.items.*.order' => 'nullable|numeric',
        ], [
            'elements.*.title' => 'The element title is required.',
            'elements.*.order' => 'The element order is required.',
            'elements.*.items.*.title' => 'The item title is required.',
            'elements.*.items.*.order' => 'The item order is required.',
        ]);

        DB::transaction(function () use ($validated) {
            $strategy = BrandStrategy::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
            ]);

            foreach ($validated['elements'] as $elementData) {
                $element = $strategy->elements()->create([
                    'title' => $elementData['title'],
                    'order' => $elementData['order'] ?? null,
                ]);
                foreach ($elementData['items'] as $itemData) {
                    $element->items()->create([
                        'title' => $itemData['title'],
                        'order' => $itemData['order'] ?? null,
                    ]);
                }
            }
        });

        return redirect()->route('brand-strategies.index')->with('success', 'Strategy created successfully.');
    }

    public function show(BrandStrategy $brandStrategy)
    {
        return Inertia::render('admin/brand-strategies/show', [
            'strategy' => $brandStrategy->load('elements.items')
        ]);
    }

    public function edit(BrandStrategy $brandStrategy)
    {
        return Inertia::render('admin/brand-strategies/edit', [
            'strategy' => $brandStrategy->load('elements.items')
        ]);
    }

    public function update(Request $request, BrandStrategy $brandStrategy)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'elements' => 'required|array|min:1',
            'elements.*.id' => 'nullable|integer|exists:brand_strategy_elements,id',
            'elements.*.title' => 'required|string|max:255',
            'elements.*.order' => 'nullable|numeric',
            'elements.*.items' => 'required|array|min:1',
            'elements.*.items.*.id' => 'nullable|integer|exists:brand_strategy_element_items,id',
            'elements.*.items.*.title' => 'required|string|max:255',
            'elements.*.items.*.order' => 'nullable|numeric',
        ], [
            'elements.*.title' => 'The element title is required.',
            'elements.*.order' => 'The element order is required.',
            'elements.*.items.*.title' => 'The item title is required.',
            'elements.*.items.*.order' => 'The item order is required.',
        ]);

        DB::transaction(function () use ($brandStrategy, $validated) {
            $brandStrategy->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
            ]);

            $existingElementIds = $brandStrategy->elements()->pluck('id')->toArray();
            $submittedElementIds = collect($validated['elements'])->pluck('id')->filter()->toArray();
            $elementsToDelete = array_diff($existingElementIds, $submittedElementIds);
            BrandStrategyElement::whereIn('id', $elementsToDelete)->delete();

            foreach ($validated['elements'] as $elementData) {
                $element = null;
                if (!empty($elementData['id'])) {
                    $element = BrandStrategyElement::find($elementData['id']);
                    $element->update([
                        'title' => $elementData['title'],
                        'order' => $elementData['order'] ?? null,
                    ]);
                } else {
                    $element = $brandStrategy->elements()->create([
                        'title' => $elementData['title'],
                        'order' => $elementData['order'] ?? null,
                    ]);
                }

                $existingItemIds = $element->items()->pluck('id')->toArray();
                $submittedItemIds = collect($elementData['items'])->pluck('id')->filter()->toArray();
                $itemsToDelete = array_diff($existingItemIds, $submittedItemIds);
                BrandStrategyElementItem::whereIn('id', $itemsToDelete)->delete();

                foreach ($elementData['items'] as $itemData) {
                    if (!empty($itemData['id'])) {
                        $item = BrandStrategyElementItem::find($itemData['id']);
                        $item->update([
                            'title' => $itemData['title'],
                            'order' => $itemData['order'] ?? null,
                        ]);
                    } else {
                        $element->items()->create([
                            'title' => $itemData['title'],
                            'order' => $itemData['order'] ?? null,
                        ]);
                    }
                }
            }
        });

        return redirect()->route('brand-strategies.index')->with('success', 'Strategy updated successfully.');
    }

    public function destroy(BrandStrategy $brandStrategy)
    {
        $brandStrategy->delete();
        return redirect()->route('brand-strategies.index')->with('success', 'Strategy deleted successfully.');
    }
}
