<?php

use App\Http\Controllers\AppointmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('can:appointments.view')->name('appointments.index');
    Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('can:appointments.manage')->name('appointments.store');
    Route::patch('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus'])->whereNumber('appointment')->middleware('can:appointments.manage')->name('appointments.status');
});
