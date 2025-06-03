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
        Schema::create('brand_guideline_elements', function (Blueprint $table) {
            $table->id();
            $table->string("title")->nullable();
            $table->float('order')->nullable();
            $table->unsignedBigInteger('business_brand_guideline_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_guideline_elements');
    }
};
