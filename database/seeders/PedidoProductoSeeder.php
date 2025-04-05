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
        $clientes = DB::table('clientes')->pluck('id')->toArray();
        $userId = 4; // 👈 Usuario fijo

        if (empty($categorias) || empty($clientes)) {
            $this->command->warn('Debe haber categorías y clientes en la base de datos.');
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
                'nombre'       => ucfirst($faker->words(2, true)),
                'precio'       => $faker->randomFloat(2, 10, 500),
                'stock'        => $faker->numberBetween(10, 30),
                'categoria_id' => $faker->randomElement($categorias),
                'user_id'      => $userId, // 👈 Asignar al usuario 4
                'activo'       => true,
                'created_at'   => now(),
                'updated_at'   => now(),
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
                    'path'        => $path,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        }

        // Crear 50 pedidos válidos
        for ($i = 0; $i < 50; $i++) {
            $estado = $faker->randomElement(['pendiente', 'espera', 'pagado']);
            $clienteId = $faker->randomElement($clientes);

            // Crear pedido
            $pedidoId = DB::table('pedidos')->insertGetId([
                'cliente_id'   => $clienteId,
                'user_id'      => $userId, // 👈 Todos los pedidos del usuario 4
                'total'        => 0,
                'monto_pagado' => 0,
                'estado'       => $estado,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            $total = 0;
            $productosDisponibles = DB::table('productos')->where('stock', '>=', 1)->inRandomOrder()->take(rand(1, 5))->get();

            foreach ($productosDisponibles as $producto) {
                $cantidad = 1;
                $subtotal = $cantidad * $producto->precio;

                DB::table('pedido_producto')->insert([
                    'pedido_id'   => $pedidoId,
                    'producto_id' => $producto->id,
                    'cantidad'    => $cantidad,
                    'precio'      => $producto->precio,
                    'total'       => $subtotal,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                DB::table('productos')->where('id', $producto->id)->decrement('stock', $cantidad);
                $total += $subtotal;
            }

            $montoPagado = $faker->randomFloat(2, 0, $total);
            $estado = match (true) {
                $montoPagado >= $total => 'pagado',
                $montoPagado > 0       => 'espera',
                default                => 'pendiente',
            };

            DB::table('pedidos')->where('id', $pedidoId)->update([
                'total'        => $total,
                'monto_pagado' => $montoPagado,
                'estado'       => $estado,
            ]);
        }
    }
}
