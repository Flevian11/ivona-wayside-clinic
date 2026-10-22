import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdministrationController::users
 * @see app/Http/Controllers/Admin/AdministrationController.php:21
 * @route '/admin/administration/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/administration/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::users
 * @see app/Http/Controllers/Admin/AdministrationController.php:21
 * @route '/admin/administration/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::users
 * @see app/Http/Controllers/Admin/AdministrationController.php:21
 * @route '/admin/administration/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdministrationController::users
 * @see app/Http/Controllers/Admin/AdministrationController.php:21
 * @route '/admin/administration/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::users
 * @see app/Http/Controllers/Admin/AdministrationController.php:21
 * @route '/admin/administration/users'
 */
    const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: users.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::users
 * @see app/Http/Controllers/Admin/AdministrationController.php:21
 * @route '/admin/administration/users'
 */
        usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdministrationController::users
 * @see app/Http/Controllers/Admin/AdministrationController.php:21
 * @route '/admin/administration/users'
 */
        usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    users.form = usersForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:40
 * @route '/admin/administration/users'
 */
export const storeUser = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeUser.url(options),
    method: 'post',
})

storeUser.definition = {
    methods: ["post"],
    url: '/admin/administration/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:40
 * @route '/admin/administration/users'
 */
storeUser.url = (options?: RouteQueryOptions) => {
    return storeUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:40
 * @route '/admin/administration/users'
 */
storeUser.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeUser.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::storeUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:40
 * @route '/admin/administration/users'
 */
    const storeUserForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeUser.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::storeUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:40
 * @route '/admin/administration/users'
 */
        storeUserForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeUser.url(options),
            method: 'post',
        })
    
    storeUser.form = storeUserForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:78
 * @route '/admin/administration/users/{user}'
 */
export const updateUser = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateUser.url(args, options),
    method: 'put',
})

updateUser.definition = {
    methods: ["put"],
    url: '/admin/administration/users/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:78
 * @route '/admin/administration/users/{user}'
 */
updateUser.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return updateUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:78
 * @route '/admin/administration/users/{user}'
 */
updateUser.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateUser.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::updateUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:78
 * @route '/admin/administration/users/{user}'
 */
    const updateUserForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateUser.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::updateUser
 * @see app/Http/Controllers/Admin/AdministrationController.php:78
 * @route '/admin/administration/users/{user}'
 */
        updateUserForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateUser.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateUser.form = updateUserForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::staff
 * @see app/Http/Controllers/Admin/AdministrationController.php:103
 * @route '/admin/administration/staff'
 */
export const staff = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: staff.url(options),
    method: 'get',
})

staff.definition = {
    methods: ["get","head"],
    url: '/admin/administration/staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::staff
 * @see app/Http/Controllers/Admin/AdministrationController.php:103
 * @route '/admin/administration/staff'
 */
staff.url = (options?: RouteQueryOptions) => {
    return staff.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::staff
 * @see app/Http/Controllers/Admin/AdministrationController.php:103
 * @route '/admin/administration/staff'
 */
staff.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: staff.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdministrationController::staff
 * @see app/Http/Controllers/Admin/AdministrationController.php:103
 * @route '/admin/administration/staff'
 */
staff.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: staff.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::staff
 * @see app/Http/Controllers/Admin/AdministrationController.php:103
 * @route '/admin/administration/staff'
 */
    const staffForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: staff.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::staff
 * @see app/Http/Controllers/Admin/AdministrationController.php:103
 * @route '/admin/administration/staff'
 */
        staffForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: staff.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdministrationController::staff
 * @see app/Http/Controllers/Admin/AdministrationController.php:103
 * @route '/admin/administration/staff'
 */
        staffForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: staff.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    staff.form = staffForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
export const storeStaff = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeStaff.url(options),
    method: 'post',
})

storeStaff.definition = {
    methods: ["post"],
    url: '/admin/administration/staff',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
storeStaff.url = (options?: RouteQueryOptions) => {
    return storeStaff.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
storeStaff.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeStaff.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::storeStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
    const storeStaffForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeStaff.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::storeStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:119
 * @route '/admin/administration/staff'
 */
        storeStaffForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeStaff.url(options),
            method: 'post',
        })
    
    storeStaff.form = storeStaffForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
export const updateStaff = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStaff.url(args, options),
    method: 'put',
})

