import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:20
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
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
visits.url = (options?: RouteQueryOptions) => {
    return visits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
visits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visits.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
visits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: visits.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
    const visitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: visits.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
        visitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: visits.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::visits
 * @see app/Http/Controllers/PatientOperationsController.php:20
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
 * @see app/Http/Controllers/PatientOperationsController.php:71
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
 * @see app/Http/Controllers/PatientOperationsController.php:71
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
 * @see app/Http/Controllers/PatientOperationsController.php:71
 * @route '/visits/{encounter}'
 */
showVisit.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVisit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:71
 * @route '/visits/{encounter}'
 */
showVisit.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showVisit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:71
 * @route '/visits/{encounter}'
 */
    const showVisitForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showVisit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:71
 * @route '/visits/{encounter}'
 */
        showVisitForm.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showVisit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::showVisit
 * @see app/Http/Controllers/PatientOperationsController.php:71
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
* @see \App\Http\Controllers\PatientOperationsController::updateVisit
 * @see app/Http/Controllers/PatientOperationsController.php:161
 * @route '/visits/{encounter}'
 */
export const updateVisit = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateVisit.url(args, options),
    method: 'patch',
})

updateVisit.definition = {
    methods: ["patch"],
    url: '/visits/{encounter}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::updateVisit
 * @see app/Http/Controllers/PatientOperationsController.php:161
 * @route '/visits/{encounter}'
 */
updateVisit.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateVisit.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::updateVisit
 * @see app/Http/Controllers/PatientOperationsController.php:161
 * @route '/visits/{encounter}'
 */
updateVisit.patch = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateVisit.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::updateVisit
 * @see app/Http/Controllers/PatientOperationsController.php:161
 * @route '/visits/{encounter}'
 */
    const updateVisitForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateVisit.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::updateVisit
 * @see app/Http/Controllers/PatientOperationsController.php:161
 * @route '/visits/{encounter}'
 */
        updateVisitForm.patch = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateVisit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateVisit.form = updateVisitForm
/**
* @see \App\Http\Controllers\PatientOperationsController::icd11Search
 * @see app/Http/Controllers/PatientOperationsController.php:290
 * @route '/visits/icd11/search'
 */
export const icd11Search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: icd11Search.url(options),
    method: 'get',
})

icd11Search.definition = {
    methods: ["get","head"],
    url: '/visits/icd11/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::icd11Search
 * @see app/Http/Controllers/PatientOperationsController.php:290
 * @route '/visits/icd11/search'
 */
icd11Search.url = (options?: RouteQueryOptions) => {
    return icd11Search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::icd11Search
 * @see app/Http/Controllers/PatientOperationsController.php:290
 * @route '/visits/icd11/search'
 */
icd11Search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: icd11Search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::icd11Search
 * @see app/Http/Controllers/PatientOperationsController.php:290
 * @route '/visits/icd11/search'
 */
icd11Search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: icd11Search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::icd11Search
 * @see app/Http/Controllers/PatientOperationsController.php:290
 * @route '/visits/icd11/search'
 */
    const icd11SearchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: icd11Search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::icd11Search
 * @see app/Http/Controllers/PatientOperationsController.php:290
 * @route '/visits/icd11/search'
 */
        icd11SearchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: icd11Search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::icd11Search
 * @see app/Http/Controllers/PatientOperationsController.php:290
 * @route '/visits/icd11/search'
 */
        icd11SearchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: icd11Search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    icd11Search.form = icd11SearchForm
/**
* @see \App\Http\Controllers\PatientOperationsController::uploadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:215
 * @route '/visits/{encounter}/documents'
 */
export const uploadDocument = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadDocument.url(args, options),
    method: 'post',
})

uploadDocument.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::uploadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:215
 * @route '/visits/{encounter}/documents'
 */
uploadDocument.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return uploadDocument.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::uploadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:215
 * @route '/visits/{encounter}/documents'
 */
uploadDocument.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadDocument.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::uploadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:215
 * @route '/visits/{encounter}/documents'
 */
    const uploadDocumentForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadDocument.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::uploadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:215
 * @route '/visits/{encounter}/documents'
 */
        uploadDocumentForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadDocument.url(args, options),
            method: 'post',
        })
    
    uploadDocument.form = uploadDocumentForm
/**
* @see \App\Http\Controllers\PatientOperationsController::downloadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:269
 * @route '/visits/{encounter}/documents/{document}'
 */
export const downloadDocument = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})

downloadDocument.definition = {
    methods: ["get","head"],
    url: '/visits/{encounter}/documents/{document}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::downloadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:269
 * @route '/visits/{encounter}/documents/{document}'
 */
downloadDocument.url = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    encounter: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        encounter: typeof args.encounter === 'object'
                ? args.encounter.id
                : args.encounter,
                                document: args.document,
                }

    return downloadDocument.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::downloadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:269
 * @route '/visits/{encounter}/documents/{document}'
 */
downloadDocument.get = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::downloadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:269
 * @route '/visits/{encounter}/documents/{document}'
 */
downloadDocument.head = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadDocument.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::downloadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:269
 * @route '/visits/{encounter}/documents/{document}'
 */
    const downloadDocumentForm = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadDocument.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::downloadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:269
 * @route '/visits/{encounter}/documents/{document}'
 */
        downloadDocumentForm.get = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDocument.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::downloadDocument
 * @see app/Http/Controllers/PatientOperationsController.php:269
 * @route '/visits/{encounter}/documents/{document}'
 */
        downloadDocumentForm.head = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDocument.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadDocument.form = downloadDocumentForm
