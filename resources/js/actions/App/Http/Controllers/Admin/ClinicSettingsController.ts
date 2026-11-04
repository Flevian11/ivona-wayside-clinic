import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:19
 * @route '/admin/administration/facility-settings'
 */
export const facility = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facility.url(options),
    method: 'get',
})

facility.definition = {
    methods: ["get","head"],
    url: '/admin/administration/facility-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:19
 * @route '/admin/administration/facility-settings'
 */
facility.url = (options?: RouteQueryOptions) => {
    return facility.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:19
 * @route '/admin/administration/facility-settings'
 */
facility.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facility.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:19
 * @route '/admin/administration/facility-settings'
 */
facility.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: facility.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:19
 * @route '/admin/administration/facility-settings'
 */
    const facilityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: facility.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:19
 * @route '/admin/administration/facility-settings'
 */
        facilityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: facility.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::facility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:19
 * @route '/admin/administration/facility-settings'
 */
        facilityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: facility.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    facility.form = facilityForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
export const updateFacility = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacility.url(options),
    method: 'put',
})

updateFacility.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
updateFacility.url = (options?: RouteQueryOptions) => {
    return updateFacility.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
updateFacility.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacility.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
    const updateFacilityForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFacility.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacility
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
        updateFacilityForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFacility.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFacility.form = updateFacilityForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityIdentity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
export const updateFacilityIdentity = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacilityIdentity.url(options),
    method: 'put',
})

updateFacilityIdentity.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/identity',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityIdentity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
updateFacilityIdentity.url = (options?: RouteQueryOptions) => {
    return updateFacilityIdentity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityIdentity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
updateFacilityIdentity.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacilityIdentity.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityIdentity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
    const updateFacilityIdentityForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFacilityIdentity.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityIdentity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
        updateFacilityIdentityForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFacilityIdentity.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFacilityIdentity.form = updateFacilityIdentityForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityContact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
export const updateFacilityContact = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacilityContact.url(options),
    method: 'put',
})

updateFacilityContact.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/contact',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityContact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
updateFacilityContact.url = (options?: RouteQueryOptions) => {
    return updateFacilityContact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityContact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
updateFacilityContact.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacilityContact.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityContact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
    const updateFacilityContactForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFacilityContact.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityContact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
        updateFacilityContactForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFacilityContact.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFacilityContact.form = updateFacilityContactForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilitySocialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
export const updateFacilitySocialLinks = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacilitySocialLinks.url(options),
    method: 'put',
})

updateFacilitySocialLinks.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/social-links',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilitySocialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
updateFacilitySocialLinks.url = (options?: RouteQueryOptions) => {
    return updateFacilitySocialLinks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilitySocialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
updateFacilitySocialLinks.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacilitySocialLinks.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilitySocialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
    const updateFacilitySocialLinksForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFacilitySocialLinks.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilitySocialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
        updateFacilitySocialLinksForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFacilitySocialLinks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFacilitySocialLinks.form = updateFacilitySocialLinksForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityPublicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
export const updateFacilityPublicLinks = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacilityPublicLinks.url(options),
    method: 'put',
})

updateFacilityPublicLinks.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/public-links',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityPublicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
updateFacilityPublicLinks.url = (options?: RouteQueryOptions) => {
    return updateFacilityPublicLinks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityPublicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
updateFacilityPublicLinks.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFacilityPublicLinks.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityPublicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
    const updateFacilityPublicLinksForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFacilityPublicLinks.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFacilityPublicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
        updateFacilityPublicLinksForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFacilityPublicLinks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFacilityPublicLinks.form = updateFacilityPublicLinksForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateLogo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
export const updateLogo = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLogo.url(options),
    method: 'put',
})

updateLogo.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/logo',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateLogo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
updateLogo.url = (options?: RouteQueryOptions) => {
    return updateLogo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateLogo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
updateLogo.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLogo.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateLogo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
    const updateLogoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateLogo.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateLogo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
        updateLogoForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateLogo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateLogo.form = updateLogoForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFavicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
export const updateFavicon = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFavicon.url(options),
    method: 'put',
})

updateFavicon.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/favicon',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFavicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
updateFavicon.url = (options?: RouteQueryOptions) => {
    return updateFavicon.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFavicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
updateFavicon.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFavicon.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFavicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
    const updateFaviconForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFavicon.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateFavicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
        updateFaviconForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFavicon.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFavicon.form = updateFaviconForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:271
 * @route '/admin/administration/system-configuration'
 */
export const system = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: system.url(options),
    method: 'get',
})

system.definition = {
    methods: ["get","head"],
    url: '/admin/administration/system-configuration',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:271
 * @route '/admin/administration/system-configuration'
 */
system.url = (options?: RouteQueryOptions) => {
    return system.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:271
 * @route '/admin/administration/system-configuration'
 */
system.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: system.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:271
 * @route '/admin/administration/system-configuration'
 */
system.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: system.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:271
 * @route '/admin/administration/system-configuration'
 */
    const systemForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: system.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:271
 * @route '/admin/administration/system-configuration'
 */
        systemForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: system.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::system
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:271
 * @route '/admin/administration/system-configuration'
 */
        systemForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: system.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    system.form = systemForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:287
 * @route '/admin/administration/system-configuration'
 */
export const updateSystem = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSystem.url(options),
    method: 'put',
})

updateSystem.definition = {
    methods: ["put"],
    url: '/admin/administration/system-configuration',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:287
 * @route '/admin/administration/system-configuration'
 */
updateSystem.url = (options?: RouteQueryOptions) => {
    return updateSystem.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:287
 * @route '/admin/administration/system-configuration'
 */
updateSystem.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSystem.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:287
 * @route '/admin/administration/system-configuration'
 */
    const updateSystemForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSystem.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::updateSystem
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:287
 * @route '/admin/administration/system-configuration'
 */
        updateSystemForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSystem.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSystem.form = updateSystemForm
const ClinicSettingsController = { facility, updateFacility, updateFacilityIdentity, updateFacilityContact, updateFacilitySocialLinks, updateFacilityPublicLinks, updateLogo, updateFavicon, system, updateSystem }

export default ClinicSettingsController