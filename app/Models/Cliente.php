<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'dni',
        'rtn',
        'nombres',
        'apellidos',
        'direccion',
        'genero',
        'fecha_nac',
        'fecha_creacion',
        'activo',
        'user_id', // 👈 importante para guardar al usuario que lo creó
    ];

    /**
     * Relación: un cliente pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: un cliente tiene muchos pedidos.
     */
    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }

    public function pagosPedidos()
    {
        return $this->hasMany(PagoPedido::class, 'cliente_id');
    }
}
