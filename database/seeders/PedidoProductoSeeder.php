<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class PedidoProductoSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $categorias = DB::table('categorias')->pluck('id')->toArray();
        $usuarios = DB::table('users')->pluck('id')->toArray();
        $clientes = DB::table('clientes')->pluck('id')->toArray();

        if (empty($categorias) || empty($usuarios) || empty($clientes)) {
            $this->command->warn('Debe haber categorías, usuarios y clientes en la base de datos.');
            return;
        }

        // Verificar imágenes de ejemplo
        $imageFiles = File::files(public_path('storage/fake_imagen'));
        if (empty($imageFiles)) {
            $this->command->warn('No hay imágenes en public/storage/fake_imagen.');
            return;
        }

        $productos = [];

        // Crear 20 productos
        for ($i = 0; $i < 20; $i++) {
            $productoId = DB::table('productos')->insertGetId([
                'nombre' => ucfirst($faker->words(2, true)),
                'precio' => $faker->randomFloat(2, 10, 500),
                'stock' => $faker->numberBetween(10, 30),
                'categoria_id' => $faker->randomElement($categorias),
                'user_id' => $faker->randomElement($usuarios),
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $precio = DB::table('productos')->where('id', $productoId)->value('precio');
            $productos[] = ['id' => $productoId, 'precio' => $precio];

            // Agregar imágenes
            $imagenes = $faker->randomElements($imageFiles, rand(1, 4));
            foreach ($imagenes as $img) {
                $filename = Str::uuid() . '.' . $img->getExtension();
                $path = "productos/$filename";
                Storage::disk('public')->put($path, File::get($img->getRealPath()));

                DB::table('imagenes')->insert([
                    'producto_id' => $productoId,
                    'path' => $path,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Crear 50 pedidos válidos (sin "cancelado")
        for ($i = 0; $i < 50; $i++) {
            $pedidoId = DB::table('pedidos')->insertGetId([
                'cliente_id' => $faker->randomElement($clientes),
                'total' => 0,
                'monto_pagado' => 0,
                'estado' => $faker->randomElement(['pendiente', 'espera', 'pagado']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $total = 0;
            $productosDisponibles = DB::table('productos')->where('stock', '>=', 1)->inRandomOrder()->take(rand(1, 5))->get();

            foreach ($productosDisponibles as $producto) {
                // Validación de stock
                if ($producto->stock < 1) {
                    continue;
                }

                $cantidad = 1;
                $subtotal = $cantidad * $producto->precio;

                DB::table('pedido_producto')->insert([
                    'pedido_id' => $pedidoId,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio' => $producto->precio,
                    'total' => $subtotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('productos')->where('id', $producto->id)->decrement('stock', 1);
                $total += $subtotal;
            }

            DB::table('pedidos')->where('id', $pedidoId)->update([
                'total' => $total,
                'monto_pagado' => $faker->randomFloat(2, 0, $total),
            ]);
        }
    }
}
