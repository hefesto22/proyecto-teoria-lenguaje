<?php

namespace App\Http\Controllers;

use App\Models\Imagen;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ImagenController extends Controller
{
    public function destroy($id)
    {
        $imagen = Imagen::findOrFail($id);

        // Eliminar archivo físico
        if (Storage::disk('public')->exists($imagen->path)) {
            Storage::disk('public')->delete($imagen->path);
        }

        $imagen->delete();

        return response('', 204); // 👈 esto evita el error de Inertia
    }
}
