<?php

use App\Http\Controllers\Admin\SystemReleaseController;
use App\Http\Controllers\Api\SystemVersionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Public-facing route shells share the same dynamic identity, SEO metadata, header, and footer.
// Each page's full content and workflows will be implemented as its module is developed.
Route::inertia('/about', 'public/information', [
    'pageTitle' => 'About the Hospital',
    'pageDescription' => 'Learn about our hospital, our approach to care, and the community we serve.',
])->name('public.about');
Route::inertia('/services', 'public/information', [
    'pageTitle' => 'Our Services',
    'pageDescription' => 'Explore healthcare services and patient information from our hospital.',
])->name('public.services');
Route::inertia('/blog', 'public/information', [
    'pageTitle' => 'Health Stories & Updates',
    'pageDescription' => 'Read health education, hospital news, and community updates.',
])->name('public.blog');
Route::inertia('/careers', 'public/information', [
    'pageTitle' => 'Careers',
    'pageDescription' => 'Discover career opportunities and ways to work with our hospital.',
])->name('public.careers');
Route::inertia('/contact', 'public/contact', [
    'pageTitle' => 'Contact Us',
    'pageDescription' => 'Find hospital contact information and learn how to reach our team.',
])->name('public.contact');
Route::inertia('/privacy', 'public/information', [
    'pageTitle' => 'Privacy Policy',
    'pageDescription' => 'Information about how personal data is handled and protected.',
])->name('public.privacy');
Route::inertia('/terms', 'public/information', [
    'pageTitle' => 'Terms and Conditions',
    'pageDescription' => 'Terms governing use of this website and its public information.',
])->name('public.terms');
Route::inertia('/gdpr', 'public/information', [
    'pageTitle' => 'Data Protection',
    'pageDescription' => 'Information about privacy rights, data protection, and related requests.',
])->name('public.gdpr');

Route::get('/api/system/version', SystemVersionController::class)
    ->name('api.system.version');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

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

            Route::post('/{systemRelease}/publish', [SystemReleaseController::class, 'publish'])
                ->middleware('can:releases.publish')
                ->whereNumber('systemRelease')
                ->name('publish');

            Route::post('/{systemRelease}/withdraw', [SystemReleaseController::class, 'withdraw'])
                ->middleware('can:releases.withdraw')
                ->whereNumber('systemRelease')
                ->name('withdraw');
        });
});

require __DIR__.'/settings.php';