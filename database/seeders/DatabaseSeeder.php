<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Obtener el ID del rol 'admin'
        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');

        // Crear un usuario admin
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'), // puedes cambiarlo
            'role_id' => $adminRoleId,
        ]);
    }
}
