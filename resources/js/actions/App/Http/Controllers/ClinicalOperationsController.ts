import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClinicalOperationsController::nursing
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
export const nursing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nursing.url(options),
    method: 'get',
})

nursing.definition = {
    methods: ["get","head"],
    url: '/nursing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClinicalOperationsController::nursing
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
nursing.url = (options?: RouteQueryOptions) => {
    return nursing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClinicalOperationsController::nursing
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
nursing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nursing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClinicalOperationsController::nursing
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
nursing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nursing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClinicalOperationsController::nursing
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
    const nursingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: nursing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClinicalOperationsController::nursing
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
        nursingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nursing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClinicalOperationsController::nursing
 * @see app/Http/Controllers/ClinicalOperationsController.php:12
 * @route '/nursing'
 */
        nursingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nursing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    nursing.form = nursingForm
/**
* @see \App\Http\Controllers\ClinicalOperationsController::laboratory
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
export const laboratory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: laboratory.url(options),
    method: 'get',
})

laboratory.definition = {
    methods: ["get","head"],
    url: '/laboratory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClinicalOperationsController::laboratory
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
laboratory.url = (options?: RouteQueryOptions) => {
    return laboratory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClinicalOperationsController::laboratory
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
laboratory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: laboratory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClinicalOperationsController::laboratory
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
laboratory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: laboratory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClinicalOperationsController::laboratory
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
    const laboratoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: laboratory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClinicalOperationsController::laboratory
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
        laboratoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: laboratory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClinicalOperationsController::laboratory
 * @see app/Http/Controllers/ClinicalOperationsController.php:18
 * @route '/laboratory'
 */
        laboratoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: laboratory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    laboratory.form = laboratoryForm
/**
* @see \App\Http\Controllers\ClinicalOperationsController::pharmacy
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
export const pharmacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pharmacy.url(options),
    method: 'get',
})

pharmacy.definition = {
    methods: ["get","head"],
    url: '/pharmacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClinicalOperationsController::pharmacy
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
pharmacy.url = (options?: RouteQueryOptions) => {
    return pharmacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClinicalOperationsController::pharmacy
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
pharmacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pharmacy.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClinicalOperationsController::pharmacy
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
pharmacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pharmacy.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClinicalOperationsController::pharmacy
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
    const pharmacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pharmacy.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClinicalOperationsController::pharmacy
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
        pharmacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pharmacy.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClinicalOperationsController::pharmacy
 * @see app/Http/Controllers/ClinicalOperationsController.php:24
 * @route '/pharmacy'
 */
        pharmacyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pharmacy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pharmacy.form = pharmacyForm
const ClinicalOperationsController = { nursing, laboratory, pharmacy }

export default ClinicalOperationsController