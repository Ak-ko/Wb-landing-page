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
        Schema::create('business_package_addons', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('price_text')->nullable();
            $table->double('price', 8, 2)->nullable();
            $table->string('currency')->nullable()->default('USD');
            $table->string('revision_remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_package_addons');
    }
};
