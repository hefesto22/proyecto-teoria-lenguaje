<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PedidoProducto extends Model
{
    use HasFactory;

    protected $table = 'pedido_producto'; // Laravel no lo detecta automáticamente

    protected $fillable = [
        'pedido_id',
        'producto_id',
        'cantidad',
        'precio',
        'total',
    ];
}
