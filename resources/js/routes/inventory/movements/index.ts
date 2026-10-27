import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
export const store = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventory/items/{item}/movements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
store.url = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
store.post = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
    const storeForm = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::store
 * @see app/Http/Controllers/InventoryProcurementController.php:52
 * @route '/inventory/items/{item}/movements'
 */
        storeForm.post = (args: { item: string | number } | [item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const movements = {
    store: Object.assign(store, store),
}

export default movements