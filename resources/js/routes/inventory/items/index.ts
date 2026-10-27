import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventory/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:36
 * @route '/inventory/items'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const items = {
    store: Object.assign(store, store),
}

export default items