import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:14
 * @route '/visits'
 */
export const visits = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visits.url(options),
    method: 'get',
})

visits.definition = {
    methods: ["get","head"],
    url: '/visits',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:14
 * @route '/visits'
 */
visits.url = (options?: RouteQueryOptions) => {
    return visits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:14
 * @route '/visits'
 */
visits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visits.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:14
 * @route '/visits'
 */
visits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: visits.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:14
 * @route '/visits'
 */
    const visitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: visits.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:14
 * @route '/visits'
 */
        visitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: visits.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:14
 * @route '/visits'
 */
        visitsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: visits.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    visits.form = visitsForm
/**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:61
 * @route '/visits/{encounter}'
 */
export const showVisit = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVisit.url(args, options),
    method: 'get',
})

showVisit.definition = {
    methods: ["get","head"],
    url: '/visits/{encounter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:61
 * @route '/visits/{encounter}'
 */
showVisit.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return showVisit.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:61
 * @route '/visits/{encounter}'
 */
showVisit.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVisit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:61
 * @route '/visits/{encounter}'
 */
showVisit.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showVisit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:61
 * @route '/visits/{encounter}'
 */
    const showVisitForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showVisit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:61
 * @route '/visits/{encounter}'
 */
        showVisitForm.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showVisit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:61
 * @route '/visits/{encounter}'
 */
        showVisitForm.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showVisit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showVisit.form = showVisitForm
/**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:107
 * @route '/visits/{encounter}/complete'
 */
export const completeVisit = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeVisit.url(args, options),
    method: 'post',
})

completeVisit.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:107
 * @route '/visits/{encounter}/complete'
 */
completeVisit.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return completeVisit.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:107
 * @route '/visits/{encounter}/complete'
 */
completeVisit.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeVisit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:107
 * @route '/visits/{encounter}/complete'
 */
    const completeVisitForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: completeVisit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:107
 * @route '/visits/{encounter}/complete'
 */
        completeVisitForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: completeVisit.url(args, options),
            method: 'post',
        })
    
    completeVisit.form = completeVisitForm
/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:116
 * @route '/preauthorizations'
 */
export const preauthorizations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preauthorizations.url(options),
    method: 'get',
})

preauthorizations.definition = {
    methods: ["get","head"],
    url: '/preauthorizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:116
 * @route '/preauthorizations'
 */
preauthorizations.url = (options?: RouteQueryOptions) => {
    return preauthorizations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:116
 * @route '/preauthorizations'
 */
preauthorizations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preauthorizations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:116
 * @route '/preauthorizations'
 */
preauthorizations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preauthorizations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:116
 * @route '/preauthorizations'
 */
    const preauthorizationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preauthorizations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:116
 * @route '/preauthorizations'
 */
        preauthorizationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preauthorizations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:116
 * @route '/preauthorizations'
 */
        preauthorizationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preauthorizations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preauthorizations.form = preauthorizationsForm
const PatientOperationsController = { visits, showVisit, completeVisit, preauthorizations }

export default PatientOperationsController