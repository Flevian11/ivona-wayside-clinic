<?php

use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientOperationsController;
use App\Http\Controllers\ShaClaimsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('/operations/sha-claims', [ShaClaimsController::class, 'index'])->middleware('can:sha.claims.view')->name('operations.sha-claims.index');
    Route::get('/visits', [PatientOperationsController::class, 'visits'])->middleware('can:appointments.view')->name('visits.index');
    Route::get('/visits/{encounter}', [PatientOperationsController::class, 'showVisit'])->whereNumber('encounter')->middleware('can:appointments.view')->name('visits.show');
    Route::patch('/visits/{encounter}', [PatientOperationsController::class, 'updateVisit'])->whereNumber('encounter')->middleware('can:appointments.manage')->name('visits.update');
    Route::get('/visits/icd11/search', [PatientOperationsController::class, 'icd11Search'])->middleware('can:appointments.view')->name('visits.icd11.search');
    Route::post('/visits/{encounter}/documents', [PatientOperationsController::class, 'uploadDocument'])->whereNumber('encounter')->middleware('can:appointments.manage')->name('visits.documents.store');
    Route::get('/visits/{encounter}/documents/{document}', [PatientOperationsController::class, 'downloadDocument'])->whereNumber('encounter')->whereNumber('document')->middleware('can:appointments.view')->name('visits.documents.download');
    Route::delete('/visits/{encounter}/documents/{document}', [PatientOperationsController::class, 'deleteDocument'])->whereNumber('encounter')->whereNumber('document')->middleware('can:appointments.manage')->name('visits.documents.delete');
    Route::post('/visits/{encounter}/benefits/refresh', [PatientOperationsController::class, 'refreshVisitBenefits'])->whereNumber('encounter')->middleware('can:appointments.manage')->name('visits.benefits.refresh');
    Route::post('/visits/{encounter}/invoice/issue', [PatientOperationsController::class, 'issueInvoice'])->whereNumber('encounter')->middleware('can:appointments.manage')->name('visits.invoice.issue');
    Route::get('/visits/{encounter}/invoice.pdf', [PatientOperationsController::class, 'downloadInvoice'])->whereNumber('encounter')->middleware('can:appointments.view')->name('visits.invoice.pdf');
    Route::post('/visits/{encounter}/complete', [PatientOperationsController::class, 'completeVisit'])->whereNumber('encounter')->middleware('can:appointments.manage')->name('visits.complete');
    Route::post('/visits/{encounter}/sha-claim/authorization/start', [PatientOperationsController::class, 'startShaClaimAuthorization'])->whereNumber('encounter')->name('visits.sha-claim.authorization.start');
    Route::post('/visits/{encounter}/sha-claim/authorization', [PatientOperationsController::class, 'authorizeShaClaim'])->whereNumber('encounter')->name('visits.sha-claim.authorization');
    Route::post('/visits/{encounter}/claim', [PatientOperationsController::class, 'submitShaClaim'])->whereNumber('encounter')->name('visits.sha-claim.submit');
    Route::get('/preauthorizations', [PatientOperationsController::class, 'preauthorizations'])->middleware('can:sha.services.verify')->name('preauthorizations.index');
    Route::get('/patients', [PatientController::class, 'index'])->middleware('can:patients.view')->name('patients.index');
    Route::post('/patients/duplicate-check', [PatientController::class, 'duplicateCheck'])->middleware('can:patients.create')->name('patients.duplicate-check');
    Route::post('/patients/sha-lookup', [PatientController::class, 'lookupShaIdentifier'])->middleware('can:patients.create')->name('patients.sha-lookup');
    Route::post('/patients/sha-benefits', [PatientController::class, 'shaBenefits'])->middleware('can:patients.create')->name('patients.sha-benefits');
    Route::post('/patients/sha-preauthorization-check', [PatientController::class, 'shaPreauthorizationCheck'])->middleware('can:patients.create')->name('patients.sha-preauthorization-check');
    Route::post('/patients/principal-authorization/start', [PatientController::class, 'startPrincipalAuthorization'])->middleware('can:patients.create')->name('patients.principal-authorization.start');
    Route::post('/patients/principal-authorization/verify', [PatientController::class, 'verifyPrincipalAuthorization'])->middleware('can:patients.create')->name('patients.principal-authorization.verify');
    Route::get('/patients/create', [PatientController::class, 'create'])->middleware('can:patients.create')->name('patients.create');
    Route::post('/patients', [PatientController::class, 'store'])->middleware('can:patients.create')->name('patients.store');
    Route::patch('/patients/{patient}', [PatientController::class, 'update'])->whereNumber('patient')->middleware('can:patients.update')->name('patients.update');
    Route::post('/patients/{patient}/consents', [PatientController::class, 'recordConsent'])->whereNumber('patient')->middleware('can:patients.update')->name('patients.consents.store');
    Route::get('/patients/{patient}', [PatientController::class, 'show'])->whereNumber('patient')->middleware('can:patients.view')->name('patients.show');
    Route::post('/patients/{patient}/encounters', [PatientController::class, 'createVisit'])->whereNumber('patient')->middleware('can:appointments.manage')->name('patients.encounters.store');
    Route::post('/patients/{patient}/sha-eligibility', [PatientController::class, 'shaEligibility'])->whereNumber('patient')->middleware('can:sha.eligibility.verify')->name('patients.sha-eligibility');
});


require __DIR__.'/operations.php';
