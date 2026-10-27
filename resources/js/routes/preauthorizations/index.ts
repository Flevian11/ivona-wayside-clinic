import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:1079
 * @route '/preauthorizations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/preauthorizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:1079
 * @route '/preauthorizations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:1079
 * @route '/preauthorizations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:1079
 * @route '/preauthorizations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:1079
 * @route '/preauthorizations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:1079
 * @route '/preauthorizations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:1079
 * @route '/preauthorizations'
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
const preauthorizations = {
    index: Object.assign(index, index),
}

export default preauthorizations