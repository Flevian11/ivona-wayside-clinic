<?php

use App\Http\Controllers\Admin\AdministrationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin/administration')
    ->name('admin.administration.')
    ->group(function (): void {
        Route::get('/users', [AdministrationController::class, 'users'])->middleware('can:users.manage')->name('users');
        Route::post('/users', [AdministrationController::class, 'storeUser'])->middleware('can:users.manage')->name('users.store');
        Route::put('/users/{user}', [AdministrationController::class, 'updateUser'])->whereNumber('user')->middleware('can:users.manage')->name('users.update');

        Route::get('/staff', [AdministrationController::class, 'staff'])->middleware('can:staff.manage')->name('staff');
        Route::post('/staff', [AdministrationController::class, 'storeStaff'])->middleware('can:staff.manage')->name('staff.store');
        Route::put('/staff/{staffMember}', [AdministrationController::class, 'updateStaff'])->whereNumber('staffMember')->middleware('can:staff.manage')->name('staff.update');

        Route::get('/roles', [AdministrationController::class, 'roles'])->middleware('can:roles.manage')->name('roles');
        Route::post('/roles', [AdministrationController::class, 'storeRole'])->middleware('can:roles.manage')->name('roles.store');
        Route::put('/roles/{role}', [AdministrationController::class, 'updateRole'])->whereNumber('role')->middleware('can:roles.manage')->name('roles.update');
        Route::get('/roles/{role}/permissions', [AdministrationController::class, 'rolePermissions'])->whereNumber('role')->middleware('can:roles.manage')->name('roles.permissions.edit');
        Route::put('/roles/{role}/permissions', [AdministrationController::class, 'syncRolePermissions'])->whereNumber('role')->middleware('can:roles.manage')->name('roles.permissions');

        Route::get('/permissions', [AdministrationController::class, 'permissions'])->middleware('can:roles.manage')->name('permissions');
        Route::get('/role-assignments', [AdministrationController::class, 'assignments'])->middleware('can:roles.manage')->name('assignments');
        Route::put('/role-assignments/{user}', [AdministrationController::class, 'syncUserRoles'])->whereNumber('user')->middleware('can:roles.manage')->name('assignments.sync');

        Route::get('/access-history', [AdministrationController::class, 'accessHistory'])->middleware('can:audit.view')->name('access-history');

        Route::get('/facility-settings', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'facility'])->middleware('can:settings.view')->name('facility-settings');
        Route::put('/facility-settings', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'updateFacility'])->middleware('can:settings.manage')->name('facility-settings.update');
        Route::put('/facility-settings/identity', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'updateFacilityIdentity'])->middleware('can:settings.manage')->name('facility-settings.identity');
        Route::put('/facility-settings/contact', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'updateFacilityContact'])->middleware('can:settings.manage')->name('facility-settings.contact');
        Route::put('/facility-settings/social-links', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'updateFacilitySocialLinks'])->middleware('can:settings.manage')->name('facility-settings.social-links');
        Route::put('/facility-settings/public-links', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'updateFacilityPublicLinks'])->middleware('can:settings.manage')->name('facility-settings.public-links');
        Route::put('/facility-settings/logo', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'updateLogo'])->middleware('can:settings.manage')->name('facility-settings.logo');
        Route::put('/facility-settings/favicon', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'updateFavicon'])->middleware('can:settings.manage')->name('facility-settings.favicon');
        Route::get('/system-configuration', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'system'])->middleware('can:settings.view')->name('system-configuration');
        Route::put('/system-configuration', [\App\Http\Controllers\Admin\ClinicSettingsController::class, 'updateSystem'])->middleware('can:settings.manage')->name('system-configuration.update');
    });
