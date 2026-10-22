import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
const ReleaseChangelogController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReleaseChangelogController.url(options),
    method: 'get',
})

ReleaseChangelogController.definition = {
    methods: ["get","head"],
    url: '/releases/changelog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
ReleaseChangelogController.url = (options?: RouteQueryOptions) => {
    return ReleaseChangelogController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
ReleaseChangelogController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReleaseChangelogController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
ReleaseChangelogController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ReleaseChangelogController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
    const ReleaseChangelogControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ReleaseChangelogController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
        ReleaseChangelogControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReleaseChangelogController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
        ReleaseChangelogControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReleaseChangelogController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ReleaseChangelogController.form = ReleaseChangelogControllerForm
export default ReleaseChangelogController