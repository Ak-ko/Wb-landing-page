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
        Schema::table('branding_projects', function (Blueprint $table) {
            $table->string('client_origin')->nullable()->after('client_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('branding_projects', function (Blueprint $table) {
            $table->dropColumn('client_origin');
        });
    }
};
