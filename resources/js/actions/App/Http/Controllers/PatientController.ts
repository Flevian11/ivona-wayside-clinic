import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:22
 * @route '/patients'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/patients',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:22
 * @route '/patients'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:22
 * @route '/patients'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:22
 * @route '/patients'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:22
 * @route '/patients'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:22
 * @route '/patients'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:22
 * @route '/patients'
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
/**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:179
 * @route '/patients/sha-lookup'
 */
export const lookupShaIdentifier = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lookupShaIdentifier.url(options),
    method: 'post',
})

lookupShaIdentifier.definition = {
    methods: ["post"],
    url: '/patients/sha-lookup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:179
 * @route '/patients/sha-lookup'
 */
lookupShaIdentifier.url = (options?: RouteQueryOptions) => {
    return lookupShaIdentifier.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:179
 * @route '/patients/sha-lookup'
 */
lookupShaIdentifier.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lookupShaIdentifier.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:179
 * @route '/patients/sha-lookup'
 */
    const lookupShaIdentifierForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: lookupShaIdentifier.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:179
 * @route '/patients/sha-lookup'
 */
        lookupShaIdentifierForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: lookupShaIdentifier.url(options),
            method: 'post',
        })
    
    lookupShaIdentifier.form = lookupShaIdentifierForm
/**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:37
 * @route '/patients/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/patients/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:37
 * @route '/patients/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:37
 * @route '/patients/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:37
 * @route '/patients/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:37
 * @route '/patients/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:37
 * @route '/patients/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:37
 * @route '/patients/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\PatientController::store
 * @see app/Http/Controllers/PatientController.php:45
 * @route '/patients'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/patients',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::store
 * @see app/Http/Controllers/PatientController.php:45
 * @route '/patients'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::store
 * @see app/Http/Controllers/PatientController.php:45
 * @route '/patients'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::store
 * @see app/Http/Controllers/PatientController.php:45
 * @route '/patients'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::store
 * @see app/Http/Controllers/PatientController.php:45
 * @route '/patients'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:147
 * @route '/patients/{patient}'
 */
export const show = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/patients/{patient}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:147
 * @route '/patients/{patient}'
 */
show.url = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { patient: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { patient: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    patient: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        patient: typeof args.patient === 'object'
                ? args.patient.id
                : args.patient,
                }

    return show.definition.url
            .replace('{patient}', parsedArgs.patient.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:147
 * @route '/patients/{patient}'
 */
show.get = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:147
 * @route '/patients/{patient}'
 */
show.head = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:147
 * @route '/patients/{patient}'
 */
    const showForm = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:147
 * @route '/patients/{patient}'
 */
        showForm.get = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:147
 * @route '/patients/{patient}'
 */
        showForm.head = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\PatientController::createVisit
 * @see app/Http/Controllers/PatientController.php:167
 * @route '/patients/{patient}/encounters'
 */
export const createVisit = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createVisit.url(args, options),
    method: 'post',
})

createVisit.definition = {
    methods: ["post"],
    url: '/patients/{patient}/encounters',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::createVisit
 * @see app/Http/Controllers/PatientController.php:167
 * @route '/patients/{patient}/encounters'
 */
createVisit.url = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { patient: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { patient: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    patient: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        patient: typeof args.patient === 'object'
                ? args.patient.id
                : args.patient,
                }

    return createVisit.definition.url
            .replace('{patient}', parsedArgs.patient.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::createVisit
 * @see app/Http/Controllers/PatientController.php:167
 * @route '/patients/{patient}/encounters'
 */
createVisit.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createVisit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::createVisit
 * @see app/Http/Controllers/PatientController.php:167
 * @route '/patients/{patient}/encounters'
 */
    const createVisitForm = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createVisit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::createVisit
 * @see app/Http/Controllers/PatientController.php:167
 * @route '/patients/{patient}/encounters'
 */
        createVisitForm.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createVisit.url(args, options),
            method: 'post',
        })
    
    createVisit.form = createVisitForm
/**
* @see \App\Http\Controllers\PatientController::shaEligibility
 * @see app/Http/Controllers/PatientController.php:210
 * @route '/patients/{patient}/sha-eligibility'
 */
export const shaEligibility = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shaEligibility.url(args, options),
    method: 'post',
})

shaEligibility.definition = {
    methods: ["post"],
    url: '/patients/{patient}/sha-eligibility',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::shaEligibility
 * @see app/Http/Controllers/PatientController.php:210
 * @route '/patients/{patient}/sha-eligibility'
 */
shaEligibility.url = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { patient: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { patient: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    patient: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        patient: typeof args.patient === 'object'
                ? args.patient.id
                : args.patient,
                }

    return shaEligibility.definition.url
            .replace('{patient}', parsedArgs.patient.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::shaEligibility
 * @see app/Http/Controllers/PatientController.php:210
 * @route '/patients/{patient}/sha-eligibility'
 */
shaEligibility.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shaEligibility.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::shaEligibility
 * @see app/Http/Controllers/PatientController.php:210
 * @route '/patients/{patient}/sha-eligibility'
 */
    const shaEligibilityForm = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: shaEligibility.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::shaEligibility
 * @see app/Http/Controllers/PatientController.php:210
 * @route '/patients/{patient}/sha-eligibility'
 */
        shaEligibilityForm.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: shaEligibility.url(args, options),
            method: 'post',
        })
    
    shaEligibility.form = shaEligibilityForm
const PatientController = { index, lookupShaIdentifier, create, store, show, createVisit, shaEligibility }

export default PatientController