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
        $permissions = [
            'releases.view',
            'releases.create',
            'releases.update',
            'releases.publish',
            'releases.withdraw',
            'settings.view',
            'settings.manage',
            'audit.view',
            'roles.manage',
            'users.manage',
        ];

        foreach ($permissions as $permission) {
            Gate::define($permission, function ($user) use ($permission): bool {
                try {
                    return method_exists($user, 'hasPermissionTo')
                        && $user->hasPermissionTo($permission);
                } catch (Throwable) {
                    return false;
                }
            });
        }
    }
}