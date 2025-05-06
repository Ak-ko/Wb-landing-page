<?php

use App\Http\Controllers\BrandController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home/home-page');
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
