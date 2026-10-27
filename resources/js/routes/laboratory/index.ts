import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/laboratory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClinicalOperationsController::index
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
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
const laboratory = {
    index: Object.assign(index, index),
}

export default laboratory