<?php

namespace App\Providers;

use App\Models\RessourcePedagogique;
use App\Policies\RessourcePedagogiquePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        RessourcePedagogique::class => RessourcePedagogiquePolicy::class,
    ];

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
        Gate::guessPolicyNamesUsing(function (string $modelClass) {
            return 'App\\Policies\\'.class_basename($modelClass).'Policy';
        });
    }
}
