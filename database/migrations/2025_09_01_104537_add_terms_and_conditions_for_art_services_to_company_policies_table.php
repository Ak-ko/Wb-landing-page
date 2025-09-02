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
        Schema::table('company_policies', function (Blueprint $table) {
            $table->longText('terms_and_conditions_for_art_services')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_policies', function (Blueprint $table) {
            $table->dropColumn('terms_and_conditions_for_art_services');
        });
    }
};
