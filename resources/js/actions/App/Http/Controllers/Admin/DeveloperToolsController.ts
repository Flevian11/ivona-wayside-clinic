import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::index
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:33
 * @route '/developer-tools'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/developer-tools',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::index
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:33
 * @route '/developer-tools'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::index
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:33
 * @route '/developer-tools'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::index
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:33
 * @route '/developer-tools'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::index
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:33
 * @route '/developer-tools'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::index
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:33
 * @route '/developer-tools'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::index
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:33
 * @route '/developer-tools'
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
* @see \App\Http\Controllers\Admin\DeveloperToolsController::inboundKeys
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:34
 * @route '/developer-tools/inbound-keys'
 */
export const inboundKeys = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: inboundKeys.url(options),
    method: 'get',
})

inboundKeys.definition = {
    methods: ["get","head"],
    url: '/developer-tools/inbound-keys',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::inboundKeys
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:34
 * @route '/developer-tools/inbound-keys'
 */
inboundKeys.url = (options?: RouteQueryOptions) => {
    return inboundKeys.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::inboundKeys
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:34
 * @route '/developer-tools/inbound-keys'
 */
inboundKeys.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: inboundKeys.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::inboundKeys
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:34
 * @route '/developer-tools/inbound-keys'
 */
inboundKeys.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: inboundKeys.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::inboundKeys
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:34
 * @route '/developer-tools/inbound-keys'
 */
    const inboundKeysForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: inboundKeys.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::inboundKeys
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:34
 * @route '/developer-tools/inbound-keys'
 */
        inboundKeysForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: inboundKeys.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::inboundKeys
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:34
 * @route '/developer-tools/inbound-keys'
 */
        inboundKeysForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: inboundKeys.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    inboundKeys.form = inboundKeysForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
export const storeApiKey = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApiKey.url(options),
    method: 'post',
})

storeApiKey.definition = {
    methods: ["post"],
    url: '/developer-tools/api-keys',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
storeApiKey.url = (options?: RouteQueryOptions) => {
    return storeApiKey.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
storeApiKey.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApiKey.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
    const storeApiKeyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeApiKey.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:51
 * @route '/developer-tools/api-keys'
 */
        storeApiKeyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeApiKey.url(options),
            method: 'post',
        })
    
    storeApiKey.form = storeApiKeyForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revokeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
export const revokeApiKey = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revokeApiKey.url(args, options),
    method: 'delete',
})

revokeApiKey.definition = {
    methods: ["delete"],
    url: '/developer-tools/api-keys/{apiKey}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revokeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
revokeApiKey.url = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { apiKey: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { apiKey: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    apiKey: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        apiKey: typeof args.apiKey === 'object'
                ? args.apiKey.id
                : args.apiKey,
                }

    return revokeApiKey.definition.url
            .replace('{apiKey}', parsedArgs.apiKey.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revokeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
revokeApiKey.delete = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revokeApiKey.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revokeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
    const revokeApiKeyForm = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revokeApiKey.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::revokeApiKey
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:52
 * @route '/developer-tools/api-keys/{apiKey}'
 */
        revokeApiKeyForm.delete = (args: { apiKey: number | { id: number } } | [apiKey: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revokeApiKey.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    revokeApiKey.form = revokeApiKeyForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::integrations
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:35
 * @route '/developer-tools/integrations'
 */
export const integrations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: integrations.url(options),
    method: 'get',
})

integrations.definition = {
    methods: ["get","head"],
    url: '/developer-tools/integrations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::integrations
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:35
 * @route '/developer-tools/integrations'
 */
integrations.url = (options?: RouteQueryOptions) => {
    return integrations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::integrations
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:35
 * @route '/developer-tools/integrations'
 */
integrations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: integrations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::integrations
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:35
 * @route '/developer-tools/integrations'
 */
integrations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: integrations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::integrations
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:35
 * @route '/developer-tools/integrations'
 */
    const integrationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: integrations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::integrations
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:35
 * @route '/developer-tools/integrations'
 */
        integrationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: integrations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::integrations
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:35
 * @route '/developer-tools/integrations'
 */
        integrationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: integrations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    integrations.form = integrationsForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environmentIndex
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:36
 * @route '/developer-tools/environments'
 */
export const environmentIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: environmentIndex.url(options),
    method: 'get',
})

environmentIndex.definition = {
    methods: ["get","head"],
    url: '/developer-tools/environments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environmentIndex
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:36
 * @route '/developer-tools/environments'
 */
environmentIndex.url = (options?: RouteQueryOptions) => {
    return environmentIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environmentIndex
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:36
 * @route '/developer-tools/environments'
 */
environmentIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: environmentIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environmentIndex
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:36
 * @route '/developer-tools/environments'
 */
environmentIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: environmentIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environmentIndex
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:36
 * @route '/developer-tools/environments'
 */
    const environmentIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: environmentIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environmentIndex
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:36
 * @route '/developer-tools/environments'
 */
        environmentIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: environmentIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environmentIndex
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:36
 * @route '/developer-tools/environments'
 */
        environmentIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: environmentIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    environmentIndex.form = environmentIndexForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
export const storeIntegration = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeIntegration.url(options),
    method: 'post',
})

storeIntegration.definition = {
    methods: ["post"],
    url: '/developer-tools/integrations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
storeIntegration.url = (options?: RouteQueryOptions) => {
    return storeIntegration.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
storeIntegration.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeIntegration.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
    const storeIntegrationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeIntegration.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::storeIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:53
 * @route '/developer-tools/integrations'
 */
        storeIntegrationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeIntegration.url(options),
            method: 'post',
        })
    
    storeIntegration.form = storeIntegrationForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
export const updateIntegration = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateIntegration.url(args, options),
    method: 'put',
})

updateIntegration.definition = {
    methods: ["put"],
    url: '/developer-tools/integrations/{integration}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
updateIntegration.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { integration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    integration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        integration: typeof args.integration === 'object'
                ? args.integration.id
                : args.integration,
                }

    return updateIntegration.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
updateIntegration.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateIntegration.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
    const updateIntegrationForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateIntegration.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:54
 * @route '/developer-tools/integrations/{integration}'
 */
        updateIntegrationForm.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateIntegration.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateIntegration.form = updateIntegrationForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::deleteIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
export const deleteIntegration = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteIntegration.url(args, options),
    method: 'delete',
})