updateStaff.definition = {
    methods: ["put"],
    url: '/admin/administration/staff/{staffMember}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
updateStaff.url = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateStaff.definition.url
            .replace('{staffMember}', parsedArgs.staffMember.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
updateStaff.put = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStaff.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::updateStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
    const updateStaffForm = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStaff.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::updateStaff
 * @see app/Http/Controllers/Admin/AdministrationController.php:142
 * @route '/admin/administration/staff/{staffMember}'
 */
        updateStaffForm.put = (args: { staffMember: number | { id: number } } | [staffMember: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStaff.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStaff.form = updateStaffForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::roles
 * @see app/Http/Controllers/Admin/AdministrationController.php:164
 * @route '/admin/administration/roles'
 */
export const roles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})

roles.definition = {
    methods: ["get","head"],
    url: '/admin/administration/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::roles
 * @see app/Http/Controllers/Admin/AdministrationController.php:164
 * @route '/admin/administration/roles'
 */
roles.url = (options?: RouteQueryOptions) => {
    return roles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::roles
 * @see app/Http/Controllers/Admin/AdministrationController.php:164
 * @route '/admin/administration/roles'
 */
roles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdministrationController::roles
 * @see app/Http/Controllers/Admin/AdministrationController.php:164
 * @route '/admin/administration/roles'
 */
roles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: roles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::roles
 * @see app/Http/Controllers/Admin/AdministrationController.php:164
 * @route '/admin/administration/roles'
 */
    const rolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: roles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::roles
 * @see app/Http/Controllers/Admin/AdministrationController.php:164
 * @route '/admin/administration/roles'
 */
        rolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdministrationController::roles
 * @see app/Http/Controllers/Admin/AdministrationController.php:164
 * @route '/admin/administration/roles'
 */
        rolesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    roles.form = rolesForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:179
 * @route '/admin/administration/roles'
 */
export const storeRole = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRole.url(options),
    method: 'post',
})

storeRole.definition = {
    methods: ["post"],
    url: '/admin/administration/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:179
 * @route '/admin/administration/roles'
 */
storeRole.url = (options?: RouteQueryOptions) => {
    return storeRole.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::storeRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:179
 * @route '/admin/administration/roles'
 */
storeRole.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRole.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::storeRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:179
 * @route '/admin/administration/roles'
 */
    const storeRoleForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeRole.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::storeRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:179
 * @route '/admin/administration/roles'
 */
        storeRoleForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeRole.url(options),
            method: 'post',
        })
    
    storeRole.form = storeRoleForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:192
 * @route '/admin/administration/roles/{role}'
 */
export const updateRole = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRole.url(args, options),
    method: 'put',
})

updateRole.definition = {
    methods: ["put"],
    url: '/admin/administration/roles/{role}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:192
 * @route '/admin/administration/roles/{role}'
 */
updateRole.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return updateRole.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::updateRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:192
 * @route '/admin/administration/roles/{role}'
 */
updateRole.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRole.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::updateRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:192
 * @route '/admin/administration/roles/{role}'
 */
    const updateRoleForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateRole.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::updateRole
 * @see app/Http/Controllers/Admin/AdministrationController.php:192
 * @route '/admin/administration/roles/{role}'
 */
        updateRoleForm.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateRole.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateRole.form = updateRoleForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::rolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:171
 * @route '/admin/administration/roles/{role}/permissions'
 */
export const rolePermissions = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rolePermissions.url(args, options),
    method: 'get',
})

rolePermissions.definition = {
    methods: ["get","head"],
    url: '/admin/administration/roles/{role}/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::rolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:171
 * @route '/admin/administration/roles/{role}/permissions'
 */
rolePermissions.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return rolePermissions.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::rolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:171
 * @route '/admin/administration/roles/{role}/permissions'
 */
rolePermissions.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rolePermissions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdministrationController::rolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:171
 * @route '/admin/administration/roles/{role}/permissions'
 */
rolePermissions.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rolePermissions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::rolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:171
 * @route '/admin/administration/roles/{role}/permissions'
 */
    const rolePermissionsForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: rolePermissions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::rolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:171
 * @route '/admin/administration/roles/{role}/permissions'
 */
        rolePermissionsForm.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rolePermissions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdministrationController::rolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:171
 * @route '/admin/administration/roles/{role}/permissions'
 */
        rolePermissionsForm.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rolePermissions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    rolePermissions.form = rolePermissionsForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::syncRolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:212
 * @route '/admin/administration/roles/{role}/permissions'
 */
export const syncRolePermissions = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: syncRolePermissions.url(args, options),
    method: 'put',
})

syncRolePermissions.definition = {
    methods: ["put"],
    url: '/admin/administration/roles/{role}/permissions',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::syncRolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:212
 * @route '/admin/administration/roles/{role}/permissions'
 */
syncRolePermissions.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return syncRolePermissions.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::syncRolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:212
 * @route '/admin/administration/roles/{role}/permissions'
 */
syncRolePermissions.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: syncRolePermissions.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::syncRolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:212
 * @route '/admin/administration/roles/{role}/permissions'
 */
    const syncRolePermissionsForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncRolePermissions.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::syncRolePermissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:212
 * @route '/admin/administration/roles/{role}/permissions'
 */
        syncRolePermissionsForm.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncRolePermissions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    syncRolePermissions.form = syncRolePermissionsForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::permissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:276
 * @route '/admin/administration/permissions'
 */
export const permissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(options),
    method: 'get',
})

