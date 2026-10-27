import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientOperationsController::issue
 * @see app/Http/Controllers/PatientOperationsController.php:457
 * @route '/visits/{encounter}/invoice/issue'
 */
export const issue = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issue.url(args, options),
    method: 'post',
})

issue.definition = {
    methods: ["post"],
    url: '/visits/{encounter}/invoice/issue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::issue
 * @see app/Http/Controllers/PatientOperationsController.php:457
 * @route '/visits/{encounter}/invoice/issue'
 */
issue.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return issue.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::issue
 * @see app/Http/Controllers/PatientOperationsController.php:457
 * @route '/visits/{encounter}/invoice/issue'
 */
issue.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issue.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::issue
 * @see app/Http/Controllers/PatientOperationsController.php:457
 * @route '/visits/{encounter}/invoice/issue'
 */
    const issueForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: issue.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::issue
 * @see app/Http/Controllers/PatientOperationsController.php:457
 * @route '/visits/{encounter}/invoice/issue'
 */
        issueForm.post = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: issue.url(args, options),
            method: 'post',
        })
    
    issue.form = issueForm
/**
* @see \App\Http\Controllers\PatientOperationsController::pdf
 * @see app/Http/Controllers/PatientOperationsController.php:516
 * @route '/visits/{encounter}/invoice.pdf'
 */
export const pdf = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/visits/{encounter}/invoice.pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PatientOperationsController::pdf
 * @see app/Http/Controllers/PatientOperationsController.php:516
 * @route '/visits/{encounter}/invoice.pdf'
 */
pdf.url = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return pdf.definition.url
            .replace('{encounter}', parsedArgs.encounter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientOperationsController::pdf
 * @see app/Http/Controllers/PatientOperationsController.php:516
 * @route '/visits/{encounter}/invoice.pdf'
 */
pdf.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PatientOperationsController::pdf
 * @see app/Http/Controllers/PatientOperationsController.php:516
 * @route '/visits/{encounter}/invoice.pdf'
 */
pdf.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PatientOperationsController::pdf
 * @see app/Http/Controllers/PatientOperationsController.php:516
 * @route '/visits/{encounter}/invoice.pdf'
 */
    const pdfForm = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PatientOperationsController::pdf
 * @see app/Http/Controllers/PatientOperationsController.php:516
 * @route '/visits/{encounter}/invoice.pdf'
 */
        pdfForm.get = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PatientOperationsController::pdf
 * @see app/Http/Controllers/PatientOperationsController.php:516
 * @route '/visits/{encounter}/invoice.pdf'
 */
        pdfForm.head = (args: { encounter: number | { id: number } } | [encounter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
const invoice = {
    issue: Object.assign(issue, issue),
pdf: Object.assign(pdf, pdf),
}

export default invoice