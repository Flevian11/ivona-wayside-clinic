import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import users48860f from './users'
import staffC58c8e from './staff'
import rolesF85c84 from './roles'
import assignmentsA4dcb6 from './assignments'
import facilitySettings8c4a88 from './facility-settings'
import systemConfiguration9b4477 from './system-configuration'
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
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facilitySettings
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
export const facilitySettings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facilitySettings.url(options),
    method: 'get',
})

facilitySettings.definition = {
    methods: ["get","head"],
    url: '/admin/administration/facility-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facilitySettings
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
facilitySettings.url = (options?: RouteQueryOptions) => {
    return facilitySettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facilitySettings
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
facilitySettings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facilitySettings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facilitySettings
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
facilitySettings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: facilitySettings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facilitySettings
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
    const facilitySettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: facilitySettings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facilitySettings
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
        facilitySettingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: facilitySettings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facilitySettings
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:17
 * @route '/admin/administration/facility-settings'
 */
        facilitySettingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: facilitySettings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    facilitySettings.form = facilitySettingsForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::systemConfiguration
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
export const systemConfiguration = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: systemConfiguration.url(options),
    method: 'get',
})

systemConfiguration.definition = {
    methods: ["get","head"],
    url: '/admin/administration/system-configuration',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::systemConfiguration
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
systemConfiguration.url = (options?: RouteQueryOptions) => {
    return systemConfiguration.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::systemConfiguration
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
systemConfiguration.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: systemConfiguration.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::systemConfiguration
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
systemConfiguration.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: systemConfiguration.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::systemConfiguration
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
    const systemConfigurationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: systemConfiguration.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::systemConfiguration
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
        systemConfigurationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: systemConfiguration.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::systemConfiguration
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:58
 * @route '/admin/administration/system-configuration'
 */
        systemConfigurationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: systemConfiguration.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    systemConfiguration.form = systemConfigurationForm
const administration = {
    users: Object.assign(users, users48860f),
staff: Object.assign(staff, staffC58c8e),
roles: Object.assign(roles, rolesF85c84),
permissions: Object.assign(permissions, permissions),
assignments: Object.assign(assignments, assignmentsA4dcb6),
accessHistory: Object.assign(accessHistory, accessHistory),
facilitySettings: Object.assign(facilitySettings, facilitySettings8c4a88),
systemConfiguration: Object.assign(systemConfiguration, systemConfiguration9b4477),
}

export default administration