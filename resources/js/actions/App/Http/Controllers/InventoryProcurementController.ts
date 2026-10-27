import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InventoryProcurementController::inventory
 * @see app/Http/Controllers/InventoryProcurementController.php:14
 * @route '/inventory'
 */
export const inventory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: inventory.url(options),
    method: 'get',
})

inventory.definition = {
    methods: ["get","head"],
    url: '/inventory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::inventory
 * @see app/Http/Controllers/InventoryProcurementController.php:14
 * @route '/inventory'
 */
inventory.url = (options?: RouteQueryOptions) => {
    return inventory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::inventory
 * @see app/Http/Controllers/InventoryProcurementController.php:14
 * @route '/inventory'
 */
inventory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: inventory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventoryProcurementController::inventory
 * @see app/Http/Controllers/InventoryProcurementController.php:14
 * @route '/inventory'
 */
inventory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: inventory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::inventory
 * @see app/Http/Controllers/InventoryProcurementController.php:14
 * @route '/inventory'
 */
    const inventoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: inventory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::inventory
 * @see app/Http/Controllers/InventoryProcurementController.php:14
 * @route '/inventory'
 */
        inventoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: inventory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventoryProcurementController::inventory
 * @see app/Http/Controllers/InventoryProcurementController.php:14
 * @route '/inventory'
 */
        inventoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: inventory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    inventory.form = inventoryForm
/**
* @see \App\Http\Controllers\InventoryProcurementController::storeItem
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
export const storeItem = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(options),
    method: 'post',
})

storeItem.definition = {
    methods: ["post"],
    url: '/inventory/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::storeItem
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
storeItem.url = (options?: RouteQueryOptions) => {
    return storeItem.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::storeItem
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
storeItem.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::storeItem
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
    const storeItemForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeItem.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::storeItem
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
        storeItemForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeItem.url(options),
            method: 'post',
        })
    
    storeItem.form = storeItemForm
/**
* @see \App\Http\Controllers\InventoryProcurementController::adjustStock
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
export const adjustStock = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjustStock.url(args, options),
    method: 'post',
})

adjustStock.definition = {
    methods: ["post"],
    url: '/inventory/items/{item}/movements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::adjustStock
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
adjustStock.url = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        item: args.item,
                }

    return adjustStock.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::adjustStock
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
adjustStock.post = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjustStock.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::adjustStock
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
    const adjustStockForm = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: adjustStock.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::adjustStock
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
        adjustStockForm.post = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: adjustStock.url(args, options),
            method: 'post',
        })
    
    adjustStock.form = adjustStockForm
/**
* @see \App\Http\Controllers\InventoryProcurementController::procurement
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
export const procurement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: procurement.url(options),
    method: 'get',
})

procurement.definition = {
    methods: ["get","head"],
    url: '/procurement',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::procurement
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
procurement.url = (options?: RouteQueryOptions) => {
    return procurement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::procurement
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
procurement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: procurement.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventoryProcurementController::procurement
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
procurement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: procurement.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::procurement
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
    const procurementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: procurement.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::procurement
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
        procurementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: procurement.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventoryProcurementController::procurement
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
        procurementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: procurement.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    procurement.form = procurementForm
/**
* @see \App\Http\Controllers\InventoryProcurementController::storeRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
export const storeRequest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRequest.url(options),
    method: 'post',
})

storeRequest.definition = {
    methods: ["post"],
    url: '/procurement/requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::storeRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
storeRequest.url = (options?: RouteQueryOptions) => {
    return storeRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::storeRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
storeRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRequest.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::storeRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
    const storeRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeRequest.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::storeRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:83
 * @route '/procurement/requests'
 */
        storeRequestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeRequest.url(options),
            method: 'post',
        })
    
    storeRequest.form = storeRequestForm
/**
* @see \App\Http\Controllers\InventoryProcurementController::reviewRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
export const reviewRequest = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reviewRequest.url(args, options),
    method: 'post',
})

reviewRequest.definition = {
    methods: ["post"],
    url: '/procurement/requests/{procurementRequest}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::reviewRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
reviewRequest.url = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return reviewRequest.definition.url
            .replace('{procurementRequest}', parsedArgs.procurementRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::reviewRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
reviewRequest.post = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reviewRequest.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::reviewRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
    const reviewRequestForm = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reviewRequest.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::reviewRequest
 * @see app/Http/Controllers/InventoryProcurementController.php:92
 * @route '/procurement/requests/{procurementRequest}/review'
 */
        reviewRequestForm.post = (args: { procurementRequest: string | number } | [procurementRequest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reviewRequest.url(args, options),
            method: 'post',
        })
    
    reviewRequest.form = reviewRequestForm
const InventoryProcurementController = { inventory, storeItem, adjustStock, procurement, storeRequest, reviewRequest }

export default InventoryProcurementController