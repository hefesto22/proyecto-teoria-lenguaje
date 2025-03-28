<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index(Request $request)
    {
        // Se realiza la consulta de los clientes, aplicando el filtro de búsqueda
        $clientes = Cliente::query()
            ->when($request->search, fn($q) =>
                $q->where('NOMBRES', 'like', '%' . $request->search . '%'))
            ->orderBy('NOMBRES')
            ->paginate(10)
            ->withQueryString();

        // Retornamos los datos a la vista Inertia
        return Inertia::render('clientes/index', [
            'clientes' => $clientes, // Aquí cambié a 'clientes' en lugar de 'categorias' para que sea consistente
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
        'DNI' => 'required|string|max:13',
        'RTN' => 'required|string|max:14',
        'NOMBRES' => 'required|string|max:150',
        'APELLIDOS' => 'required|string|max:150',
        'DIRECCION' => 'required|string|max:200',
        'GENERO' => 'required|string|max:6',
        'FECHA_NAC' => 'required|date',
    ]);

    // Asegúrate de agregar el campo ACTIVO con valor true
    $validated['ACTIVO'] = true;

    // Crear el cliente con los datos validados
    Cliente::create($validated);

    return redirect()->route('clientes.index')->with('success', 'Cliente creado con éxito.');
}

    /**
     * Display the specified resource.
     */
    public function show(Cliente $cliente)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cliente $cliente)
    {
         // Retornar la vista de edición con los datos del cliente
         return Inertia::render('clientes/edit', [
        'cliente' => $cliente,
          ]);
    }

    /**
     * Update the specified resource in storage.
     */

   public function update(Request $request, $id)
{
    $request->validate([
        'DNI' => 'required|string|max:20',
        'RTN' => 'nullable|string|max:14',
        'NOMBRES' => 'required|string|max:100',
        'APELLIDOS' => 'required|string|max:100',
        'DIRECCION' => 'nullable|string|max:255',
        'GENERO' => 'required|string|max:10',
        'FECHA_NAC' => 'required|date',
        'ACTIVO' => 'required|boolean',
    ]);

    $cliente = Cliente::findOrFail($id);
    $cliente->update([
        'DNI' => $request->DNI,
        'RTN' => $request->RTN,
        'NOMBRES' => $request->NOMBRES,
        'APELLIDOS' => $request->APELLIDOS,
        'DIRECCION' => $request->DIRECCION,
        'GENERO' => $request->GENERO,
        'FECHA_NAC' => $request->FECHA_NAC,
        'ACTIVO' => $request->ACTIVO,
    ]);

    return redirect()->route('clientes.index')->with('success', 'Cliente actualizado correctamente');
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return redirect()->route('clientes.index')->with('success', 'Cliente eliminada correctamente.');
    }
}
