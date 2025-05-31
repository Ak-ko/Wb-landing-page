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
        Schema::create('pivot_business_package_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_package_id')->nullable();
            $table->unsignedBigInteger('business_package_item_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pivot_business_package_items');
    }
};
