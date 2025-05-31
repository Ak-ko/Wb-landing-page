<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mascort_art_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mascort_art_id')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_primary')->default(false)->nullable();
            $table->boolean('is_mascot')->default(false)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mascort_art_images');
    }
};
