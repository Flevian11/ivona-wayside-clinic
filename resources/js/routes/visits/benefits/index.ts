import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::refresh
 * @see app/Http/Controllers/PatientOperationsController.php:383
 * @route '/visits/{encounter}/benefits/refresh'
 */
export const refresh = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refresh.url(args, options),
    method: 'post',
})

refresh.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/benefits/refresh',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::refresh
 * @see app/Http/Controllers/PatientOperationsController.php:383
 * @route '/visits/{encounter}/benefits/refresh'
 */
refresh.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { encounter: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { encounter: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    encounter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        encounter: typeof args.encounter === 'object'
                ? args.encounter.id
                : args.encounter,
                }

    return refresh.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::refresh
 * @see app/Http/Controllers/PatientOperationsController.php:383
 * @route '/visits/{encounter}/benefits/refresh'
 */
refresh.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refresh.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::refresh
 * @see app/Http/Controllers/PatientOperationsController.php:383
 * @route '/visits/{encounter}/benefits/refresh'
 */
    const refreshForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: refresh.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::refresh
 * @see app/Http/Controllers/PatientOperationsController.php:383
 * @route '/visits/{encounter}/benefits/refresh'
 */
        refreshForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: refresh.url(args, options),
            method: 'post',
        })
    
    refresh.form = refreshForm
const benefits = {
    refresh: Object.assign(refresh, refresh),
}

export default benefits