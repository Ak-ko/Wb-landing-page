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
        Schema::create('business_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('price_text')->nullable();
            $table->double('price')->nullable();
            $table->string('currency')->nullable()->default("USD");
            $table->string('color')->nullable();
            $table->boolean('is_recommended')->default(false);
            $table->boolean('is_discount')->default(false);
            $table->string('discount_price_text')->nullable(); // store the money here
            $table->string('discount_description')->nullable();
            $table->dateTime('discount_end_date')->nullable();
            $table->unsignedBigInteger('business_brand_guideline_id')->nullable();
            $table->unsignedBigInteger('brand_strategy_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_packages');
    }
};
