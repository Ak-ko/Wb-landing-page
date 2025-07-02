<?php

use App\Enums\ArtPackageType;
use Carbon\Carbon;
use App\Http\Controllers\AnimationAndMotionController;
use App\Http\Controllers\ArtPackageController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\BrandingProjectController;
use App\Http\Controllers\BusinessBrandGuidelineController;
use App\Http\Controllers\BusinessPackageAddonController;
use App\Http\Controllers\BusinessPackagesController;
use App\Http\Controllers\BusinessProcessController;
use App\Http\Controllers\ComicArtController;
use App\Http\Controllers\CompanyPolicyController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\IllustrationArtController;
use App\Http\Controllers\MascortArtController;
use App\Http\Controllers\StickerArtController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\TestimonialController;
use App\Models\AnimationAndMotionImage;
use App\Models\ArtPackage;
use App\Models\Blog;
use App\Models\Brand;
use App\Models\BrandingProject;
use App\Models\BusinessBrandGuideline;
use App\Models\BusinessPackageAddon;
use App\Models\BusinessPackageItems;
use App\Models\BusinessPackages;
use App\Models\BusinessProcess;
use App\Models\ComicArtImages;
use App\Models\CompanyPolicy;
use App\Models\Faq;
use App\Models\IllustrationArt;
use App\Models\IllustrationArtImages;
use App\Models\MascortArt;
use App\Models\StickerArtImages;
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
        $totalProjects = BrandingProject::count();
        $totalBlogs = Blog::count();
        $totalTeamMembers = TeamMember::count();
        $totalPackages = BusinessPackages::count();

        $monthlyProjects = BrandingProject::whereYear('created_at', now()->year)
            ->get()
            ->groupBy(function ($project) {
                return $project->created_at->format('M');
            })
            ->map(function ($projects, $month) {
                return [
                    'month' => $month,
                    'count' => $projects->count()
                ];
            })
            ->values();

        $recentProjects = BrandingProject::latest()
            ->with(['members'])
            ->take(5)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'client_company' => $project->client_company,
                    'service_fees' => $project->service_fees,
                    'team_size' => $project->team_size,
                    'status' => $project->status,
                    'members' => $project->members,
                    'created_at' => $project->created_at->format('M d, Y')
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalProjects' => $totalProjects,
                'totalBlogs' => $totalBlogs,
                'totalTeamMembers' => $totalTeamMembers,
                'totalPackages' => $totalPackages,
            ],
            'monthlyProjectStats' => $monthlyProjects,
            'recentProjects' => $recentProjects
        ]);
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
    Route::resource('/admin/policies', CompanyPolicyController::class)
        ->only(['index']);
    Route::post('/admin/policies', [CompanyPolicyController::class, 'updatePolicy'])
        ->name('policies.update');

    // team member
    Route::resource('/admin/team-members', TeamMemberController::class);
    Route::patch('/admin/team-members/{teamMember}/toggle-active', [TeamMemberController::class, 'toggleActive'])
        ->name('team-members.toggle-active');

    // Business Packages
    Route::resource('/admin/business-packages', BusinessPackagesController::class);

    // Art and Motion Art
    Route::resource('/admin/business-brand-guidelines', BusinessBrandGuidelineController::class);

    // Add-on Packages
    Route::resource('/admin/add-on-packages', BusinessPackageAddonController::class);

    // Mascort Art
    Route::resource('/admin/mascort-art', MascortArtController::class);

    // Art Packages
    Route::resource('/admin/art-packages', ArtPackageController::class);

    // Illustration Art
    Route::resource('/admin/illustration-art', IllustrationArtController::class);

    // Comic Art
    Route::resource('/admin/comic-art', ComicArtController::class);

    // Sticker Art
    Route::resource('/admin/sticker-art', StickerArtController::class);

    // Art and Motion Art
    Route::resource('/admin/animation-and-motion', AnimationAndMotionController::class);
});

// faq
Route::post('/faq/send-email', [FaqController::class, 'sendFaqEmail'])
    ->name('faq.send-email');

// contact us
Route::post('/contact/send', [ContactController::class, 'sendMessage'])
    ->name('contact.send');

Route::get('/contact-us', function () {
    return Inertia::render('contact-us/contact-us-page');
})->name('contact-us-page');

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
    $businessPackages = BusinessPackages::with('businessPackageItems', 'brandGuideline.elements.items')->get();
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

Route::get('/art-plans', function () {
    $mascotArts = MascortArt::with('images')->latest()->get();
    $mascotArtPackages = ArtPackage::where('type', ArtPackageType::Mascot)
        ->with('items', 'prices')
        ->get();
    $illustrationArtPackages = ArtPackage::where('type', ArtPackageType::Illustration)
        ->with('items', 'prices')
        ->get();
    $comicArtPackages = ArtPackage::where('type', ArtPackageType::Comic)
        ->with('items', 'prices')
        ->get();
    $animationAndMotionArtPackages = ArtPackage::where('type', ArtPackageType::AnimationAndMotion)
        ->with('items', 'prices')
        ->get();
    $stickerArtPackages = ArtPackage::where('type', ArtPackageType::Sticker)
        ->with('items', 'prices')
        ->get();
    $illustrationArtImages = IllustrationArtImages::latest()->get();
    $comicArtImages = ComicArtImages::latest()->get();
    $stickerArtImages = StickerArtImages::latest()->get();
    $animationAndMotionsVideos = AnimationAndMotionImage::latest()->get();

    return Inertia::render('art-plan/art-plan', compact(
        'mascotArts',
        'mascotArtPackages',
        'illustrationArtPackages',
        'comicArtPackages',
        'animationAndMotionArtPackages',
        'stickerArtPackages',
        'illustrationArtImages',
        'comicArtImages',
        'stickerArtImages',
        'animationAndMotionsVideos'
    ));
})->name('art-plan-page');

Route::get('/blogs', [BlogController::class, 'blogList'])->name('blogs.list');
Route::get('/blogs/{blog}', [BlogController::class, 'blogDetail'])->name('blogs.detail');

Route::get('/branding-projects', [BrandingProjectController::class, 'projectsList'])->name('branding-projects.list');
Route::get('/branding-projects/{project}', [BrandingProjectController::class, 'projectDetail'])->name('branding-projects.detail');

require __DIR__ . "/auth.php";
require __DIR__ . "/settings.php";
