import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardReleaseAcknowledgementController::__invoke
 * @see app/Http/Controllers/DashboardReleaseAcknowledgementController.php:13
 * @route '/dashboard/releases/{systemRelease}/acknowledge'
 */
const DashboardReleaseAcknowledgementController = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: DashboardReleaseAcknowledgementController.url(args, options),
    method: 'post',
})

DashboardReleaseAcknowledgementController.definition = {
    methods: ["post"],
    url: '/dashboard/releases/{systemRelease}/acknowledge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardReleaseAcknowledgementController::__invoke
 * @see app/Http/Controllers/DashboardReleaseAcknowledgementController.php:13
 * @route '/dashboard/releases/{systemRelease}/acknowledge'
 */
DashboardReleaseAcknowledgementController.url = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { systemRelease: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { systemRelease: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    systemRelease: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        systemRelease: typeof args.systemRelease === 'object'
                ? args.systemRelease.id
                : args.systemRelease,
                }

    return DashboardReleaseAcknowledgementController.definition.url
            .replace('{systemRelease}', parsedArgs.systemRelease.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardReleaseAcknowledgementController::__invoke
 * @see app/Http/Controllers/DashboardReleaseAcknowledgementController.php:13
 * @route '/dashboard/releases/{systemRelease}/acknowledge'
 */
DashboardReleaseAcknowledgementController.post = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: DashboardReleaseAcknowledgementController.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardReleaseAcknowledgementController::__invoke
 * @see app/Http/Controllers/DashboardReleaseAcknowledgementController.php:13
 * @route '/dashboard/releases/{systemRelease}/acknowledge'
 */
    const DashboardReleaseAcknowledgementControllerForm = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: DashboardReleaseAcknowledgementController.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardReleaseAcknowledgementController::__invoke
 * @see app/Http/Controllers/DashboardReleaseAcknowledgementController.php:13
 * @route '/dashboard/releases/{systemRelease}/acknowledge'
 */
        DashboardReleaseAcknowledgementControllerForm.post = (args: { systemRelease: number | { id: number } } | [systemRelease: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: DashboardReleaseAcknowledgementController.url(args, options),
            method: 'post',
        })
    
    DashboardReleaseAcknowledgementController.form = DashboardReleaseAcknowledgementControllerForm
export default DashboardReleaseAcknowledgementController