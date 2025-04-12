<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('dni', 13);
            $table->string('rtn', 14);
            $table->string('nombres', 150);
            $table->string('apellidos', 150);
            $table->string('direccion', 200);
            $table->string('genero', 6);
            $table->date('fecha_nac');
            $table->date('fecha_creacion')->default(DB::raw('CURRENT_DATE'));
            $table->boolean('activo')->default(true);
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            // Relación con la tabla users
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
