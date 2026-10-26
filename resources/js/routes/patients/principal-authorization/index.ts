import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PatientController::contacts
 * @see app/Http/Controllers/PatientController.php:653
 * @route '/patients/principal-authorization/contacts'
 */
export const contacts = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contacts.url(options),
    method: 'post',
})

contacts.definition = {
    methods: ["post"],
    url: '/patients/principal-authorization/contacts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::contacts
 * @see app/Http/Controllers/PatientController.php:653
 * @route '/patients/principal-authorization/contacts'
 */
contacts.url = (options?: RouteQueryOptions) => {
    return contacts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::contacts
 * @see app/Http/Controllers/PatientController.php:653
 * @route '/patients/principal-authorization/contacts'
 */
contacts.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contacts.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::contacts
 * @see app/Http/Controllers/PatientController.php:653
 * @route '/patients/principal-authorization/contacts'
 */
    const contactsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: contacts.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::contacts
 * @see app/Http/Controllers/PatientController.php:653
 * @route '/patients/principal-authorization/contacts'
 */
        contactsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: contacts.url(options),
            method: 'post',
        })
    
    contacts.form = contactsForm
/**
* @see \App\Http\Controllers\PatientController::start
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/patients/principal-authorization/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::start
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::start
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::start
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
    const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: start.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::start
 * @see app/Http/Controllers/PatientController.php:545
 * @route '/patients/principal-authorization/start'
 */
        startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: start.url(options),
            method: 'post',
        })
    
    start.form = startForm
/**
* @see \App\Http\Controllers\PatientController::verify
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/patients/principal-authorization/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PatientController::verify
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PatientController::verify
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PatientController::verify
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PatientController::verify
 * @see app/Http/Controllers/PatientController.php:670
 * @route '/patients/principal-authorization/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const principalAuthorization = {
    contacts: Object.assign(contacts, contacts),
start: Object.assign(start, start),
verify: Object.assign(verify, verify),
}

export default principalAuthorization