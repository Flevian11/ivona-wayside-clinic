import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
export const version = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: version.url(options),
    method: 'get',
})

version.definition = {
    methods: ["get","head"],
    url: '/api/system/version',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
version.url = (options?: RouteQueryOptions) => {
    return version.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
version.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: version.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
version.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: version.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
    const versionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: version.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
        versionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: version.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
        versionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: version.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    version.form = versionForm
const system = {
    version: Object.assign(version, version),
}

export default system