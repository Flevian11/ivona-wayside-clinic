import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:16
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
 * @see app/Http/Controllers/PatientOperationsController.php:16
 * @route '/visits'
 */
visits.url = (options?: RouteQueryOptions) => {
    return visits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:16
 * @route '/visits'
 */
visits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visits.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:16
 * @route '/visits'
 */
visits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: visits.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:16
 * @route '/visits'
 */
    const visitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: visits.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:16
 * @route '/visits'
 */
        visitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: visits.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:16
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
 * @see app/Http/Controllers/PatientOperationsController.php:63
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
 * @see app/Http/Controllers/PatientOperationsController.php:63
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
 * @see app/Http/Controllers/PatientOperationsController.php:63
 * @route '/visits/{encounter}'
 */
showVisit.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVisit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:63
 * @route '/visits/{encounter}'
 */
showVisit.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showVisit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:63
 * @route '/visits/{encounter}'
 */
    const showVisitForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showVisit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:63
 * @route '/visits/{encounter}'
 */
        showVisitForm.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showVisit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:63
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
* @see \App\Http\Controllers\PatientOperationsController::refreshVisitBenefits
 * @see app/Http/Controllers/PatientOperationsController.php:120
 * @route '/visits/{encounter}/benefits/refresh'
 */
export const refreshVisitBenefits = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refreshVisitBenefits.url(args, options),
    method: 'post',
})

refreshVisitBenefits.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/benefits/refresh',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::refreshVisitBenefits
 * @see app/Http/Controllers/PatientOperationsController.php:120
 * @route '/visits/{encounter}/benefits/refresh'
 */
refreshVisitBenefits.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return refreshVisitBenefits.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::refreshVisitBenefits
 * @see app/Http/Controllers/PatientOperationsController.php:120
 * @route '/visits/{encounter}/benefits/refresh'
 */
refreshVisitBenefits.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refreshVisitBenefits.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::refreshVisitBenefits
 * @see app/Http/Controllers/PatientOperationsController.php:120
 * @route '/visits/{encounter}/benefits/refresh'
 */
    const refreshVisitBenefitsForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: refreshVisitBenefits.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::refreshVisitBenefits
 * @see app/Http/Controllers/PatientOperationsController.php:120
 * @route '/visits/{encounter}/benefits/refresh'
 */
        refreshVisitBenefitsForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: refreshVisitBenefits.url(args, options),
            method: 'post',
        })
    
    refreshVisitBenefits.form = refreshVisitBenefitsForm
/**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:151
 * @route '/visits/{encounter}/invoice.pdf'
 */
export const downloadInvoice = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadInvoice.url(args, options),
    method: 'get',
})

downloadInvoice.definition = {
    methods: ["get","head"],
    url: '/visits/{encounter}/invoice.pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:151
 * @route '/visits/{encounter}/invoice.pdf'
 */
downloadInvoice.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return downloadInvoice.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:151
 * @route '/visits/{encounter}/invoice.pdf'
 */
downloadInvoice.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadInvoice.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:151
 * @route '/visits/{encounter}/invoice.pdf'
 */
downloadInvoice.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadInvoice.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:151
 * @route '/visits/{encounter}/invoice.pdf'
 */
    const downloadInvoiceForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadInvoice.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:151
 * @route '/visits/{encounter}/invoice.pdf'
 */
        downloadInvoiceForm.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadInvoice.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:151
 * @route '/visits/{encounter}/invoice.pdf'
 */
        downloadInvoiceForm.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadInvoice.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadInvoice.form = downloadInvoiceForm
/**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:258
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
 * @see app/Http/Controllers/PatientOperationsController.php:258
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
 * @see app/Http/Controllers/PatientOperationsController.php:258
 * @route '/visits/{encounter}/complete'
 */
completeVisit.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeVisit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:258
 * @route '/visits/{encounter}/complete'
 */
    const completeVisitForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: completeVisit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:258
 * @route '/visits/{encounter}/complete'
 */
        completeVisitForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: completeVisit.url(args, options),
            method: 'post',
        })
    
    completeVisit.form = completeVisitForm
/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:267
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
 * @see app/Http/Controllers/PatientOperationsController.php:267
 * @route '/preauthorizations'
 */
preauthorizations.url = (options?: RouteQueryOptions) => {
    return preauthorizations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:267
 * @route '/preauthorizations'
 */
preauthorizations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preauthorizations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:267
 * @route '/preauthorizations'
 */
preauthorizations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preauthorizations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:267
 * @route '/preauthorizations'
 */
    const preauthorizationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preauthorizations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:267
 * @route '/preauthorizations'
 */
        preauthorizationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preauthorizations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:267
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
const PatientOperationsController = { visits, showVisit, refreshVisitBenefits, downloadInvoice, completeVisit, preauthorizations }

export default PatientOperationsController