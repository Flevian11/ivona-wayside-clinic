import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::save
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
export const save = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: save.url(args, options),
    method: 'put',
})

save.definition = {
    methods: ["put"],
    url: '/developer-tools/integrations/{integration}/environments',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::save
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
save.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { integration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    integration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        integration: typeof args.integration === 'object'
                ? args.integration.id
                : args.integration,
                }

    return save.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::save
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
save.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: save.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::save
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
    const saveForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: save.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::save
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
        saveForm.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: save.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    save.form = saveForm
const environments = {
    save: Object.assign(save, save),
}

export default environments