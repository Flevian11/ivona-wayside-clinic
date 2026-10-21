import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
const SystemVersionController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SystemVersionController.url(options),
    method: 'get',
})

SystemVersionController.definition = {
    methods: ["get","head"],
    url: '/api/system/version',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
SystemVersionController.url = (options?: RouteQueryOptions) => {
    return SystemVersionController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
SystemVersionController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SystemVersionController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
SystemVersionController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SystemVersionController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
    const SystemVersionControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: SystemVersionController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
        SystemVersionControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: SystemVersionController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\SystemVersionController::__invoke
 * @see app/Http/Controllers/Api/SystemVersionController.php:12
 * @route '/api/system/version'
 */
        SystemVersionControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: SystemVersionController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    SystemVersionController.form = SystemVersionControllerForm
export default SystemVersionController