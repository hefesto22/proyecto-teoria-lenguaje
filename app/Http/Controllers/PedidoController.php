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
    // Listar pedidos
    public function index(Request $request)
    {
        $filtro = $request->query('filtro', 'todos');
    
        $query = Pedido::with('cliente', 'productos')
        ->where('user_id', Auth::id()) // 👈 Solo pedidos del usuario en sesión
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
    


    // Mostrar formulario de creación
    public function create()
    {
        $productos = Producto::with('imagenPrincipal')
            ->select('id', 'nombre', 'precio', 'stock')
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'precio' => $producto->precio,
                    'stock' => $producto->stock,
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



    // Guardar nuevo pedido
    public function store(Request $request)
    {
        $data = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.precio' => 'required|numeric|min:0',
            'monto_pagado' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $total = collect($data['productos'])->sum(fn($item) => $item['cantidad'] * $item['precio']);

            $estado = match (true) {
                $data['monto_pagado'] >= $total => 'pagado',
                $data['monto_pagado'] > 0 => 'espera',
                default => 'pendiente',
            };

            $pedido = Pedido::create([
                'cliente_id'   => $data['cliente_id'],
                'user_id' => Auth::id(),//  Aquí se guarda el ID del usuario autenticado
                'total'        => $total,
                'monto_pagado' => $data['monto_pagado'],
                'estado'       => $estado,
            ]);

            foreach ($data['productos'] as $producto) {
                $prod = Producto::findOrFail($producto['id']);

                // Validar stock disponible
                if ($producto['cantidad'] > $prod->stock) {
                    throw new \Exception("El producto '{$prod->nombre}' no tiene suficiente stock.");
                }

                // Guardar en tabla pivote
                $pedido->productos()->attach($producto['id'], [
                    'cantidad' => $producto['cantidad'],
                    'precio'   => $producto['precio'],
                    'total'    => $producto['cantidad'] * $producto['precio'],
                ]);

                // Restar del stock
                $prod->decrement('stock', $producto['cantidad']);
            }

            DB::commit();

            return redirect()->route('pedidos.index')->with('success', 'Pedido creado correctamente');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Error al crear pedido: ' . $e->getMessage());
        }
    }


    // Mostrar formulario de edición
    public function edit(Pedido $pedido)
    {
        $pedido->load('cliente', 'productos');

        $productos = Producto::with(['imagenes' => fn($q) => $q->select('producto_id', 'path')])
            ->select('id', 'nombre', 'precio', 'stock')
            ->get()
            ->map(function ($producto) {
                $producto->imagen = $producto->imagenes->first()?->path;
                return $producto->only(['id', 'nombre', 'precio', 'stock', 'imagen']);
            });

        return Inertia::render('pedidos/edit', [
            'clientes' => Cliente::select('id', 'NOMBRES', 'APELLIDOS')->get(),
            'productos' => $productos,
            'pedido' => $pedido,
        ]);
    }

    // Actualizar pedido
    public function update(Request $request, Pedido $pedido)
    {
        $data = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.precio' => 'required|numeric|min:0',
            'monto_pagado' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $total = collect($data['productos'])->sum(fn($item) => $item['cantidad'] * $item['precio']);

            $estado = match (true) {
                $data['monto_pagado'] >= $total => 'pagado',
                $data['monto_pagado'] > 0 => 'espera',
                default => 'pendiente',
            };

            $pedido->update([
                'cliente_id'   => $data['cliente_id'],
                'total'        => $total,
                'monto_pagado' => $data['monto_pagado'],
                'estado'       => $estado,
            ]);

            $syncData = [];
            foreach ($data['productos'] as $producto) {
                $syncData[$producto['id']] = [
                    'cantidad' => $producto['cantidad'],
                    'precio'   => $producto['precio'],
                    'total'    => $producto['cantidad'] * $producto['precio'],
                ];
            }

            $pedido->productos()->sync($syncData);

            DB::commit();

            return redirect()->route('pedidos.index')->with('success', 'Pedido actualizado correctamente');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Error al actualizar pedido: ' . $e->getMessage());
        }
    }

    // Mostrar un pedido
    public function show(Pedido $pedido)
    {
        $pedido->load('cliente', 'productos');

        return Inertia::render('pedidos/show', [
            'pedido' => $pedido,
        ]);
    }

    // Eliminar pedido
    public function destroy(Pedido $pedido)
    {
        DB::beginTransaction();

        try {
            // Cargar los productos asociados al pedido con cantidad desde la tabla pivote
            $pedido->load('productos');

            foreach ($pedido->productos as $producto) {
                $cantidad = $producto->pivot->cantidad;

                // Aumentar el stock de cada producto
                $producto->increment('stock', $cantidad);
            }

            // Eliminar el pedido (esto también elimina los registros en la tabla pivote si tienes `onDelete('cascade')`)
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

        return redirect()->back()->with('success', 'Pedido marcado como pagado.');
    }
}
