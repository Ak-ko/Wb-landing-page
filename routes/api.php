<?php

use App\Http\Controllers\ImageUploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('image/upload', [ImageUploadController::class, 'uploadImage'])->name('api.image.upload');
Route::post('image/upload/cancel', [ImageUploadController::class, 'cancelUpload'])->name('api.image.upload.cancel');
Route::post('image/delete', [ImageUploadController::class, 'deleteImage'])->name('api.image.delete');
