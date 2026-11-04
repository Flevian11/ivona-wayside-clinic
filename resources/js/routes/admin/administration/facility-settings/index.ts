import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::update
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:91
 * @route '/admin/administration/facility-settings'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::identity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
export const identity = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: identity.url(options),
    method: 'put',
})

identity.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/identity',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::identity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
identity.url = (options?: RouteQueryOptions) => {
    return identity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::identity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
identity.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: identity.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::identity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
    const identityForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: identity.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::identity
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:27
 * @route '/admin/administration/facility-settings/identity'
 */
        identityForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: identity.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    identity.form = identityForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::contact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
export const contact = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: contact.url(options),
    method: 'put',
})

contact.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/contact',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::contact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::contact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
contact.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: contact.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::contact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
    const contactForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: contact.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::contact
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:39
 * @route '/admin/administration/facility-settings/contact'
 */
        contactForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: contact.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    contact.form = contactForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::socialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
export const socialLinks = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: socialLinks.url(options),
    method: 'put',
})

socialLinks.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/social-links',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::socialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
socialLinks.url = (options?: RouteQueryOptions) => {
    return socialLinks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::socialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
socialLinks.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: socialLinks.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::socialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
    const socialLinksForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: socialLinks.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::socialLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:51
 * @route '/admin/administration/facility-settings/social-links'
 */
        socialLinksForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: socialLinks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    socialLinks.form = socialLinksForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::publicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
export const publicLinks = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: publicLinks.url(options),
    method: 'put',
})

publicLinks.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/public-links',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::publicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
publicLinks.url = (options?: RouteQueryOptions) => {
    return publicLinks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::publicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
publicLinks.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: publicLinks.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::publicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
    const publicLinksForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publicLinks.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::publicLinks
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:66
 * @route '/admin/administration/facility-settings/public-links'
 */
        publicLinksForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publicLinks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    publicLinks.form = publicLinksForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
export const logo = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: logo.url(options),
    method: 'put',
})

logo.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/logo',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
logo.url = (options?: RouteQueryOptions) => {
    return logo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
logo.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: logo.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
    const logoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logo.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::logo
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:166
 * @route '/admin/administration/facility-settings/logo'
 */
        logoForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    logo.form = logoForm
/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
export const favicon = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: favicon.url(options),
    method: 'put',
})

favicon.definition = {
    methods: ["put"],
    url: '/admin/administration/facility-settings/favicon',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
favicon.url = (options?: RouteQueryOptions) => {
    return favicon.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
favicon.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: favicon.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
    const faviconForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: favicon.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ClinicSettingsController::favicon
 * @see app/Http/Controllers/Admin/ClinicSettingsController.php:215
 * @route '/admin/administration/facility-settings/favicon'
 */
        faviconForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: favicon.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    favicon.form = faviconForm
const facilitySettings = {
    update: Object.assign(update, update),
identity: Object.assign(identity, identity),
contact: Object.assign(contact, contact),
socialLinks: Object.assign(socialLinks, socialLinks),
publicLinks: Object.assign(publicLinks, publicLinks),
logo: Object.assign(logo, logo),
favicon: Object.assign(favicon, favicon),
}

export default facilitySettings