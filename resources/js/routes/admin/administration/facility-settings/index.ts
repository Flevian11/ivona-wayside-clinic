import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
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
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
 * @route '/admin/administration/facility-settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
 * @route '/admin/administration/facility-settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
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
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:24
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
const facilitySettings = {
    update: Object.assign(update, update),
}

export default facilitySettings