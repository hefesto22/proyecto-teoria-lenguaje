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

        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('DNI',13);
            $table->string('RTN',14);
            $table->string('NOMBRES',150);
            $table->string('APELLIDOS',150);
            $table->string('DIRECCION',200);
            $table->string('GENERO',6);
            $table->date('FECHA_NAC');
            $table->date('FECHA_CREACION')->default(DB::raw('CURRENT_DATE'));
            $table->boolean('ACTIVO')->default(true);
            $table->timestamps();
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
