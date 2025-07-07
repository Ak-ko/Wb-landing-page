<?php

namespace App\Http\Controllers;

use App\Models\BusinessBrandGuideline;
use App\Models\BusinessPackages;
use App\Models\BrandStrategy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessPackagesController extends Controller
{
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

        // Create package items
        foreach ($validated['items'] as $itemData) {
            $businessPackage->businessPackageItems()->create($itemData);
        }

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
