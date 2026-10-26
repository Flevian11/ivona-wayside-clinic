import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:23
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
 * @see app/Http/Controllers/PatientController.php:23
 * @route '/patients'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:23
 * @route '/patients'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:23
 * @route '/patients'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:23
 * @route '/patients'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:23
 * @route '/patients'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientController::index
 * @see app/Http/Controllers/PatientController.php:23
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
* @see \App\Http\Controllers\PatientController::duplicateCheck
 * @see app/Http/Controllers/PatientController.php:44
 * @route '/patients/duplicate-check'
 */
export const duplicateCheck = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicateCheck.url(options),
    method: 'post',
})

duplicateCheck.definition = {
    methods: ["post"],
    url: '/patients/duplicate-check',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::duplicateCheck
 * @see app/Http/Controllers/PatientController.php:44
 * @route '/patients/duplicate-check'
 */
duplicateCheck.url = (options?: RouteQueryOptions) => {
    return duplicateCheck.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::duplicateCheck
 * @see app/Http/Controllers/PatientController.php:44
 * @route '/patients/duplicate-check'
 */
duplicateCheck.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicateCheck.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::duplicateCheck
 * @see app/Http/Controllers/PatientController.php:44
 * @route '/patients/duplicate-check'
 */
    const duplicateCheckForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: duplicateCheck.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::duplicateCheck
 * @see app/Http/Controllers/PatientController.php:44
 * @route '/patients/duplicate-check'
 */
        duplicateCheckForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: duplicateCheck.url(options),
            method: 'post',
        })
    
    duplicateCheck.form = duplicateCheckForm
/**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:731
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
 * @see app/Http/Controllers/PatientController.php:731
 * @route '/patients/sha-lookup'
 */
lookupShaIdentifier.url = (options?: RouteQueryOptions) => {
    return lookupShaIdentifier.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:731
 * @route '/patients/sha-lookup'
 */
lookupShaIdentifier.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lookupShaIdentifier.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:731
 * @route '/patients/sha-lookup'
 */
    const lookupShaIdentifierForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: lookupShaIdentifier.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::lookupShaIdentifier
 * @see app/Http/Controllers/PatientController.php:731
 * @route '/patients/sha-lookup'
 */
        lookupShaIdentifierForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: lookupShaIdentifier.url(options),
            method: 'post',
        })
    
    lookupShaIdentifier.form = lookupShaIdentifierForm
/**
* @see \App\Http\Controllers\PatientController::shaBenefits
 * @see app/Http/Controllers/PatientController.php:784
 * @route '/patients/sha-benefits'
 */
export const shaBenefits = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shaBenefits.url(options),
    method: 'post',
})

shaBenefits.definition = {
    methods: ["post"],
    url: '/patients/sha-benefits',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::shaBenefits
 * @see app/Http/Controllers/PatientController.php:784
 * @route '/patients/sha-benefits'
 */
shaBenefits.url = (options?: RouteQueryOptions) => {
    return shaBenefits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::shaBenefits
 * @see app/Http/Controllers/PatientController.php:784
 * @route '/patients/sha-benefits'
 */
shaBenefits.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shaBenefits.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::shaBenefits
 * @see app/Http/Controllers/PatientController.php:784
 * @route '/patients/sha-benefits'
 */
    const shaBenefitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: shaBenefits.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::shaBenefits
 * @see app/Http/Controllers/PatientController.php:784
 * @route '/patients/sha-benefits'
 */
        shaBenefitsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: shaBenefits.url(options),
            method: 'post',
        })
    
    shaBenefits.form = shaBenefitsForm
/**
* @see \App\Http\Controllers\PatientController::shaPreauthorizationCheck
 * @see app/Http/Controllers/PatientController.php:823
 * @route '/patients/sha-preauthorization-check'
 */
export const shaPreauthorizationCheck = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shaPreauthorizationCheck.url(options),
    method: 'post',
})

