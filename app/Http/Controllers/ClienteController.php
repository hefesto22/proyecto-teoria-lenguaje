<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $clientes = Cliente::query()
            ->where('user_id', Auth::id()) // 👈 Solo clientes del usuario en sesión
            ->when($request->search, fn ($q) =>
                $q->where('nombres', 'like', '%' . $request->search . '%'))
            ->orderBy('nombres')
            ->paginate(10)
            ->withQueryString();
    
        return Inertia::render('clientes/index', [
            'clientes' => $clientes,
            'filters' => $request->only(['search']),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('clientes/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dni' => 'required|string|max:13',
            'rtn' => 'required|string|max:14',
            'nombres' => 'required|string|max:150',
            'apellidos' => 'required|string|max:150',
            'direccion' => 'required|string|max:200',
            'genero' => 'required|string|max:6',
            'fecha_nac' => 'required|date',
        ]);

        $validated['activo'] = true;
        $validated['user_id'] = Auth::id(); // ← Se guarda el usuario autenticado

        Cliente::create($validated);

        return redirect()->route('clientes.index')->with('success', 'Cliente creado con éxito.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cliente $cliente)
    {
        return Inertia::render('clientes/edit', [
            'cliente' => $cliente,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'dni' => 'required|string|max:13',
            'rtn' => 'nullable|string|max:14',
            'nombres' => 'required|string|max:150',
            'apellidos' => 'required|string|max:150',
            'direccion' => 'nullable|string|max:200',
            'genero' => 'required|string|max:6',
            'fecha_nac' => 'required|date',
            'activo' => 'required|boolean',
        ]);

        $cliente = Cliente::findOrFail($id);
        $cliente->update($validated);

        return redirect()->route('clientes.index')->with('success', 'Cliente actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return redirect()->route('clientes.index')->with('success', 'Cliente eliminado correctamente.');
    }
}
