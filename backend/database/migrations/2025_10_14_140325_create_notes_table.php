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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->float('note');
            $table->text('commentaire')->nullable();
            $table->foreignId('projet_id')->constrained('projets')->onDelete('cascade');
            $table->foreignId('enseignant_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->unique(['projet_id', 'enseignant_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