deleteIntegration.definition = {
    methods: ["delete"],
    url: '/developer-tools/integrations/{integration}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::deleteIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
deleteIntegration.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { integration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    integration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        integration: typeof args.integration === 'object'
                ? args.integration.id
                : args.integration,
                }

    return deleteIntegration.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::deleteIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
deleteIntegration.delete = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteIntegration.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::deleteIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
    const deleteIntegrationForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteIntegration.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::deleteIntegration
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:55
 * @route '/developer-tools/integrations/{integration}'
 */
        deleteIntegrationForm.delete = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteIntegration.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteIntegration.form = deleteIntegrationForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegrationStatus
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
export const updateIntegrationStatus = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateIntegrationStatus.url(args, options),
    method: 'patch',
})

updateIntegrationStatus.definition = {
    methods: ["patch"],
    url: '/developer-tools/integrations/{integration}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegrationStatus
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
updateIntegrationStatus.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { integration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    integration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        integration: typeof args.integration === 'object'
                ? args.integration.id
                : args.integration,
                }

    return updateIntegrationStatus.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegrationStatus
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
updateIntegrationStatus.patch = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateIntegrationStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegrationStatus
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
    const updateIntegrationStatusForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateIntegrationStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::updateIntegrationStatus
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:56
 * @route '/developer-tools/integrations/{integration}/status'
 */
        updateIntegrationStatusForm.patch = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateIntegrationStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateIntegrationStatus.form = updateIntegrationStatusForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environments
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:37
 * @route '/developer-tools/integrations/{integration}/environments'
 */
export const environments = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: environments.url(args, options),
    method: 'get',
})

environments.definition = {
    methods: ["get","head"],
    url: '/developer-tools/integrations/{integration}/environments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environments
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:37
 * @route '/developer-tools/integrations/{integration}/environments'
 */
environments.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { integration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    integration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        integration: typeof args.integration === 'object'
                ? args.integration.id
                : args.integration,
                }

    return environments.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environments
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:37
 * @route '/developer-tools/integrations/{integration}/environments'
 */
environments.get = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: environments.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environments
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:37
 * @route '/developer-tools/integrations/{integration}/environments'
 */
environments.head = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: environments.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environments
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:37
 * @route '/developer-tools/integrations/{integration}/environments'
 */
    const environmentsForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: environments.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environments
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:37
 * @route '/developer-tools/integrations/{integration}/environments'
 */
        environmentsForm.get = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: environments.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::environments
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:37
 * @route '/developer-tools/integrations/{integration}/environments'
 */
        environmentsForm.head = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: environments.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    environments.form = environmentsForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::saveEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
export const saveEnvironment = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: saveEnvironment.url(args, options),
    method: 'put',
})

