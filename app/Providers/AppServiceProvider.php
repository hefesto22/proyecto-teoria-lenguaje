<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'authUser' => fn () => Auth::check()
                ? [
                    'id' => Auth::id(),
                    'role' => Auth::user()->role->name ?? null, // 👈 Asegúrate de tener la relación role en User
                ]
                : null,
        ]);
    }
    
}
