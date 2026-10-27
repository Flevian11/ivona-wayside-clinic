import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import icd11 from './icd11'
import documents from './documents'
import benefits from './benefits'
import invoice from './invoice'
import shaClaim from './sha-claim'
/**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visits',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::index
 * @see app/Http/Controllers/PatientOperationsController.php:20
 * @route '/visits'
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
* @see \App\Http\Controllers\PatientOperationsController::show
 * @see app/Http/Controllers/PatientOperationsController.php:81
 * @route '/visits/{encounter}'
 */
export const show = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/visits/{encounter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::show
 * @see app/Http/Controllers/PatientOperationsController.php:81
 * @route '/visits/{encounter}'
 */
show.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::show
 * @see app/Http/Controllers/PatientOperationsController.php:81
 * @route '/visits/{encounter}'
 */
show.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::show
 * @see app/Http/Controllers/PatientOperationsController.php:81
 * @route '/visits/{encounter}'
 */
show.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::show
 * @see app/Http/Controllers/PatientOperationsController.php:81
 * @route '/visits/{encounter}'
 */
    const showForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::show
 * @see app/Http/Controllers/PatientOperationsController.php:81
 * @route '/visits/{encounter}'
 */
        showForm.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::show
 * @see app/Http/Controllers/PatientOperationsController.php:81
 * @route '/visits/{encounter}'
 */
        showForm.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PatientOperationsController::update
 * @see app/Http/Controllers/PatientOperationsController.php:171
 * @route '/visits/{encounter}'
 */
export const update = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/visits/{encounter}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::update
 * @see app/Http/Controllers/PatientOperationsController.php:171
 * @route '/visits/{encounter}'
 */
update.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::update
 * @see app/Http/Controllers/PatientOperationsController.php:171
 * @route '/visits/{encounter}'
 */
update.patch = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::update
 * @see app/Http/Controllers/PatientOperationsController.php:171
 * @route '/visits/{encounter}'
 */
    const updateForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::update
 * @see app/Http/Controllers/PatientOperationsController.php:171
 * @route '/visits/{encounter}'
 */
        updateForm.patch = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PatientOperationsController::complete
 * @see app/Http/Controllers/PatientOperationsController.php:1063
 * @route '/visits/{encounter}/complete'
 */
export const complete = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::complete
 * @see app/Http/Controllers/PatientOperationsController.php:1063
 * @route '/visits/{encounter}/complete'
 */
complete.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return complete.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::complete
 * @see app/Http/Controllers/PatientOperationsController.php:1063
 * @route '/visits/{encounter}/complete'
 */
complete.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::complete
 * @see app/Http/Controllers/PatientOperationsController.php:1063
 * @route '/visits/{encounter}/complete'
 */
    const completeForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: complete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::complete
 * @see app/Http/Controllers/PatientOperationsController.php:1063
 * @route '/visits/{encounter}/complete'
 */
        completeForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: complete.url(args, options),
            method: 'post',
        })
    
    complete.form = completeForm
const visits = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
update: Object.assign(update, update),
icd11: Object.assign(icd11, icd11),
documents: Object.assign(documents, documents),
benefits: Object.assign(benefits, benefits),
invoice: Object.assign(invoice, invoice),
complete: Object.assign(complete, complete),
shaClaim: Object.assign(shaClaim, shaClaim),
}

export default visits