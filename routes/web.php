<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home/home-page');
})->name('home');

// Dashboard Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::get('/dashboard/brands', function () {
        return Inertia::render('admin/brands/index');
    })->name('brands.index');
});

require __DIR__ . "/auth.php";
require __DIR__ . "/settings.php";
