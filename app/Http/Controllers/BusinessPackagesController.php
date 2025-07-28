<?php

namespace App\Http\Controllers;

use App\Models\BusinessBrandGuideline;
use App\Models\BusinessPackages;
use App\Models\BrandStrategy;
use App\Models\BusinessPackageItems;
use App\Traits\HasDuplicateFunctionality;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BusinessPackagesController extends Controller
{
    use HasDuplicateFunctionality;

    public function index(Request $request)
    {
        $packages = BusinessPackages::query()
            ->with('businessPackageItems:id', 'brandGuideline', 'durations', 'brandStrategy')
            ->when($request->input('query'), function ($query, $queryString) {
                $query->where('name', 'like', '%' . $queryString . '%');
            })
            ->when($request->input('guideline_id'), function ($query, $guidelineId) {
                $query->where('business_brand_guideline_id', $guidelineId);
            })
            ->when($request->input('brand_strategy_id'), function ($query, $brandStrategyId) {
                $query->where('brand_strategy_id', $brandStrategyId);
            })
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        $businessBrandGuidelines = BusinessBrandGuideline::all();
        $brandStrategies = BrandStrategy::all();

        return Inertia::render('admin/business-packages/index', [
            'packages' => $packages,
            'filters' => $request->only(['query', 'guideline_id', 'brand_strategy_id']),
            'businessBrandGuidelines' => $businessBrandGuidelines,
            'brandStrategies' => $brandStrategies,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/business-packages/create', [
            'businessBrandGuidelines' => BusinessBrandGuideline::all(),
            'brandStrategies' => BrandStrategy::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price_text' => 'required|string',
            'price' => 'required|numeric',
            'currency' => 'required|string|max:3',
            'color' => 'required|string',
            'items' => 'required|array|min:2',
            'durations' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.is_included' => 'required|boolean',
            'items.*.detail_link' => 'nullable|string|max:255|url',
            'durations.*.duration' => 'required|string|max:255',
            'durations.*.duration_remarks' => 'nullable|string',
            'is_recommended' => 'required|boolean',
            'is_discount' => 'boolean',
            'discount_price_text' => 'required_if:is_discount,true|string|nullable',
            'discount_description' => 'nullable|string',
            'discount_end_date' => 'required_if:is_discount,true|date|nullable',
            'business_brand_guideline_id' => 'nullable|integer|exists:business_brand_guidelines,id',
            'brand_strategy_id' => 'nullable|integer|exists:brand_strategies,id',
        ], [
            'items.*.name.required' => 'Item name is required.',
            'durations.*.duration.required' => 'Duration is required.',
            'discount_price_text.required_if' => 'Discount price is required when discount is active.',
            'discount_end_date.required_if' => 'Discount end date is required when discount is active.',
        ]);

        // Extract durations from validated data
        $durations = $validated['durations'];
        unset($validated['durations']);

        $businessPackage = BusinessPackages::create($validated);

        // Create durations
        foreach ($durations as $durationData) {
            $businessPackage->durations()->create($durationData);
        }

        // Create package items and attach them
        $itemIds = [];
        foreach ($validated['items'] as $itemData) {
            $item = BusinessPackageItems::create($itemData);
            $itemIds[] = $item->id;
        }
        $businessPackage->businessPackageItems()->attach($itemIds);

        return redirect()->route('business-packages.index')->with('success', 'Package created successfully.');
    }

    public function show(BusinessPackages $businessPackage)
    {
        return Inertia::render('admin/business-packages/show', [
            'businessPackage' => $businessPackage->load('businessPackageItems', 'brandGuideline', 'durations', 'brandStrategy')
        ]);
    }

    public function edit(BusinessPackages $businessPackage)
    {
        return Inertia::render('admin/business-packages/edit', [
            'package' => $businessPackage->load('businessPackageItems', 'brandGuideline', 'durations', 'brandStrategy'),
            'businessBrandGuidelines' => BusinessBrandGuideline::all(),
            'brandStrategies' => BrandStrategy::all(),
        ]);
    }

    public function update(Request $request, BusinessPackages $businessPackage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_text' => 'nullable|string',
            'price' => 'required|numeric',
            'currency' => 'nullable|string|max:3',
            'color' => 'required|string',
            'items' => 'required|array|min:2',
            'durations' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.is_included' => 'required|boolean',
            'items.*.detail_link' => 'nullable|string|max:255|url',
            'durations.*.duration' => 'required|string|max:255',
            'durations.*.duration_remarks' => 'nullable|string',
            'is_recommended' => 'required|boolean',
            'is_discount' => 'boolean',
            'discount_price_text' => 'required_if:is_discount,true|string|nullable',
            'discount_description' => 'nullable|string',
            'discount_end_date' => 'required_if:is_discount,true|date|nullable',
            'business_brand_guideline_id' => 'nullable|integer|exists:business_brand_guidelines,id',
            'brand_strategy_id' => 'nullable|integer|exists:brand_strategies,id',
        ], [
            'items.*.name.required' => 'Item name is required.',
            'durations.*.duration.required' => 'Duration is required.',
            'discount_price_text.required_if' => 'Discount price is required when discount is active.',
            'discount_end_date.required_if' => 'Discount end date is required when discount is active.',
        ]);

        // Extract durations from validated data
        $durations = $validated['durations'];
        unset($validated['durations']);

        $businessPackage->update($validated);

        // Update durations
        $businessPackage->durations()->delete();
        foreach ($durations as $durationData) {
            $businessPackage->durations()->create($durationData);
        }

        // Update package items
        $businessPackage->businessPackageItems()->detach();

        $itemIds = [];
        foreach ($validated['items'] as $itemData) {
            $item = BusinessPackageItems::create($itemData);
            $itemIds[] = $item->id;
        }
        $businessPackage->businessPackageItems()->attach($itemIds);

        return redirect()->route('business-packages.index')->with('success', 'Package updated successfully.');
    }

    public function destroy(BusinessPackages $businessPackage)
    {
        $businessPackage->delete();

        return redirect()->route('business-packages.index')->with('success', 'Package deleted successfully.');
    }

    public function duplicate(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:business_packages,id',
        ]);

        $originalPackage = BusinessPackages::with(['businessPackageItems', 'durations'])->findOrFail($request->id);

        $duplicatedPackage = DB::transaction(function () use ($originalPackage) {
            // Create the duplicated package
            $duplicateData = [
                'name' => $originalPackage->name . ' (Copy)',
                'description' => $originalPackage->description,
                'price_text' => $originalPackage->price_text,
                'price' => $originalPackage->price,
                'currency' => $originalPackage->currency,
                'color' => $originalPackage->color,
                'is_recommended' => $originalPackage->is_recommended,
                'is_discount' => $originalPackage->is_discount,
                'discount_price_text' => $originalPackage->discount_price_text,
                'discount_description' => $originalPackage->discount_description,
                'discount_end_date' => $originalPackage->discount_end_date,
                'business_brand_guideline_id' => $originalPackage->business_brand_guideline_id,
                'brand_strategy_id' => $originalPackage->brand_strategy_id,
            ];

            $duplicatedPackage = BusinessPackages::create($duplicateData);

            // Duplicate durations
            foreach ($originalPackage->durations as $duration) {
                $duplicatedPackage->durations()->create([
                    'duration' => $duration->duration,
                    'duration_remarks' => $duration->duration_remarks,
                ]);
            }

            // Duplicate business package items and attach them
            $itemIds = [];
            foreach ($originalPackage->businessPackageItems as $item) {
                $duplicatedItem = BusinessPackageItems::create([
                    'name' => $item->name,
                    'is_included' => $item->is_included,
                    'detail_link' => $item->detail_link,
                ]);
                $itemIds[] = $duplicatedItem->id;
            }
            $duplicatedPackage->businessPackageItems()->attach($itemIds);

            return $duplicatedPackage;
        });

        return back()->with('duplicated_id', $duplicatedPackage->id);
    }
}
