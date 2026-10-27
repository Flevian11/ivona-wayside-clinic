import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::store
 * @see app/Http/Controllers/PatientOperationsController.php:225
 * @route '/visits/{encounter}/documents'
 */
export const store = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::store
 * @see app/Http/Controllers/PatientOperationsController.php:225
 * @route '/visits/{encounter}/documents'
 */
store.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::store
 * @see app/Http/Controllers/PatientOperationsController.php:225
 * @route '/visits/{encounter}/documents'
 */
store.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::store
 * @see app/Http/Controllers/PatientOperationsController.php:225
 * @route '/visits/{encounter}/documents'
 */
    const storeForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::store
 * @see app/Http/Controllers/PatientOperationsController.php:225
 * @route '/visits/{encounter}/documents'
 */
        storeForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PatientOperationsController::download
 * @see app/Http/Controllers/PatientOperationsController.php:279
 * @route '/visits/{encounter}/documents/{document}'
 */
export const download = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/visits/{encounter}/documents/{document}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::download
 * @see app/Http/Controllers/PatientOperationsController.php:279
 * @route '/visits/{encounter}/documents/{document}'
 */
download.url = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::download
 * @see app/Http/Controllers/PatientOperationsController.php:279
 * @route '/visits/{encounter}/documents/{document}'
 */
download.get = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::download
 * @see app/Http/Controllers/PatientOperationsController.php:279
 * @route '/visits/{encounter}/documents/{document}'
 */
download.head = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::download
 * @see app/Http/Controllers/PatientOperationsController.php:279
 * @route '/visits/{encounter}/documents/{document}'
 */
    const downloadForm = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::download
 * @see app/Http/Controllers/PatientOperationsController.php:279
 * @route '/visits/{encounter}/documents/{document}'
 */
        downloadForm.get = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::download
 * @see app/Http/Controllers/PatientOperationsController.php:279
 * @route '/visits/{encounter}/documents/{document}'
 */
        downloadForm.head = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\PatientOperationsController::deleteMethod
 * @see app/Http/Controllers/PatientOperationsController.php:257
 * @route '/visits/{encounter}/documents/{document}'
 */
export const deleteMethod = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/visits/{encounter}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::deleteMethod
 * @see app/Http/Controllers/PatientOperationsController.php:257
 * @route '/visits/{encounter}/documents/{document}'
 */
deleteMethod.url = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions) => {
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

    return deleteMethod.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::deleteMethod
 * @see app/Http/Controllers/PatientOperationsController.php:257
 * @route '/visits/{encounter}/documents/{document}'
 */
deleteMethod.delete = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::deleteMethod
 * @see app/Http/Controllers/PatientOperationsController.php:257
 * @route '/visits/{encounter}/documents/{document}'
 */
    const deleteMethodForm = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::deleteMethod
 * @see app/Http/Controllers/PatientOperationsController.php:257
 * @route '/visits/{encounter}/documents/{document}'
 */
        deleteMethodForm.delete = (args: { encounter: number | { id: number }, document: string | number } | [encounter: number | { id: number }, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const documents = {
    store: Object.assign(store, store),
download: Object.assign(download, download),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default documents