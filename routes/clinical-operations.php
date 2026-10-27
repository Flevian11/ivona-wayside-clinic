<?php

use App\Http\Controllers\ClinicalOperationsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('/nursing', [ClinicalOperationsController::class, 'nursing'])->name('nursing.index');
    Route::get('/laboratory', [ClinicalOperationsController::class, 'laboratory'])->name('laboratory.index');
    Route::get('/pharmacy', [ClinicalOperationsController::class, 'pharmacy'])->name('pharmacy.index');
});
