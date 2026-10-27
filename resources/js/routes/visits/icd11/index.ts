import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::search
 * @see app/Http/Controllers/PatientOperationsController.php:300
 * @route '/visits/icd11/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/visits/icd11/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::search
 * @see app/Http/Controllers/PatientOperationsController.php:300
 * @route '/visits/icd11/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::search
 * @see app/Http/Controllers/PatientOperationsController.php:300
 * @route '/visits/icd11/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::search
 * @see app/Http/Controllers/PatientOperationsController.php:300
 * @route '/visits/icd11/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::search
 * @see app/Http/Controllers/PatientOperationsController.php:300
 * @route '/visits/icd11/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::search
 * @see app/Http/Controllers/PatientOperationsController.php:300
 * @route '/visits/icd11/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::search
 * @see app/Http/Controllers/PatientOperationsController.php:300
 * @route '/visits/icd11/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
const icd11 = {
    search: Object.assign(search, search),
}

export default icd11