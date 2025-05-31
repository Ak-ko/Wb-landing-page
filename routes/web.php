<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\BrandingProjectController;
use App\Http\Controllers\BusinessPackageAddonController;
use App\Http\Controllers\BusinessPackagesController;
use App\Http\Controllers\BusinessProcessController;
use App\Http\Controllers\CompanyPolicyController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\TestimonialController;
use App\Models\Blog;
use App\Models\Brand;
use App\Models\BrandingProject;
use App\Models\BusinessPackageAddon;
use App\Models\BusinessPackageItems;
use App\Models\BusinessPackages;
use App\Models\BusinessProcess;
use App\Models\CompanyPolicy;
use App\Models\Faq;
use App\Models\Tag;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $brands = Brand::latest()->get();

    $testimonials = Testimonial::latest()->get();

    $businessProcesses = BusinessProcess::active()->orderBy('step')->get();

    $brandingProjects = BrandingProject::latest()->with('tags', 'images')->get()->take(6);

    $brandingProjectTags = Tag::whereHas('brandingProjects')->get();

    $blogs = Blog::latest()->published()->with(['tags', 'images'])->take(6)->get();

    $faqs = Faq::published()->get();

    return Inertia::render('home/home-page', [
        'brands' => $brands,
        'testimonials' => $testimonials,
        'businessProcesses' => $businessProcesses,
        'brandingProjects' =>  $brandingProjects,
        'brandingProjectTags' => $brandingProjectTags,
        'blogs' => $blogs,
        'faqs' => $faqs,
        'page' => 'home'
    ]);
})->name('home');

// Dashboard Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    // Brands routes
    Route::resource('/admin/brands', BrandController::class);

    // Testimonials routes
    Route::resource('/admin/testimonials', TestimonialController::class);

    // Business Processes routes
    Route::resource('/admin/business-processes', BusinessProcessController::class);

    // Branding Projects
    Route::resource('/admin/branding-projects', BrandingProjectController::class);

    // Blogs
    Route::resource('/admin/blogs', BlogController::class);

    // Tags
    Route::resource('/admin/tags', TagController::class);

    // Faq
    Route::resource('/admin/faqs', FaqController::class);

    // Policy
    Route::resource('/admin/policies', CompanyPolicyController::class)->only(['index']);
    Route::post('/admin/policies', [CompanyPolicyController::class, 'updatePolicy'])->name('policies.update');

    // team member
    Route::resource('/admin/team-members', TeamMemberController::class);
    Route::patch('/admin/team-members/{teamMember}/toggle-active', [TeamMemberController::class, 'toggleActive'])->name('team-members.toggle-active');

    // Business Packages
    Route::resource('/admin/business-packages', BusinessPackagesController::class);

    // Add-on Packages
    Route::resource('/admin/add-on-packages', BusinessPackageAddonController::class);
});

// faq
Route::post('/faq/send-email', [FaqController::class, 'sendFaqEmail'])->name('faq.send-email');

// contact us
Route::post('/contact/send', [ContactController::class, 'sendMessage'])->name('contact.send');


Route::get('/about-us', function () {
    $policy = CompanyPolicy::first();
    $teamMembers = TeamMember::active()->latest()->get();

    return Inertia::render('about-us/about-us-page', [
        'policy' => $policy,
        'teamMembers' => $teamMembers
    ]);
})->name('about-us-page');


Route::get('/business-plans', function () {
    $policy = CompanyPolicy::first();
    $businessPackages = BusinessPackages::with('businessPackageItems')->get();
    $allItems = BusinessPackageItems::all();
    $businessPackageAddons = BusinessPackageAddon::all();

    $businessPackages = $businessPackages->map(function ($package) use ($allItems) {
        $includedIds = $package->businessPackageItems->pluck('id')->toArray();

        $package->all_items = $allItems->map(function ($item) use ($includedIds) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'is_included' => in_array($item->id, $includedIds),
            ];
        });

        return $package;
    });


    return Inertia::render('business-plan/business-plan', compact('businessPackages', 'businessPackageAddons', 'policy'));
})->name('business-plan-page');

require __DIR__ . "/auth.php";
require __DIR__ . "/settings.php";
