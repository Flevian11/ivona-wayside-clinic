import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ShaClaimsController::index
 * @see app/Http/Controllers/ShaClaimsController.php:13
 * @route '/operations/sha-claims'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/operations/sha-claims',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ShaClaimsController::index
 * @see app/Http/Controllers/ShaClaimsController.php:13
 * @route '/operations/sha-claims'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShaClaimsController::index
 * @see app/Http/Controllers/ShaClaimsController.php:13
 * @route '/operations/sha-claims'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ShaClaimsController::index
 * @see app/Http/Controllers/ShaClaimsController.php:13
 * @route '/operations/sha-claims'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ShaClaimsController::index
 * @see app/Http/Controllers/ShaClaimsController.php:13
 * @route '/operations/sha-claims'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ShaClaimsController::index
 * @see app/Http/Controllers/ShaClaimsController.php:13
 * @route '/operations/sha-claims'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ShaClaimsController::index
 * @see app/Http/Controllers/ShaClaimsController.php:13
 * @route '/operations/sha-claims'
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
const shaClaims = {
    index: Object.assign(index, index),
}

export default shaClaims