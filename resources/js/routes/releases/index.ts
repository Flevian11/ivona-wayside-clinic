import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
export const changelog = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: changelog.url(options),
    method: 'get',
})

changelog.definition = {
    methods: ["get","head"],
    url: '/releases/changelog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
changelog.url = (options?: RouteQueryOptions) => {
    return changelog.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
changelog.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: changelog.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
changelog.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: changelog.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
    const changelogForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: changelog.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
        changelogForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: changelog.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReleaseChangelogController::__invoke
 * @see app/Http/Controllers/ReleaseChangelogController.php:11
 * @route '/releases/changelog'
 */
        changelogForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: changelog.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    changelog.form = changelogForm
const releases = {
    changelog: Object.assign(changelog, changelog),
}

export default releases