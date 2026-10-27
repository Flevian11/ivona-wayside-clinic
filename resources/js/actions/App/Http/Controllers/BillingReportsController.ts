import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BillingReportsController::billing
 * @see app/Http/Controllers/BillingReportsController.php:13
 * @route '/billing'
 */
export const billing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: billing.url(options),
    method: 'get',
})

billing.definition = {
    methods: ["get","head"],
    url: '/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingReportsController::billing
 * @see app/Http/Controllers/BillingReportsController.php:13
 * @route '/billing'
 */
billing.url = (options?: RouteQueryOptions) => {
    return billing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingReportsController::billing
 * @see app/Http/Controllers/BillingReportsController.php:13
 * @route '/billing'
 */
billing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: billing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BillingReportsController::billing
 * @see app/Http/Controllers/BillingReportsController.php:13
 * @route '/billing'
 */
billing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: billing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BillingReportsController::billing
 * @see app/Http/Controllers/BillingReportsController.php:13
 * @route '/billing'
 */
    const billingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: billing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BillingReportsController::billing
 * @see app/Http/Controllers/BillingReportsController.php:13
 * @route '/billing'
 */
        billingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: billing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BillingReportsController::billing
 * @see app/Http/Controllers/BillingReportsController.php:13
 * @route '/billing'
 */
        billingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: billing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    billing.form = billingForm
/**
* @see \App\Http\Controllers\BillingReportsController::reports
 * @see app/Http/Controllers/BillingReportsController.php:63
 * @route '/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingReportsController::reports
 * @see app/Http/Controllers/BillingReportsController.php:63
 * @route '/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingReportsController::reports
 * @see app/Http/Controllers/BillingReportsController.php:63
 * @route '/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BillingReportsController::reports
 * @see app/Http/Controllers/BillingReportsController.php:63
 * @route '/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BillingReportsController::reports
 * @see app/Http/Controllers/BillingReportsController.php:63
 * @route '/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BillingReportsController::reports
 * @see app/Http/Controllers/BillingReportsController.php:63
 * @route '/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BillingReportsController::reports
 * @see app/Http/Controllers/BillingReportsController.php:63
 * @route '/reports'
 */
        reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reports.form = reportsForm
const BillingReportsController = { billing, reports }

export default BillingReportsController