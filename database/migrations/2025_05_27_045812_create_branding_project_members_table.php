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
        Schema::create('branding_project_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('branding_project_id')->nullable();
            $table->unsignedBigInteger('team_member_id')->nullable();
            $table->boolean("is_lead")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branding_project_members');
    }
};
