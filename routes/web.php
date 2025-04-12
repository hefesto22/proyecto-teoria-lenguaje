<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ImagenController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\PedidoController;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');



Route::delete('/imagenes/{id}', [ImagenController::class, 'destroy'])->name('imagenes.destroy');

Route::resource('users', UserController::class);
Route::resource('categorias', CategoriaController::class);
Route::resource('productos', ProductoController::class);
Route::resource('clientes', ClienteController::class);
// routes/api.php o web.php
Route::resource('pedidos', PedidoController::class);
Route::put('/pedidos/{pedido}/pagar', [PedidoController::class, 'marcarComoPagado'])
    ->name('pedidos.marcarPagado');
    Route::get('/pedidos/{pedido}', [PedidoController::class, 'show'])->name('pedidos.show');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
