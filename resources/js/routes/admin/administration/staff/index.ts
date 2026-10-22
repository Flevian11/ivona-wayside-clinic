import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdministrationController::store
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/administration/staff',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::store
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::store
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::store
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::store
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::update
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
export const update = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/administration/staff/{staffMember}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::update
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
update.url = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { staffMember: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { staffMember: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    staffMember: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        staffMember: typeof args.staffMember === 'object'
                ? args.staffMember.id
                : args.staffMember,
                }

    return update.definition.url
            .replace('{staffMember}', parsedArgs.staffMember.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::update
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
update.put = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::update
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
    const updateForm = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::update
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
        updateForm.put = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const staff = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
}

export default staff