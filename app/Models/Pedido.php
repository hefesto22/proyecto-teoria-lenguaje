<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'user_id',
        'total',
        'monto_pagado',
        'estado',
    ];

    protected $casts = [
        'total' => 'float',
        'monto_pagado' => 'float',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_producto')
                    ->withPivot(['cantidad', 'precio', 'total', 'isv_porcentaje', 'isv_total', 'total_con_isv'])
                    ->withTimestamps();
    }

    // ✅ Nombre de relación corregido
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
