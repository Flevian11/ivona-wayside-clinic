import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/developer-tools/api-keys',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::store
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revoke
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
export const revoke = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

revoke.definition = {
    methods: ["delete"],
    url: '/developer-tools/api-keys/{apiKey}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revoke
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
revoke.url = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { apiKey: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { apiKey: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    apiKey: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        apiKey: typeof args.apiKey === 'object'
                ? args.apiKey.id
                : args.apiKey,
                }

    return revoke.definition.url
            .replace('{apiKey}', parsedArgs.apiKey.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revoke
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
revoke.delete = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revoke
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
    const revokeForm = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revoke.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revoke
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
        revokeForm.delete = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revoke.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    revoke.form = revokeForm
const apiKeys = {
    store: Object.assign(store, store),
revoke: Object.assign(revoke, revoke),
}

export default apiKeys