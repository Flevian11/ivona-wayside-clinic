import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pharmacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
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
const pharmacy = {
    index: Object.assign(index, index),
}

export default pharmacy