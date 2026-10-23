<?php

use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('/patients', [PatientController::class, 'index'])->middleware('can:patients.view')->name('patients.index');
    Route::post('/patients/sha-lookup', [PatientController::class, 'lookupShaIdentifier'])->middleware('can:patients.create')->name('patients.sha-lookup');
    Route::get('/patients/create', [PatientController::class, 'create'])->middleware('can:patients.create')->name('patients.create');
    Route::post('/patients', [PatientController::class, 'store'])->middleware('can:patients.create')->name('patients.store');
    Route::get('/patients/{patient}', [PatientController::class, 'show'])->whereNumber('patient')->middleware('can:patients.view')->name('patients.show');
    Route::post('/patients/{patient}/encounters', [PatientController::class, 'createVisit'])->whereNumber('patient')->middleware('can:appointments.manage')->name('patients.encounters.store');
    Route::post('/patients/{patient}/sha-eligibility', [PatientController::class, 'shaEligibility'])->whereNumber('patient')->middleware('can:sha.eligibility.verify')->name('patients.sha-eligibility');
});
