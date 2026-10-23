import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:26
 * @route '/admin/administration/facility-settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:26
 * @route '/admin/administration/facility-settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:26
 * @route '/admin/administration/facility-settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:26
 * @route '/admin/administration/facility-settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:26
 * @route '/admin/administration/facility-settings'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:101
 * @route '/admin/administration/facility-settings/logo'
 */
export const logo = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: logo.url(options),
    method: 'put',
})

logo.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/logo',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:101
 * @route '/admin/administration/facility-settings/logo'
 */
logo.url = (options?: RouteQueryOptions) => {
    return logo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:101
 * @route '/admin/administration/facility-settings/logo'
 */
logo.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: logo.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:101
 * @route '/admin/administration/facility-settings/logo'
 */
    const logoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logo.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:101
 * @route '/admin/administration/facility-settings/logo'
 */
        logoForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    logo.form = logoForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:106
 * @route '/admin/administration/facility-settings/favicon'
 */
export const favicon = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: favicon.url(options),
    method: 'put',
})

favicon.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/favicon',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:106
 * @route '/admin/administration/facility-settings/favicon'
 */
favicon.url = (options?: RouteQueryOptions) => {
    return favicon.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:106
 * @route '/admin/administration/facility-settings/favicon'
 */
favicon.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: favicon.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:106
 * @route '/admin/administration/facility-settings/favicon'
 */
    const faviconForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: favicon.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:106
 * @route '/admin/administration/facility-settings/favicon'
 */
        faviconForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: favicon.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    favicon.form = faviconForm
const facilitySettings = {
    update: Object.assign(update, update),
logo: Object.assign(logo, logo),
favicon: Object.assign(favicon, favicon),
}

export default facilitySettings