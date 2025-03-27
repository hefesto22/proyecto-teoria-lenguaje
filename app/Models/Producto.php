<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'precio',
        'stock',
        'categoria_id',
        'user_id',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'precio' => 'decimal:2',
    ];

    // Relación con categoría
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    // Relación con usuario (quien lo creó)
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relación con imágenes
    public function imagenes()
    {
        return $this->hasMany(Imagen::class);
    }
}
