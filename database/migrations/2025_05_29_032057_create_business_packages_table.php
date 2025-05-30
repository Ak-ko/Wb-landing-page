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
            $table->string("duration")->nullable();
            $table->string('color')->nullable();
            $table->string('revision_remarks')->nullable();
            $table->boolean('is_recommended')->default(false);
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
