<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PagoPedido extends Model
{
    protected $table = 'pagos_pedido';

    protected $fillable = [
        'user_id',
        'cliente_id',
        'pedido_id',
        'fecha_pago',
        'monto',
        'tipo_pago',
        'pago_total',
    ];

    protected $casts = [
        'fecha_pago' => 'date',
        'pago_total' => 'boolean',
        'monto' => 'decimal:2',
    ];

    // Quien registró el pago
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Cliente que realizó el pago
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    // Pedido relacionado
    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }
}
