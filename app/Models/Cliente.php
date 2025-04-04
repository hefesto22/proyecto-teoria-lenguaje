<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'DNI',         
        'RTN',
        'NOMBRES',
        'APELLIDOS',
        'DIRECCION',
        'GENERO',
        'FECHA_NAC',
        'FECHA_CREACION',
        'ACTIVO'
    ];

    // Relación: un cliente tiene muchos pedidos
    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }
}