shaPreauthorizationCheck.definition = {
    methods: ["post"],
    url: '/patients/sha-preauthorization-check',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::shaPreauthorizationCheck
 * @see app/Http/Controllers/PatientController.php:823
 * @route '/patients/sha-preauthorization-check'
 */
shaPreauthorizationCheck.url = (options?: RouteQueryOptions) => {
    return shaPreauthorizationCheck.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::shaPreauthorizationCheck
 * @see app/Http/Controllers/PatientController.php:823
 * @route '/patients/sha-preauthorization-check'
 */
shaPreauthorizationCheck.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shaPreauthorizationCheck.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::shaPreauthorizationCheck
 * @see app/Http/Controllers/PatientController.php:823
 * @route '/patients/sha-preauthorization-check'
 */
    const shaPreauthorizationCheckForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: shaPreauthorizationCheck.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::shaPreauthorizationCheck
 * @see app/Http/Controllers/PatientController.php:823
 * @route '/patients/sha-preauthorization-check'
 */
        shaPreauthorizationCheckForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: shaPreauthorizationCheck.url(options),
            method: 'post',
        })
    
    shaPreauthorizationCheck.form = shaPreauthorizationCheckForm
/**
* @see \App\Http\Controllers\PatientController::startPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
export const startPrincipalAuthorization = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startPrincipalAuthorization.url(options),
    method: 'post',
})

startPrincipalAuthorization.definition = {
    methods: ["post"],
    url: '/patients/principal-authorization/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::startPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
startPrincipalAuthorization.url = (options?: RouteQueryOptions) => {
    return startPrincipalAuthorization.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::startPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
startPrincipalAuthorization.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startPrincipalAuthorization.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::startPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
    const startPrincipalAuthorizationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: startPrincipalAuthorization.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::startPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
        startPrincipalAuthorizationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: startPrincipalAuthorization.url(options),
            method: 'post',
        })
    
    startPrincipalAuthorization.form = startPrincipalAuthorizationForm
/**
* @see \App\Http\Controllers\PatientController::verifyPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
export const verifyPrincipalAuthorization = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPrincipalAuthorization.url(options),
    method: 'post',
})

verifyPrincipalAuthorization.definition = {
    methods: ["post"],
    url: '/patients/principal-authorization/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::verifyPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
verifyPrincipalAuthorization.url = (options?: RouteQueryOptions) => {
    return verifyPrincipalAuthorization.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::verifyPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
verifyPrincipalAuthorization.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPrincipalAuthorization.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::verifyPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
    const verifyPrincipalAuthorizationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyPrincipalAuthorization.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::verifyPrincipalAuthorization
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
        verifyPrincipalAuthorizationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyPrincipalAuthorization.url(options),
            method: 'post',
        })
    
    verifyPrincipalAuthorization.form = verifyPrincipalAuthorizationForm
/**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:93
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
 * @see app/Http/Controllers/PatientController.php:93
 * @route '/patients/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:93
 * @route '/patients/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:93
 * @route '/patients/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:93
 * @route '/patients/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:93
 * @route '/patients/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientController::create
 * @see app/Http/Controllers/PatientController.php:93
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
 * @see app/Http/Controllers/PatientController.php:101
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
 * @see app/Http/Controllers/PatientController.php:101
 * @route '/patients'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::store
 * @see app/Http/Controllers/PatientController.php:101
 * @route '/patients'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::store
 * @see app/Http/Controllers/PatientController.php:101
 * @route '/patients'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::store
 * @see app/Http/Controllers/PatientController.php:101
 * @route '/patients'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PatientController::update
 * @see app/Http/Controllers/PatientController.php:489
 * @route '/patients/{patient}'
 */
export const update = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/patients/{patient}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PatientController::update
 * @see app/Http/Controllers/PatientController.php:489
 * @route '/patients/{patient}'
 */
