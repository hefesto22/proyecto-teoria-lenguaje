<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insertar 20 categorías
        $categorias = [
            'Bebidas', 'Snacks', 'Frutas', 'Verduras', 'Carnes',
            'Lácteos', 'Panadería', 'Cereales', 'Limpieza', 'Higiene personal',
            'Electrónica', 'Ropa', 'Juguetes', 'Papelería', 'Mascotas',
            'Congelados', 'Salsas y condimentos', 'Comida rápida', 'Postres', 'Enlatados'
        ];

        foreach ($categorias as $nombre) {
            DB::table('categorias')->insert([
                'nombre' => $nombre,
                'activa' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insertar 50 clientes
        $faker = Faker::create();

        for ($i = 0; $i < 50; $i++) {
            DB::table('clientes')->insert([
                'DNI' => $faker->numerify('###########'), // 11 dígitos
                'RTN' => $faker->numerify('##############'), // 14 dígitos
                'NOMBRES' => strtoupper($faker->firstName),
                'APELLIDOS' => strtoupper($faker->lastName),
                'DIRECCION' => $faker->address,
                'GENERO' => $faker->randomElement(['HOMBRE', 'MUJER']),
                'FECHA_NAC' => $faker->date('Y-m-d', '2005-01-01'),
                'FECHA_CREACION' => now()->toDateString(),
                'ACTIVO' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
