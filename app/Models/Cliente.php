<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
      
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
}