/**
* @see \App\Http\Controllers\PatientOperationsController::deleteDocument
 * @see app/Http/Controllers/PatientOperationsController.php:247
 * @route '/visits/{encounter}/documents/{document}'
 */
export const deleteDocument = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteDocument.url(args, options),
    method: 'delete',
})

deleteDocument.definition = {
    methods: ["delete"],
    url: '/visits/{encounter}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::deleteDocument
 * @see app/Http/Controllers/PatientOperationsController.php:247
 * @route '/visits/{encounter}/documents/{document}'
 */
deleteDocument.url = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    encounter: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        encounter: typeof args.encounter === 'object'
                ? args.encounter.id
                : args.encounter,
                                document: args.document,
                }

    return deleteDocument.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::deleteDocument
 * @see app/Http/Controllers/PatientOperationsController.php:247
 * @route '/visits/{encounter}/documents/{document}'
 */
deleteDocument.delete = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteDocument.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::deleteDocument
 * @see app/Http/Controllers/PatientOperationsController.php:247
 * @route '/visits/{encounter}/documents/{document}'
 */
    const deleteDocumentForm = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteDocument.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::deleteDocument
 * @see app/Http/Controllers/PatientOperationsController.php:247
 * @route '/visits/{encounter}/documents/{document}'
 */
        deleteDocumentForm.delete = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteDocument.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteDocument.form = deleteDocumentForm
/**
* @see \App\Http\Controllers\PatientOperationsController::refreshVisitBenefits
 * @see app/Http/Controllers/PatientOperationsController.php:383
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
 * @see app/Http/Controllers/PatientOperationsController.php:383
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
 * @see app/Http/Controllers/PatientOperationsController.php:383
 * @route '/visits/{encounter}/benefits/refresh'
 */
refreshVisitBenefits.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refreshVisitBenefits.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::refreshVisitBenefits
 * @see app/Http/Controllers/PatientOperationsController.php:383
 * @route '/visits/{encounter}/benefits/refresh'
 */
    const refreshVisitBenefitsForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: refreshVisitBenefits.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::refreshVisitBenefits
 * @see app/Http/Controllers/PatientOperationsController.php:383
 * @route '/visits/{encounter}/benefits/refresh'
 */
        refreshVisitBenefitsForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: refreshVisitBenefits.url(args, options),
            method: 'post',
        })
    
    refreshVisitBenefits.form = refreshVisitBenefitsForm
/**
* @see \App\Http\Controllers\PatientOperationsController::issueInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:455
 * @route '/visits/{encounter}/invoice/issue'
 */
export const issueInvoice = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issueInvoice.url(args, options),
    method: 'post',
})

issueInvoice.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/invoice/issue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::issueInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:455
 * @route '/visits/{encounter}/invoice/issue'
 */
issueInvoice.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return issueInvoice.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::issueInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:455
 * @route '/visits/{encounter}/invoice/issue'
 */
issueInvoice.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issueInvoice.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::issueInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:455
 * @route '/visits/{encounter}/invoice/issue'
 */
    const issueInvoiceForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: issueInvoice.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::issueInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:455
 * @route '/visits/{encounter}/invoice/issue'
 */
        issueInvoiceForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: issueInvoice.url(args, options),
            method: 'post',
        })
    
    issueInvoice.form = issueInvoiceForm
/**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:514
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
 * @see app/Http/Controllers/PatientOperationsController.php:514
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
 * @see app/Http/Controllers/PatientOperationsController.php:514
 * @route '/visits/{encounter}/invoice.pdf'
 */
downloadInvoice.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadInvoice.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:514
 * @route '/visits/{encounter}/invoice.pdf'
 */
downloadInvoice.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadInvoice.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:514
 * @route '/visits/{encounter}/invoice.pdf'
 */
    const downloadInvoiceForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadInvoice.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:514
 * @route '/visits/{encounter}/invoice.pdf'
 */
        downloadInvoiceForm.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadInvoice.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::downloadInvoice
 * @see app/Http/Controllers/PatientOperationsController.php:514
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
 * @see app/Http/Controllers/PatientOperationsController.php:1053
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
 * @see app/Http/Controllers/PatientOperationsController.php:1053
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
 * @see app/Http/Controllers/PatientOperationsController.php:1053
 * @route '/visits/{encounter}/complete'
 */
completeVisit.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeVisit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:1053
 * @route '/visits/{encounter}/complete'
 */
    const completeVisitForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: completeVisit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::completeVisit
 * @see app/Http/Controllers/PatientOperationsController.php:1053
 * @route '/visits/{encounter}/complete'
 */
        completeVisitForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: completeVisit.url(args, options),
            method: 'post',
        })
    
    completeVisit.form = completeVisitForm
/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:1069
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
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/preauthorizations'
 */
preauthorizations.url = (options?: RouteQueryOptions) => {
    return preauthorizations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/preauthorizations'
 */
preauthorizations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preauthorizations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/preauthorizations'
 */
preauthorizations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preauthorizations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/preauthorizations'
 */
    const preauthorizationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preauthorizations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:1069
 * @route '/preauthorizations'
 */
        preauthorizationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preauthorizations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::preauthorizations
 * @see app/Http/Controllers/PatientOperationsController.php:1069
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
const PatientOperationsController = { visits, showVisit, updateVisit, icd11Search, uploadDocument, downloadDocument, deleteDocument, refreshVisitBenefits, issueInvoice, downloadInvoice, completeVisit, preauthorizations }

export default PatientOperationsController