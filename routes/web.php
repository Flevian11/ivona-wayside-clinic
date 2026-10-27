<?php

use App\Http\Controllers\Admin\DeveloperToolsController;
use App\Http\Controllers\Admin\SystemReleaseController;
use App\Http\Controllers\Api\SystemVersionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardReleaseAcknowledgementController;
use App\Http\Controllers\ReleaseChangelogController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Public self-registration is disabled; send direct visits back to the clinic homepage.
Route::redirect('/register', '/', 302)->name('register.disabled');

// Public website pages share the dynamic clinic identity, metadata, navigation, and footer.
Route::inertia('/about', 'public/about')->name('public.about');
Route::inertia('/services', 'public/services')->name('public.services');
Route::inertia('/blog', 'public/blog')->name('public.blog');
Route::inertia('/careers', 'public/careers')->name('public.careers');

Route::inertia('/contact', 'public/contact', [
    'pageTitle' => 'Contact Us',
    'pageDescription' => 'Find current contact information and learn how to reach the clinic team.',
])->name('public.contact');

Route::inertia('/privacy', 'public/legal', [
    'pageKey' => 'privacy',
])->name('public.privacy');

Route::inertia('/terms', 'public/legal', [
    'pageKey' => 'terms',
])->name('public.terms');

Route::inertia('/gdpr', 'public/legal', [
    'pageKey' => 'data-protection',
])->name('public.gdpr');

// Public system-version endpoint.
Route::get('/api/system/version', SystemVersionController::class)
    ->name('api.system.version');

// Email OTP challenge for accounts with Fortify two-factor authentication enabled.
Route::middleware(['throttle:email-otp'])->group(function () {
    Route::get('/email-otp/challenge', [\App\Http\Controllers\Auth\EmailOtpChallengeController::class, 'show'])
        ->name('email-otp.challenge');
    Route::post('/email-otp/challenge', [\App\Http\Controllers\Auth\EmailOtpChallengeController::class, 'verify'])
        ->name('email-otp.verify');
    Route::post('/email-otp/resend', [\App\Http\Controllers\Auth\EmailOtpChallengeController::class, 'resend'])
        ->name('email-otp.resend');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/settings/security/email-2fa/send', [\App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::class, 'send'])
        ->middleware('throttle:email-otp')
        ->name('email-otp.setup.send');
    Route::post('/settings/security/email-2fa/confirm', [\App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::class, 'confirm'])
        ->middleware('throttle:email-otp')
        ->name('email-otp.setup.confirm');

    // Staff dashboard and release announcements.
    Route::get('/dashboard', DashboardController::class)
        ->name('dashboard');

    Route::get('/releases/changelog', ReleaseChangelogController::class)
        ->name('releases.changelog');

    Route::post(
        '/dashboard/releases/{systemRelease}/acknowledge',
        DashboardReleaseAcknowledgementController::class,
    )
        ->whereNumber('systemRelease')
        ->name('dashboard.releases.acknowledge');

    // Release management.
    Route::prefix('admin/system/releases')
        ->name('admin.system.releases.')
        ->group(function () {
            Route::get('/', [SystemReleaseController::class, 'index'])
                ->middleware('can:releases.view')
                ->name('index');

            Route::post('/', [SystemReleaseController::class, 'store'])
                ->middleware('can:releases.create')
                ->name('store');

            Route::get('/{systemRelease}', [SystemReleaseController::class, 'show'])
                ->middleware('can:releases.view')
                ->whereNumber('systemRelease')
                ->name('show');

            Route::put('/{systemRelease}', [SystemReleaseController::class, 'update'])
                ->middleware('can:releases.update')
                ->whereNumber('systemRelease')
                ->name('update');

            Route::post(
                '/{systemRelease}/publish',
                [SystemReleaseController::class, 'publish'],
            )
                ->middleware('can:releases.publish')
                ->whereNumber('systemRelease')
                ->name('publish');

            Route::post(
                '/{systemRelease}/withdraw',
                [SystemReleaseController::class, 'withdraw'],
            )
                ->middleware('can:releases.withdraw')
                ->whereNumber('systemRelease')
                ->name('withdraw');
        });

});

require __DIR__.'/patients.php';

require __DIR__.'/developer-tools.php';

require __DIR__.'/administration.php';

require __DIR__.'/settings.php';

require __DIR__.'/operations.php';

require __DIR__.'/clinical-operations.php';
