<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\BusinessProcessController;
use App\Http\Controllers\TestimonialController;
use App\Models\Brand;
use App\Models\BusinessProcess;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $brands = Brand::latest()->get();

    $testimonials = Testimonial::latest()->get();

    $businessProcesses = BusinessProcess::active()->orderBy('step')->get();

    return Inertia::render('home/home-page', [
        'brands' => $brands,
        'testimonials' => $testimonials,
        'businessProcesses' => $businessProcesses,
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
});

require __DIR__ . "/auth.php";
require __DIR__ . "/settings.php";