saveEnvironment.definition = {
    methods: ["put"],
    url: '/developer-tools/integrations/{integration}/environments',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::saveEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
saveEnvironment.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { integration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    integration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        integration: typeof args.integration === 'object'
                ? args.integration.id
                : args.integration,
                }

    return saveEnvironment.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::saveEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
saveEnvironment.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: saveEnvironment.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::saveEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
    const saveEnvironmentForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveEnvironment.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::saveEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:57
 * @route '/developer-tools/integrations/{integration}/environments'
 */
        saveEnvironmentForm.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveEnvironment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    saveEnvironment.form = saveEnvironmentForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:60
 * @route '/developer-tools/integrations/{integration}/test'
 */
export const testEnvironment = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testEnvironment.url(args, options),
    method: 'post',
})

testEnvironment.definition = {
    methods: ["post"],
    url: '/developer-tools/integrations/{integration}/test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:60
 * @route '/developer-tools/integrations/{integration}/test'
 */
testEnvironment.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { integration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    integration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        integration: typeof args.integration === 'object'
                ? args.integration.id
                : args.integration,
                }

    return testEnvironment.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:60
 * @route '/developer-tools/integrations/{integration}/test'
 */
testEnvironment.post = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testEnvironment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:60
 * @route '/developer-tools/integrations/{integration}/test'
 */
    const testEnvironmentForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testEnvironment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testEnvironment
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:60
 * @route '/developer-tools/integrations/{integration}/test'
 */
        testEnvironmentForm.post = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testEnvironment.url(args, options),
            method: 'post',
        })
    
    testEnvironment.form = testEnvironmentForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::hie
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:38
 * @route '/developer-tools/hie'
 */
export const hie = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hie.url(options),
    method: 'get',
})

hie.definition = {
    methods: ["get","head"],
    url: '/developer-tools/hie',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::hie
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:38
 * @route '/developer-tools/hie'
 */
hie.url = (options?: RouteQueryOptions) => {
    return hie.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::hie
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:38
 * @route '/developer-tools/hie'
 */
hie.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hie.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::hie
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:38
 * @route '/developer-tools/hie'
 */
hie.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hie.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::hie
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:38
 * @route '/developer-tools/hie'
 */
    const hieForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: hie.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::hie
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:38
 * @route '/developer-tools/hie'
 */
        hieForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hie.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::hie
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:38
 * @route '/developer-tools/hie'
 */
        hieForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hie.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    hie.form = hieForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::activity
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:49
 * @route '/developer-tools/activity'
 */
export const activity = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activity.url(options),
    method: 'get',
})

activity.definition = {
    methods: ["get","head"],
    url: '/developer-tools/activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::activity
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:49
 * @route '/developer-tools/activity'
 */
activity.url = (options?: RouteQueryOptions) => {
    return activity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::activity
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:49
 * @route '/developer-tools/activity'
 */
activity.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activity.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::activity
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:49
 * @route '/developer-tools/activity'
 */
activity.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activity.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::activity
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:49
 * @route '/developer-tools/activity'
 */
    const activityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: activity.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::activity
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:49
 * @route '/developer-tools/activity'
 */
        activityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activity.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::activity
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:49
 * @route '/developer-tools/activity'
 */
        activityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activity.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    activity.form = activityForm
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testing
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:50
 * @route '/developer-tools/testing'
 */
export const testing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testing.url(options),
    method: 'get',
})

testing.definition = {
    methods: ["get","head"],
    url: '/developer-tools/testing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testing
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:50
 * @route '/developer-tools/testing'
 */
testing.url = (options?: RouteQueryOptions) => {
    return testing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testing
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:50
 * @route '/developer-tools/testing'
 */
testing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testing
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:50
 * @route '/developer-tools/testing'
 */
testing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: testing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testing
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:50
 * @route '/developer-tools/testing'
 */
    const testingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: testing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testing
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:50
 * @route '/developer-tools/testing'
 */
        testingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DeveloperToolsController::testing
 * @see app/Http/Controllers/Admin/DeveloperToolsController.php:50
 * @route '/developer-tools/testing'
 */
        testingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    testing.form = testingForm
const DeveloperToolsController = { index, inboundKeys, storeApiKey, revokeApiKey, integrations, environmentIndex, storeIntegration, updateIntegration, deleteIntegration, updateIntegrationStatus, environments, saveEnvironment, testEnvironment, hie, activity, testing }

export default DeveloperToolsController