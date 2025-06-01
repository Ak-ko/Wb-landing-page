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
        Schema::create('art_package_prices', function (Blueprint $table) {
            $table->id();
            $table->string('price')->nullable();
            $table->string('duration')->nullable();
            $table->unsignedBigInteger('art_package_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('art_package_prices');
    }
};
