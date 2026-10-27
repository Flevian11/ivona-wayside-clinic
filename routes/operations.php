<?php

use App\Http\Controllers\InventoryProcurementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('/inventory', [InventoryProcurementController::class, 'inventory'])->middleware('can:inventory.view')->name('inventory.index');
    Route::post('/inventory/items', [InventoryProcurementController::class, 'storeItem'])->middleware('can:inventory.manage')->name('inventory.items.store');
    Route::post('/inventory/items/{item}/movements', [InventoryProcurementController::class, 'adjustStock'])->whereNumber('item')->middleware('can:inventory.manage')->name('inventory.movements.store');

    Route::get('/procurement', [InventoryProcurementController::class, 'procurement'])->middleware('can:procurement.view')->name('procurement.index');
    Route::post('/procurement/requests', [InventoryProcurementController::class, 'storeRequest'])->middleware('can:procurement.manage')->name('procurement.requests.store');
    Route::post('/procurement/requests/{procurementRequest}/review', [InventoryProcurementController::class, 'reviewRequest'])->whereNumber('procurementRequest')->middleware('can:procurement.approve')->name('procurement.requests.review');
});
