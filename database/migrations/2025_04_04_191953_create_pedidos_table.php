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
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
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
            $table->decimal('precio', 10, 2);            // Precio unitario sin ISV
            $table->decimal('isv_porcentaje', 5, 2);     // Porcentaje ISV aplicado
            $table->decimal('isv_total', 10, 2);         // ISV total (cantidad * precio * isv / 100)
            $table->decimal('total', 10, 2);             // cantidad * precio
            $table->decimal('total_con_isv', 10, 2);     // total + isv_total
            $table->timestamps();
        });

        // Tabla de pagos de pedidos
        Schema::create('pagos_pedido', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');      // Quién registró el pago
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->date('fecha_pago');
            $table->decimal('monto', 10, 2);  // Monto del pago
            $table->enum('tipo_pago', ['efectivo', 'tarjeta', 'transferencia'])->default('efectivo');
            $table->boolean('pago_total')->default(false); // Si pagó el total del pedido
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos_pedido');
        Schema::dropIfExists('pedido_producto');
        Schema::dropIfExists('pedidos');
    }
};
