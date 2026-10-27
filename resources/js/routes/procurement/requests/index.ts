import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/procurement/requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\InventoryProcurementController::review
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
export const review = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/procurement/requests/{procurementRequest}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::review
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
review.url = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { procurementRequest: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    procurementRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        procurementRequest: args.procurementRequest,
                }

    return review.definition.url
            .replace('{procurementRequest}', parsedArgs.procurementRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::review
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
review.post = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::review
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
    const reviewForm = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: review.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::review
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
        reviewForm.post = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: review.url(args, options),
            method: 'post',
        })
    
    review.form = reviewForm
const requests = {
    store: Object.assign(store, store),
review: Object.assign(review, review),
}

export default requests