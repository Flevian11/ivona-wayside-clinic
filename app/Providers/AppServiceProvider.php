<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthorization();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function configureAuthorization(): void
    {
        // Permissions are catalogue-driven. Any permission added through the
        // Roles & Permissions system becomes enforceable without editing code.
        Gate::before(function ($user, string $ability): ?bool {
            try {
                $permissionExists = \App\Models\Permission::query()
                    ->where('name', $ability)
                    ->exists();

                if (! $permissionExists) {
                    // Preserve Laravel policies and other non-RBAC abilities.
                    return null;
                }

                return method_exists($user, 'hasPermissionTo')
                    ? $user->hasPermissionTo($ability)
                    : false;
            } catch (Throwable) {
                // Fail closed if authorization data cannot be read.
                return false;
            }
        });
    }
}