update.url = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{patient}', parsedArgs.patient.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::update
 * @see app/Http/Controllers/PatientController.php:489
 * @route '/patients/{patient}'
 */
update.patch = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PatientController::update
 * @see app/Http/Controllers/PatientController.php:489
 * @route '/patients/{patient}'
 */
    const updateForm = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::update
 * @see app/Http/Controllers/PatientController.php:489
 * @route '/patients/{patient}'
 */
        updateForm.patch = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PatientController::recordConsent
 * @see app/Http/Controllers/PatientController.php:512
 * @route '/patients/{patient}/consents'
 */
export const recordConsent = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordConsent.url(args, options),
    method: 'post',
})

recordConsent.definition = {
    methods: ["post"],
    url: '/patients/{patient}/consents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::recordConsent
 * @see app/Http/Controllers/PatientController.php:512
 * @route '/patients/{patient}/consents'
 */
recordConsent.url = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return recordConsent.definition.url
            .replace('{patient}', parsedArgs.patient.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::recordConsent
 * @see app/Http/Controllers/PatientController.php:512
 * @route '/patients/{patient}/consents'
 */
recordConsent.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordConsent.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::recordConsent
 * @see app/Http/Controllers/PatientController.php:512
 * @route '/patients/{patient}/consents'
 */
    const recordConsentForm = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recordConsent.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::recordConsent
 * @see app/Http/Controllers/PatientController.php:512
 * @route '/patients/{patient}/consents'
 */
        recordConsentForm.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recordConsent.url(args, options),
            method: 'post',
        })
    
    recordConsent.form = recordConsentForm
/**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:422
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
 * @see app/Http/Controllers/PatientController.php:422
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
 * @see app/Http/Controllers/PatientController.php:422
 * @route '/patients/{patient}'
 */
show.get = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:422
 * @route '/patients/{patient}'
 */
show.head = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:422
 * @route '/patients/{patient}'
 */
    const showForm = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:422
 * @route '/patients/{patient}'
 */
        showForm.get = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientController::show
 * @see app/Http/Controllers/PatientController.php:422
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
 * @see app/Http/Controllers/PatientController.php:533
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
 * @see app/Http/Controllers/PatientController.php:533
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
 * @see app/Http/Controllers/PatientController.php:533
 * @route '/patients/{patient}/encounters'
 */
createVisit.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createVisit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::createVisit
 * @see app/Http/Controllers/PatientController.php:533
 * @route '/patients/{patient}/encounters'
 */
    const createVisitForm = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createVisit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::createVisit
 * @see app/Http/Controllers/PatientController.php:533
 * @route '/patients/{patient}/encounters'
 */
        createVisitForm.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createVisit.url(args, options),
            method: 'post',
        })
    
    createVisit.form = createVisitForm
/**
* @see \App\Http\Controllers\PatientController::shaEligibility
 * @see app/Http/Controllers/PatientController.php:856
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
 * @see app/Http/Controllers/PatientController.php:856
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
 * @see app/Http/Controllers/PatientController.php:856
 * @route '/patients/{patient}/sha-eligibility'
 */
shaEligibility.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shaEligibility.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::shaEligibility
 * @see app/Http/Controllers/PatientController.php:856
 * @route '/patients/{patient}/sha-eligibility'
 */
    const shaEligibilityForm = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: shaEligibility.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::shaEligibility
 * @see app/Http/Controllers/PatientController.php:856
 * @route '/patients/{patient}/sha-eligibility'
 */
        shaEligibilityForm.post = (args: { patient: number | { id: number } } | [patient: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: shaEligibility.url(args, options),
            method: 'post',
        })
    
    shaEligibility.form = shaEligibilityForm
const PatientController = { index, duplicateCheck, lookupShaIdentifier, shaBenefits, shaPreauthorizationCheck, startPrincipalAuthorization, verifyPrincipalAuthorization, create, store, update, recordConsent, show, createVisit, shaEligibility }

export default PatientController