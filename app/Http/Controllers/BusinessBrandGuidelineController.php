<?php

namespace App\Http\Controllers;

use App\Models\BusinessBrandGuideline;
use App\Models\BrandGuidelineElement;
use App\Models\BrandGuidelineElementItem;
use App\Traits\HasDuplicateFunctionality;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BusinessBrandGuidelineController extends Controller
{
    use HasDuplicateFunctionality;
    public function index(Request $request)
    {
        $guidelines = BusinessBrandGuideline::with('elements.items')
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/business-brand-guidelines/index', [
            'guidelines' => $guidelines,
            'filters' => $request->only(['query']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/business-brand-guidelines/create');
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
            $guideline = BusinessBrandGuideline::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
            ]);

            foreach ($validated['elements'] as $elementData) {
                $element = $guideline->elements()->create([
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

        return redirect()->route('business-brand-guidelines.index')->with('success', 'Guideline created successfully.');
    }

    public function show(BusinessBrandGuideline $businessBrandGuideline)
    {
        return Inertia::render('admin/business-brand-guidelines/show', [
            'guideline' => $businessBrandGuideline->load('elements.items')
        ]);
    }

    public function edit(BusinessBrandGuideline $businessBrandGuideline)
    {
        return Inertia::render('admin/business-brand-guidelines/edit', [
            'guideline' => $businessBrandGuideline->load('elements.items')
        ]);
    }

    public function update(Request $request, BusinessBrandGuideline $businessBrandGuideline)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'elements' => 'required|array|min:1',
            'elements.*.id' => 'nullable|integer|exists:brand_guideline_elements,id',
            'elements.*.title' => 'required|string|max:255',
            'elements.*.order' => 'nullable|numeric',
            'elements.*.items' => 'required|array|min:1',
            'elements.*.items.*.id' => 'nullable|integer|exists:brand_guideline_element_items,id',
            'elements.*.items.*.title' => 'required|string|max:255',
            'elements.*.items.*.order' => 'nullable|numeric',
        ], [
            'elements.*.title' => 'The element title is required.',
            'elements.*.order' => 'The element order is required.',
            'elements.*.items.*.title' => 'The item title is required.',
            'elements.*.items.*.order' => 'The item order is required.',
        ]);

        DB::transaction(function () use ($businessBrandGuideline, $validated) {
            $businessBrandGuideline->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
            ]);

            $existingElementIds = $businessBrandGuideline->elements()->pluck('id')->toArray();
            $submittedElementIds = collect($validated['elements'])->pluck('id')->filter()->toArray();
            $elementsToDelete = array_diff($existingElementIds, $submittedElementIds);
            BrandGuidelineElement::whereIn('id', $elementsToDelete)->delete();

            foreach ($validated['elements'] as $elementData) {
                $element = null;
                if (!empty($elementData['id'])) {
                    $element = BrandGuidelineElement::find($elementData['id']);
                    $element->update([
                        'title' => $elementData['title'],
                        'order' => $elementData['order'] ?? null,
                    ]);
                } else {
                    $element = $businessBrandGuideline->elements()->create([
                        'title' => $elementData['title'],
                        'order' => $elementData['order'] ?? null,
                    ]);
                }

                $existingItemIds = $element->items()->pluck('id')->toArray();
                $submittedItemIds = collect($elementData['items'])->pluck('id')->filter()->toArray();
                $itemsToDelete = array_diff($existingItemIds, $submittedItemIds);
                BrandGuidelineElementItem::whereIn('id', $itemsToDelete)->delete();

                foreach ($elementData['items'] as $itemData) {
                    if (!empty($itemData['id'])) {
                        $item = BrandGuidelineElementItem::find($itemData['id']);
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

        return redirect()->route('business-brand-guidelines.index')->with('success', 'Guideline updated successfully.');
    }

    public function destroy(BusinessBrandGuideline $businessBrandGuideline)
    {
        $businessBrandGuideline->delete();
        return redirect()->route('business-brand-guidelines.index')->with('success', 'Guideline deleted successfully.');
    }

    public function duplicate(Request $request)
    {
        return $this->duplicateRecord(
            $request,
            BusinessBrandGuideline::class,
            ['title', 'description'],
            ['elements' => ['items']]
        );
    }
}
