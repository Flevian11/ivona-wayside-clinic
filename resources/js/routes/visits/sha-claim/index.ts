import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::authorization
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/sha-claim/authorization'
 */
export const authorization = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authorization.url(args, options),
    method: 'post',
})

authorization.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/sha-claim/authorization',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::authorization
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/sha-claim/authorization'
 */
authorization.url = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { encounter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    encounter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        encounter: args.encounter,
                }

    return authorization.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::authorization
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/sha-claim/authorization'
 */
authorization.post = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authorization.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::authorization
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/sha-claim/authorization'
 */
    const authorizationForm = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: authorization.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::authorization
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/sha-claim/authorization'
 */
        authorizationForm.post = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: authorization.url(args, options),
            method: 'post',
        })
    
    authorization.form = authorizationForm
/**
* @see \App\Http\Controllers\PatientOperationsController::submit
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/claim'
 */
export const submit = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/claim',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::submit
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/claim'
 */
submit.url = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { encounter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    encounter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        encounter: args.encounter,
                }

    return submit.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::submit
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/claim'
 */
submit.post = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::submit
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/claim'
 */
    const submitForm = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::submit
 * @see app/Http/Controllers/PatientOperationsController.php:0
 * @route '/visits/{encounter}/claim'
 */
        submitForm.post = (args: { encounter: string | number } | [encounter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(args, options),
            method: 'post',
        })
    
    submit.form = submitForm
const shaClaim = {
    authorization: Object.assign(authorization, authorization),
submit: Object.assign(submit, submit),
}

export default shaClaim