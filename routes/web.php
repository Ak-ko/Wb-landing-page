<?php

use App\Http\Controllers\BrandController;
use App\Models\Brand;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $brands = Brand::latest()->get();

    return Inertia::render('home/home-page', ['brands' => $brands]);
})->name('home');

// Dashboard Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    // Brands routes
    Route::resource('/admin/brands', BrandController::class);
});

require __DIR__ . "/auth.php";
require __DIR__ . "/settings.php";
