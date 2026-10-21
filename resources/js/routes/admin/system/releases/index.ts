import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::index
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:16
 * @route '/admin/system/releases'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/system/releases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::index
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:16
 * @route '/admin/system/releases'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::index
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:16
 * @route '/admin/system/releases'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::index
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:16
 * @route '/admin/system/releases'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::index
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:16
 * @route '/admin/system/releases'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::index
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:16
 * @route '/admin/system/releases'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::index
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:16
 * @route '/admin/system/releases'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::store
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:25
 * @route '/admin/system/releases'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/system/releases',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::store
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:25
 * @route '/admin/system/releases'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::store
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:25
 * @route '/admin/system/releases'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::store
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:25
 * @route '/admin/system/releases'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::store
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:25
 * @route '/admin/system/releases'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::show
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:51
 * @route '/admin/system/releases/{systemRelease}'
 */
export const show = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/system/releases/{systemRelease}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::show
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:51
 * @route '/admin/system/releases/{systemRelease}'
 */
show.url = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { systemRelease: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { systemRelease: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    systemRelease: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        systemRelease: typeof args.systemRelease === 'object'
                ? args.systemRelease.id
                : args.systemRelease,
                }

    return show.definition.url
            .replace('{systemRelease}', parsedArgs.systemRelease.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::show
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:51
 * @route '/admin/system/releases/{systemRelease}'
 */
show.get = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::show
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:51
 * @route '/admin/system/releases/{systemRelease}'
 */
show.head = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::show
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:51
 * @route '/admin/system/releases/{systemRelease}'
 */
    const showForm = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::show
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:51
 * @route '/admin/system/releases/{systemRelease}'
 */
        showForm.get = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::show
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:51
 * @route '/admin/system/releases/{systemRelease}'
 */
        showForm.head = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::update
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:56
 * @route '/admin/system/releases/{systemRelease}'
 */
export const update = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/system/releases/{systemRelease}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::update
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:56
 * @route '/admin/system/releases/{systemRelease}'
 */
update.url = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { systemRelease: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { systemRelease: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    systemRelease: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        systemRelease: typeof args.systemRelease === 'object'
                ? args.systemRelease.id
                : args.systemRelease,
                }

    return update.definition.url
            .replace('{systemRelease}', parsedArgs.systemRelease.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::update
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:56
 * @route '/admin/system/releases/{systemRelease}'
 */
update.put = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::update
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:56
 * @route '/admin/system/releases/{systemRelease}'
 */
    const updateForm = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::update
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:56
 * @route '/admin/system/releases/{systemRelease}'
 */
        updateForm.put = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\SystemReleaseController::publish
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:87
 * @route '/admin/system/releases/{systemRelease}/publish'
 */
export const publish = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/admin/system/releases/{systemRelease}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::publish
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:87
 * @route '/admin/system/releases/{systemRelease}/publish'
 */
publish.url = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { systemRelease: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { systemRelease: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    systemRelease: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        systemRelease: typeof args.systemRelease === 'object'
                ? args.systemRelease.id
                : args.systemRelease,
                }

    return publish.definition.url
            .replace('{systemRelease}', parsedArgs.systemRelease.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::publish
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:87
 * @route '/admin/system/releases/{systemRelease}/publish'
 */
publish.post = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::publish
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:87
 * @route '/admin/system/releases/{systemRelease}/publish'
 */
    const publishForm = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::publish
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:87
 * @route '/admin/system/releases/{systemRelease}/publish'
 */
        publishForm.post = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publish.url(args, options),
            method: 'post',
        })
    
    publish.form = publishForm
/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::withdraw
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:121
 * @route '/admin/system/releases/{systemRelease}/withdraw'
 */
export const withdraw = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: withdraw.url(args, options),
    method: 'post',
})

withdraw.definition = {
    methods: ["post"],
    url: '/admin/system/releases/{systemRelease}/withdraw',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::withdraw
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:121
 * @route '/admin/system/releases/{systemRelease}/withdraw'
 */
withdraw.url = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { systemRelease: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { systemRelease: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    systemRelease: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        systemRelease: typeof args.systemRelease === 'object'
                ? args.systemRelease.id
                : args.systemRelease,
                }

    return withdraw.definition.url
            .replace('{systemRelease}', parsedArgs.systemRelease.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemReleaseController::withdraw
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:121
 * @route '/admin/system/releases/{systemRelease}/withdraw'
 */
withdraw.post = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: withdraw.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::withdraw
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:121
 * @route '/admin/system/releases/{systemRelease}/withdraw'
 */
    const withdrawForm = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: withdraw.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SystemReleaseController::withdraw
 * @see app/Http/Controllers/Admin/SystemReleaseController.php:121
 * @route '/admin/system/releases/{systemRelease}/withdraw'
 */
        withdrawForm.post = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: withdraw.url(args, options),
            method: 'post',
        })
    
    withdraw.form = withdrawForm
const releases = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
publish: Object.assign(publish, publish),
withdraw: Object.assign(withdraw, withdraw),
}

export default releases