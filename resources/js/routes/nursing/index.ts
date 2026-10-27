import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/nursing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
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
const nursing = {
    index: Object.assign(index, index),
}

export default nursing