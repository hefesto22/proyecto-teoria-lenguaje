<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Imagen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductoController extends Controller
{
    /**
     * Mostrar todos los productos del usuario autenticado.
     */
    public function index(Request $request)
    {
        $productos = Producto::with(['categoria', 'usuario', 'imagenes'])
            ->where('user_id', Auth::id()) // 👈 Mostrar solo los del usuario logueado
            ->when($request->search, fn($q) =>
                $q->where('nombre', 'like', '%' . $request->search . '%'))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('productos/index', [
            'productos' => $productos,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Formulario de creación.
     */
    public function create()
    {
        return Inertia::render('productos/create', [
            'categorias' => Categoria::where('activa', true)->get(),
        ]);
    }

    /**
     * Almacenar nuevo producto.
     */
    public function store(Request $request)
    {
        // Validación
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'isv' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id',
            'imagenes.*' => 'nullable|image|max:2048',
        ]);

        // Crear producto
        $producto = Producto::create([
            'nombre' => $request->nombre,
            'precio' => $request->precio,
            'isv' => $request->isv,
            'stock' => $request->stock,
            'categoria_id' => $request->categoria_id,
            'user_id' => Auth::id(),
            'activo' => $request->boolean('activo', true),
        ]);

        // Guardar imágenes si existen
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');
                $producto->imagenes()->create(['path' => $path]);
            }
        }

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente.');
    }

    /**
     * Formulario de edición.
     */
    public function edit(Producto $producto)
    {
        return Inertia::render('productos/edit', [
            'producto' => $producto->load('imagenes'),
            'categorias' => Categoria::where('activa', true)->get(),
        ]);
    }

    /**
     * Actualizar producto.
     */
    public function update(Request $request, $id)
    {
        $producto = Producto::where('user_id', Auth::id())->findOrFail($id);

        if ($request->has('categoria_id')) {
            $request->merge(['categoria_id' => (int) $request->input('categoria_id')]);
        }

        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'precio' => 'sometimes|required|numeric|min:0',
            'isv' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'categoria_id' => 'sometimes|required|exists:categorias,id',
            'activo' => 'nullable|boolean',
            'imagenes.*' => 'nullable|image|max:2048',
        ]);

        $producto->update([
            'nombre'       => $validated['nombre'] ?? $producto->nombre,
            'precio'       => $validated['precio'] ?? $producto->precio,
            'isv'          => $request->has('isv') ? $request->isv : $producto->isv,
            'stock'        => $validated['stock'] ?? $producto->stock,
            'categoria_id' => $validated['categoria_id'] ?? $producto->categoria_id,
            'activo'       => $request->has('activo') ? $request->boolean('activo') : $producto->activo,
        ]);

        // Subir nuevas imágenes si se agregaron
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');
                $producto->imagenes()->create(['path' => $path]);
            }
        }

        return redirect()->route('productos.index')->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Eliminar producto y sus imágenes.
     */
    public function destroy(Producto $producto)
    {
        if ($producto->user_id !== Auth::id()) {
            abort(403);
        }

        foreach ($producto->imagenes as $imagen) {
            Storage::disk('public')->delete($imagen->path);
        }

        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado correctamente.');
    }

    /**
     * Eliminar imagen individual.
     */
    public function eliminarImagen($id)
    {
        $imagen = Imagen::findOrFail($id);

        if ($imagen->producto->user_id !== Auth::id()) {
            abort(403);
        }

        Storage::disk('public')->delete($imagen->path);
        $imagen->delete();

        return response()->json(['success' => true]);
    }
}
