<?php
use App\Http\Controllers\Admin\DeveloperToolsController;
use App\Http\Middleware\AuthenticateInboundApiKey;
use Illuminate\Support\Facades\Route;
Route::middleware(['auth','verified'])->prefix('developer-tools')->name('developer-tools.')->group(function(){
 Route::get('/',[DeveloperToolsController::class,'index'])->middleware('can:integrations.view')->name('index');
 Route::get('/inbound-keys',[DeveloperToolsController::class,'inboundKeys'])->middleware('can:integrations.view')->name('inbound-keys');
 Route::post('/api-keys',[DeveloperToolsController::class,'storeApiKey'])->middleware('can:integrations.manage')->name('api-keys.store');
 Route::delete('/api-keys/{apiKey}',[DeveloperToolsController::class,'revokeApiKey'])->middleware('can:integrations.manage')->whereNumber('apiKey')->name('api-keys.revoke');
 Route::get('/integrations',[DeveloperToolsController::class,'integrations'])->middleware('can:integrations.view')->name('integrations');
 Route::get('/environments',[DeveloperToolsController::class,'environmentIndex'])->middleware('can:integrations.view')->name('environment-index');
 Route::post('/integrations',[DeveloperToolsController::class,'storeIntegration'])->middleware('can:integrations.manage')->name('integrations.store');
 Route::put('/integrations/{integration}',[DeveloperToolsController::class,'updateIntegration'])->middleware('can:integrations.manage')->whereNumber('integration')->name('integrations.update');
 Route::delete('/integrations/{integration}',[DeveloperToolsController::class,'deleteIntegration'])->middleware('can:integrations.manage')->whereNumber('integration')->name('integrations.destroy');
 Route::patch('/integrations/{integration}/status',[DeveloperToolsController::class,'updateIntegrationStatus'])->middleware('can:integrations.manage')->whereNumber('integration')->name('integrations.status');
 Route::get('/integrations/{integration}/environments',[DeveloperToolsController::class,'environments'])->middleware('can:integrations.view')->whereNumber('integration')->name('environments');
 Route::put('/integrations/{integration}/environments',[DeveloperToolsController::class,'saveEnvironment'])->middleware('can:integrations.manage')->whereNumber('integration')->name('environments.save');
 Route::post('/integrations/{integration}/test',[DeveloperToolsController::class,'testEnvironment'])->middleware('can:integrations.manage')->whereNumber('integration')->name('test');
 Route::get('/hie',[DeveloperToolsController::class,'hie'])->middleware('can:integrations.view')->name('hie');
 Route::get('/activity',[DeveloperToolsController::class,'activity'])->middleware('can:integrations.view')->name('activity');
 Route::get('/testing',[DeveloperToolsController::class,'testing'])->middleware('can:integrations.view')->name('testing');
});
Route::get('/api/v1/status',fn()=>response()->json(['status'=>'ok','service'=>'ivona-wayside-clinic-api','version'=>config('app.version','0.1.0'),'environment'=>config('integrations.environment','development'),'mock'=>config('integrations.environment','development')==='development']))->middleware(AuthenticateInboundApiKey::class.':system.read')->name('api.v1.status');
