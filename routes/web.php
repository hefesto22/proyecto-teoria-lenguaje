<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;

Route::get('/', function () {
    return view('auth.login');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth')->name('dashboard');

// ESTA ES LA RUTA QUE NECESITAS
Route::post('/login', [LoginController::class, 'login'])->name('login.perform');

