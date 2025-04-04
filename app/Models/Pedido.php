<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'total',
        'monto_pagado',
        'estado',
    ];

    // 🔐 Asegura que siempre lleguen como floats al frontend
    protected $casts = [
        'total' => 'float',
        'monto_pagado' => 'float',
    ];

    // Relación con el cliente (muchos pedidos pertenecen a un cliente)
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    // Relación con productos a través de la tabla pivote
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_producto')
                    ->withPivot(['cantidad', 'precio', 'total'])
                    ->withTimestamps();
    }
}
