import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/developer-tools/integrations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::update
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
export const update = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/developer-tools/integrations/{integration}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::update
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
update.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::update
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
update.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::update
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
    const updateForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::update
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
        updateForm.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::destroy
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
export const destroy = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/developer-tools/integrations/{integration}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::destroy
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
destroy.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::destroy
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
destroy.delete = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::destroy
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
    const destroyForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::destroy
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
        destroyForm.delete = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::status
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
export const status = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

status.definition = {
    methods: ["patch"],
    url: '/developer-tools/integrations/{integration}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::status
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
status.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::status
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
status.patch = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::status
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
    const statusForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: status.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::status
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
        statusForm.patch = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: status.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    status.form = statusForm
const integrations = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
status: Object.assign(status, status),
}

export default integrations