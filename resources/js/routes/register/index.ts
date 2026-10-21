import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
export const disabled = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disabled.url(options),
    method: 'get',
})

disabled.definition = {
    methods: ["get","head","post","put","patch","delete","options","query"],
    url: '/register',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options","query"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.url = (options?: RouteQueryOptions) => {
    return disabled.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disabled.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: disabled.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disabled.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: disabled.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: disabled.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disabled.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: disabled.url(options),
    method: 'options',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
disabled.query = (options?: RouteQueryOptions): RouteDefinition<'query'> => ({
    url: disabled.url(options),
    method: 'query',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
    const disabledForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: disabled.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
        disabledForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disabled.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
        disabledForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disabled.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
        disabledForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disabled.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
        disabledForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disabled.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
        disabledForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disabled.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
        disabledForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disabled.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
        disabledForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disabled.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/register'
 */
        disabledForm.query = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disabled.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'QUERY',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    disabled.form = disabledForm
const register = {
    disabled: Object.assign(disabled, disabled),
}

export default register