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
        Schema::create('expertise_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type'); // 'business' or 'established'
            $table->json('plans'); // Array of plan objects with text and order
            $table->string('color')->default('#1CB3CE'); // Hex color for highlighting
            $table->integer('order')->default(0); // For ordering sections
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expertise_sections');
    }
};
