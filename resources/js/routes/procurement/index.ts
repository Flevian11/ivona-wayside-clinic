import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import requests from './requests'
/**
* @see \App\Http\Controllers\InventoryProcurementController::index
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/procurement',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventoryProcurementController::index
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventoryProcurementController::index
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventoryProcurementController::index
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventoryProcurementController::index
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventoryProcurementController::index
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventoryProcurementController::index
 * @see app/Http/Controllers/InventoryProcurementController.php:66
 * @route '/procurement'
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
const procurement = {
    index: Object.assign(index, index),
requests: Object.assign(requests, requests),
}

export default procurement