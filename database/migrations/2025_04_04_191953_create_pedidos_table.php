<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Tabla de pedidos
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade'); // referencia a tabla clientes
            $table->decimal('total', 10, 2)->default(0);
            $table->decimal('monto_pagado', 10, 2)->default(0);
            $table->enum('estado', ['pendiente', 'espera', 'pagado', 'cancelado'])->default('pendiente');
            $table->timestamps();
        });

        // Tabla pivote entre pedidos y productos
        Schema::create('pedido_producto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->integer('cantidad');
            $table->decimal('precio', 10, 2); // precio unitario
            $table->decimal('total', 10, 2);  // cantidad * precio
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedido_producto');
        Schema::dropIfExists('pedidos');
    }
};
