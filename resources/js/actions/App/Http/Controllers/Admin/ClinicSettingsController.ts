import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
export const facility = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facility.url(options),
    method: 'get',
})

facility.definition = {
    methods: ["get","head"],
    url: '/admin/administration/facility-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
facility.url = (options?: RouteQueryOptions) => {
    return facility.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
facility.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facility.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
facility.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: facility.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
    const facilityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: facility.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
        facilityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: facility.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
        facilityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: facility.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    facility.form = facilityForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
 * @route '/admin/administration/facility-settings'
 */
export const updateFacility = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacility.url(options),
    method: 'put',
})

updateFacility.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
 * @route '/admin/administration/facility-settings'
 */
updateFacility.url = (options?: RouteQueryOptions) => {
    return updateFacility.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
 * @route '/admin/administration/facility-settings'
 */
updateFacility.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacility.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
 * @route '/admin/administration/facility-settings'
 */
    const updateFacilityForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFacility.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
 * @route '/admin/administration/facility-settings'
 */
        updateFacilityForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFacility.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFacility.form = updateFacilityForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
export const system = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: system.url(options),
    method: 'get',
})

system.definition = {
    methods: ["get","head"],
    url: '/admin/administration/system-configuration',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
system.url = (options?: RouteQueryOptions) => {
    return system.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
system.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: system.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
system.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: system.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
    const systemForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: system.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
        systemForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: system.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
        systemForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: system.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    system.form = systemForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:74
 * @route '/admin/administration/system-configuration'
 */
export const updateSystem = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSystem.url(options),
    method: 'put',
})

updateSystem.definition = {
    methods: ["put"],
    url: '/admin/administration/system-configuration',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:74
 * @route '/admin/administration/system-configuration'
 */
updateSystem.url = (options?: RouteQueryOptions) => {
    return updateSystem.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:74
 * @route '/admin/administration/system-configuration'
 */
updateSystem.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSystem.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:74
 * @route '/admin/administration/system-configuration'
 */
    const updateSystemForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSystem.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:74
 * @route '/admin/administration/system-configuration'
 */
        updateSystemForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSystem.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSystem.form = updateSystemForm
const ClinicSettingsController = { facility, updateFacility, system, updateSystem }

export default ClinicSettingsController