permissions.definition = {
    methods: ["get","head"],
    url: '/admin/administration/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::permissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:276
 * @route '/admin/administration/permissions'
 */
permissions.url = (options?: RouteQueryOptions) => {
    return permissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::permissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:276
 * @route '/admin/administration/permissions'
 */
permissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdministrationController::permissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:276
 * @route '/admin/administration/permissions'
 */
permissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: permissions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::permissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:276
 * @route '/admin/administration/permissions'
 */
    const permissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: permissions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::permissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:276
 * @route '/admin/administration/permissions'
 */
        permissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: permissions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdministrationController::permissions
 * @see app/Http/Controllers/Admin/AdministrationController.php:276
 * @route '/admin/administration/permissions'
 */
        permissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: permissions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    permissions.form = permissionsForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::assignments
 * @see app/Http/Controllers/Admin/AdministrationController.php:234
 * @route '/admin/administration/role-assignments'
 */
export const assignments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assignments.url(options),
    method: 'get',
})

assignments.definition = {
    methods: ["get","head"],
    url: '/admin/administration/role-assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::assignments
 * @see app/Http/Controllers/Admin/AdministrationController.php:234
 * @route '/admin/administration/role-assignments'
 */
assignments.url = (options?: RouteQueryOptions) => {
    return assignments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::assignments
 * @see app/Http/Controllers/Admin/AdministrationController.php:234
 * @route '/admin/administration/role-assignments'
 */
assignments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assignments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdministrationController::assignments
 * @see app/Http/Controllers/Admin/AdministrationController.php:234
 * @route '/admin/administration/role-assignments'
 */
assignments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: assignments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::assignments
 * @see app/Http/Controllers/Admin/AdministrationController.php:234
 * @route '/admin/administration/role-assignments'
 */
    const assignmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: assignments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::assignments
 * @see app/Http/Controllers/Admin/AdministrationController.php:234
 * @route '/admin/administration/role-assignments'
 */
        assignmentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: assignments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdministrationController::assignments
 * @see app/Http/Controllers/Admin/AdministrationController.php:234
 * @route '/admin/administration/role-assignments'
 */
        assignmentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: assignments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    assignments.form = assignmentsForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::syncUserRoles
 * @see app/Http/Controllers/Admin/AdministrationController.php:242
 * @route '/admin/administration/role-assignments/{user}'
 */
export const syncUserRoles = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: syncUserRoles.url(args, options),
    method: 'put',
})

syncUserRoles.definition = {
    methods: ["put"],
    url: '/admin/administration/role-assignments/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::syncUserRoles
 * @see app/Http/Controllers/Admin/AdministrationController.php:242
 * @route '/admin/administration/role-assignments/{user}'
 */
syncUserRoles.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return syncUserRoles.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::syncUserRoles
 * @see app/Http/Controllers/Admin/AdministrationController.php:242
 * @route '/admin/administration/role-assignments/{user}'
 */
syncUserRoles.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: syncUserRoles.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::syncUserRoles
 * @see app/Http/Controllers/Admin/AdministrationController.php:242
 * @route '/admin/administration/role-assignments/{user}'
 */
    const syncUserRolesForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncUserRoles.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::syncUserRoles
 * @see app/Http/Controllers/Admin/AdministrationController.php:242
 * @route '/admin/administration/role-assignments/{user}'
 */
        syncUserRolesForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncUserRoles.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    syncUserRoles.form = syncUserRolesForm
/**
* @see \App\Http\Controllers\Admin\AdministrationController::accessHistory
 * @see app/Http/Controllers/Admin/AdministrationController.php:283
 * @route '/admin/administration/access-history'
 */
export const accessHistory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accessHistory.url(options),
    method: 'get',
})

accessHistory.definition = {
    methods: ["get","head"],
    url: '/admin/administration/access-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdministrationController::accessHistory
 * @see app/Http/Controllers/Admin/AdministrationController.php:283
 * @route '/admin/administration/access-history'
 */
accessHistory.url = (options?: RouteQueryOptions) => {
    return accessHistory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdministrationController::accessHistory
 * @see app/Http/Controllers/Admin/AdministrationController.php:283
 * @route '/admin/administration/access-history'
 */
accessHistory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accessHistory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdministrationController::accessHistory
 * @see app/Http/Controllers/Admin/AdministrationController.php:283
 * @route '/admin/administration/access-history'
 */
accessHistory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accessHistory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdministrationController::accessHistory
 * @see app/Http/Controllers/Admin/AdministrationController.php:283
 * @route '/admin/administration/access-history'
 */
    const accessHistoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: accessHistory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdministrationController::accessHistory
 * @see app/Http/Controllers/Admin/AdministrationController.php:283
 * @route '/admin/administration/access-history'
 */
        accessHistoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: accessHistory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdministrationController::accessHistory
 * @see app/Http/Controllers/Admin/AdministrationController.php:283
 * @route '/admin/administration/access-history'
 */
        accessHistoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: accessHistory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    accessHistory.form = accessHistoryForm
const AdministrationController = { users, storeUser, updateUser, staff, storeStaff, updateStaff, roles, storeRole, updateRole, rolePermissions, syncRolePermissions, permissions, assignments, syncUserRoles, accessHistory }

export default AdministrationController