<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PedidoProducto extends Model
{
    use HasFactory;

    protected $table = 'pedido_producto'; // Nombre personalizado de tabla

    protected $fillable = [
        'pedido_id',
        'producto_id',
        'cantidad',
        'precio',
        'total',
        'isv_porcentaje',
        'isv_total',
        'total_con_isv',
    ];
}
