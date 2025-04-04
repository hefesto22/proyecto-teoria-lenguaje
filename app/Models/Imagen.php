<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imagen extends Model
{
    use HasFactory;

    protected $table = 'imagenes'; // Esto soluciona el error de Redireccion de guardado

    protected $fillable = [
        'producto_id',
        'path',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
