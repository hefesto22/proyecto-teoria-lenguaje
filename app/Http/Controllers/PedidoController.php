<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Cliente;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class PedidoController extends Controller
{
    public function index(Request $request)
    {
        $filtro = $request->query('filtro', 'todos');

        $query = Pedido::with('cliente', 'productos')
            ->where('user_id', Auth::id())
            ->latest();

        if ($filtro === 'pagado') {
            $query->where('estado', 'pagado');
        } elseif ($filtro === 'no_pagado') {
            $query->where('estado', '!=', 'pagado');
        }

        $pedidos = $query->paginate(10)->withQueryString();

        return Inertia::render('pedidos/index', [
            'pedidos' => $pedidos,
            'filtro' => $filtro,
        ]);
    }

    public function create()
    {
        $productos = Producto::with('imagenPrincipal')
            ->select('id', 'nombre', 'precio', 'stock', 'isv')
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'precio' => $producto->precio,
                    'stock' => $producto->stock,
                    'isv' => $producto->isv,
                    'imagen' => $producto->imagenPrincipal
                        ? Storage::url($producto->imagenPrincipal->path)
                        : null,
                ];
            });

        return Inertia::render('pedidos/create', [
            'clientes' => Cliente::select('id', 'NOMBRES', 'APELLIDOS', 'RTN')->get(),
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.precio' => 'required|numeric|min:0',
            'productos.*.isv' => 'required|numeric|min:0',
            'monto_pagado' => 'required|numeric|min:0',
        ]);
    
        DB::beginTransaction();
    
        try {
            // 🔢 Calcular total con ISV incluido
            $total = collect($data['productos'])->sum(function ($item) {
                $isvUnit = $item['precio'] * $item['isv'] / 100;
                return ($item['precio'] + $isvUnit) * $item['cantidad'];
            });
    
            // 🟢 Determinar el estado del pedido
            $estado = match (true) {
                $data['monto_pagado'] >= $total => 'pagado',
                $data['monto_pagado'] > 0 => 'espera',
                default => 'pendiente',
            };
    
            // 📝 Crear el pedido
            $pedido = Pedido::create([
                'cliente_id' => $data['cliente_id'],
                'user_id' => Auth::id(),
                'total' => $total,
                'monto_pagado' => $data['monto_pagado'],
                'estado' => $estado,
            ]);
    
            // 🔁 Asociar productos y descontar stock
            foreach ($data['productos'] as $producto) {
                $prod = Producto::findOrFail($producto['id']);
    
                if ($producto['cantidad'] > $prod->stock) {
                    throw new \Exception("El producto '{$prod->nombre}' no tiene suficiente stock disponible.");
                }
    
                $isvUnit = $producto['precio'] * $producto['isv'] / 100;
                $isvTotal = $producto['cantidad'] * $isvUnit;
                $subtotal = $producto['cantidad'] * $producto['precio'];
                $totalConISV = $subtotal + $isvTotal;
    
                $pedido->productos()->attach($producto['id'], [
                    'cantidad' => $producto['cantidad'],
                    'precio' => $producto['precio'],
                    'isv_porcentaje' => $producto['isv'],
                    'isv_total' => $isvTotal,
                    'total' => $subtotal,
                    'total_con_isv' => $totalConISV,
                ]);
    
                $prod->decrement('stock', $producto['cantidad']);
            }
    
            DB::commit();
    
            return redirect()->route('pedidos.index')->with('success', 'Pedido creado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Error al crear el pedido: ' . $e->getMessage());
        }
    }
    

    public function edit(Pedido $pedido)
    {
        $pedido->load([
            'cliente',
            'productos' => fn($q) => $q->withPivot([
                'cantidad',
                'precio',
                'isv_porcentaje',
                'total',
                'total_con_isv'
            ])
        ]);

        $productos = Producto::with(['imagenes' => fn($q) => $q->select('producto_id', 'path')])
            ->select('id', 'nombre', 'precio', 'stock', 'isv')
            ->get()
            ->map(function ($producto) {
                $producto->imagen = $producto->imagenes->first()
                    ? Storage::url($producto->imagenes->first()->path)
                    : null;

                return $producto->only(['id', 'nombre', 'precio', 'stock', 'isv', 'imagen']);
            });

        return Inertia::render('pedidos/edit', [
            'clientes' => Cliente::select('id', 'NOMBRES', 'APELLIDOS')->get(),
            'productos' => $productos,
            'pedido' => $pedido,
        ]);
    }


    public function update(Request $request, Pedido $pedido)
    {
        $data = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.precio' => 'required|numeric|min:0',
            'productos.*.isv' => 'required|numeric|min:0',
            'monto_pagado' => 'required|numeric|min:0',
        ]);
    
        DB::beginTransaction();
    
        try {
            // 🔁 Restaurar el stock anterior
            $pedido->load('productos');
            foreach ($pedido->productos as $productoAnterior) {
                $productoAnterior->increment('stock', $productoAnterior->pivot->cantidad);
            }
    
            // 🧮 Calcular nuevo total
            $total = collect($data['productos'])->sum(function ($item) {
                $isvUnit = $item['precio'] * $item['isv'] / 100;
                return ($item['precio'] + $isvUnit) * $item['cantidad'];
            });
    
            // ✅ Determinar estado del pedido según monto pagado
            $estado = match (true) {
                $data['monto_pagado'] >= $total => 'pagado',
                $data['monto_pagado'] > 0 => 'espera',
                default => 'pendiente',
            };
    
            // 📝 Actualizar datos del pedido
            $pedido->update([
                'cliente_id'   => $data['cliente_id'],
                'total'        => $total,
                'monto_pagado' => $data['monto_pagado'],
                'estado'       => $estado,
            ]);
    
            // 📌 Preparar datos para la tabla pivote
            $syncData = [];
    
            foreach ($data['productos'] as $producto) {
                $isvUnit = $producto['precio'] * $producto['isv'] / 100;
                $isvTotal = $producto['cantidad'] * $isvUnit;
                $subtotal = $producto['cantidad'] * $producto['precio'];
                $totalConISV = $subtotal + $isvTotal;
    
                $syncData[$producto['id']] = [
                    'cantidad'        => $producto['cantidad'],
                    'precio'          => $producto['precio'],
                    'isv_porcentaje'  => $producto['isv'],
                    'isv_total'       => $isvTotal,
                    'total'           => $subtotal,
                    'total_con_isv'   => $totalConISV,
                ];
            }
    
            // 🔄 Sincronizar productos
            $pedido->productos()->sync($syncData);
    
            // 📉 Descontar nueva cantidad del stock
            foreach ($data['productos'] as $productoNuevo) {
                $prod = Producto::findOrFail($productoNuevo['id']);
                $prod->decrement('stock', $productoNuevo['cantidad']);
            }
    
            DB::commit();
    
            return redirect()->route('pedidos.index')->with('success', 'Pedido actualizado correctamente');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Error al actualizar pedido: ' . $e->getMessage());
        }
    }
    
    


    public function show(Pedido $pedido)
    {
        $pedido->load(['cliente', 'productos', 'user']);
    
        return Inertia::render('pedidos/show', [
            'pedido' => [
                'id' => $pedido->id,
                'created_at' => $pedido->created_at,
                'cliente' => [
                    'nombres' => $pedido->cliente->nombres,
                    'apellidos' => $pedido->cliente->apellidos,
                    'rtn' => $pedido->cliente->rtn,
                    'direccion' => $pedido->cliente->direccion,
                ],
                'user' => [
                    'name' => $pedido->user->name,
                ],
            ],
            'productos' => $pedido->productos->map(function ($producto) {
                return [
                    'nombre' => $producto->nombre,
                    'cantidad' => (int) $producto->pivot->cantidad,
                    'precio' => (float) $producto->pivot->precio,
                    'isv_porcentaje' => (float) $producto->pivot->isv_porcentaje,
                    'isv_total' => (float) $producto->pivot->isv_total,
                    'total_con_isv' => (float) $producto->pivot->total_con_isv,
                ];
            }),
        ]);
    }
    
    

    public function destroy(Pedido $pedido)
    {
        DB::beginTransaction();

        try {
            $pedido->load('productos');

            foreach ($pedido->productos as $producto) {
                $cantidad = $producto->pivot->cantidad;
                $producto->increment('stock', $cantidad);
            }

            $pedido->delete();

            DB::commit();

            return redirect()->route('pedidos.index')->with('success', 'Pedido eliminado y stock restaurado correctamente');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Error al eliminar el pedido: ' . $e->getMessage());
        }
    }

    public function marcarComoPagado(Pedido $pedido)
    {
        $pedido->update([
            'monto_pagado' => $pedido->total,
            'estado' => 'pagado',
        ]);
    
        return redirect()->route('pedidos.index')->with('success', 'Pedido marcado como pagado.');
    }
    
}
