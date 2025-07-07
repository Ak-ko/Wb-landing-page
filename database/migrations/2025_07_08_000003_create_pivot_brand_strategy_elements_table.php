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
        Schema::create('pivot_brand_strategy_elements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('brand_strategy_id')->nullable();
            $table->unsignedBigInteger('brand_strategy_element_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pivot_brand_strategy_elements');
    }
};
