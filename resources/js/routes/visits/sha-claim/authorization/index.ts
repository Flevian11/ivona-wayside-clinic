import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::start
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/visits/{encounter}/sha-claim/authorization/start'
 */
export const start = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/sha-claim/authorization/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::start
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/visits/{encounter}/sha-claim/authorization/start'
 */
start.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return start.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::start
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/visits/{encounter}/sha-claim/authorization/start'
 */
start.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::start
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/visits/{encounter}/sha-claim/authorization/start'
 */
    const startForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: start.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::start
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/visits/{encounter}/sha-claim/authorization/start'
 */
        startForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: start.url(args, options),
            method: 'post',
        })
    
    start.form = startForm