<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    /**
     * Mostrar todas las categorías.
     */
    public function index(Request $request)
    {
        $categorias = Categoria::query()
            ->when($request->search, fn($q) =>
                $q->where('nombre', 'like', '%' . $request->search . '%'))
            ->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('categorias/index', [
            'categorias' => $categorias,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Mostrar formulario para crear una categoría.
     */
    public function create()
    {
        return Inertia::render('categorias/create');
    }

    /**
     * Guardar una nueva categoría.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        Categoria::create([
            'nombre' => $request->nombre,
            'activa' => true,
        ]);

        return redirect()->route('categorias.index')->with('success', 'Categoría creada correctamente.');
    }

    /**
     * Mostrar formulario para editar una categoría.
     */
    public function edit(Categoria $categoria)
    {
        return Inertia::render('categorias/edit', [
            'categoria' => $categoria,
        ]);
    }

    /**
     * Actualizar una categoría.
     */
    public function update(Request $request, Categoria $categoria)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'activa' => 'boolean',
        ]);

        $categoria->update($request->only('nombre', 'activa'));

        return redirect()->route('categorias.index')->with('success', 'Categoría actualizada correctamente.');
    }

    /**
     * Eliminar una categoría.
     */
    public function destroy(Categoria $categoria)
    {
        $categoria->delete();

        return redirect()->route('categorias.index')->with('success', 'Categoría eliminada correctamente.');
    }
}
