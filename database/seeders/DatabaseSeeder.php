<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // User::factory(10)->create();
        $user = User::factory(1)->create();

        // Crear roles si no existen
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'gerente']);
        Role::firstOrCreate(['name' => 'usuario']);

        // Crear usuario admin
        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'), // Cambia la contraseña si quieres
            'role_id' => $adminRole->id,
        ]);

    }
}
