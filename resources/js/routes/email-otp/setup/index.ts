import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::send
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:16
 * @route '/settings/security/email-2fa/send'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/settings/security/email-2fa/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::send
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:16
 * @route '/settings/security/email-2fa/send'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::send
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:16
 * @route '/settings/security/email-2fa/send'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::send
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:16
 * @route '/settings/security/email-2fa/send'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::send
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:16
 * @route '/settings/security/email-2fa/send'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::confirm
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:56
 * @route '/settings/security/email-2fa/confirm'
 */
export const confirm = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/settings/security/email-2fa/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::confirm
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:56
 * @route '/settings/security/email-2fa/confirm'
 */
confirm.url = (options?: RouteQueryOptions) => {
    return confirm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::confirm
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:56
 * @route '/settings/security/email-2fa/confirm'
 */
confirm.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::confirm
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:56
 * @route '/settings/security/email-2fa/confirm'
 */
    const confirmForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirm.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpTwoFactorSetupController::confirm
 * @see app/Http/Controllers/Auth/EmailOtpTwoFactorSetupController.php:56
 * @route '/settings/security/email-2fa/confirm'
 */
        confirmForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirm.url(options),
            method: 'post',
        })
    
    confirm.form = confirmForm
const setup = {
    send: Object.assign(send, send),
confirm: Object.assign(confirm, confirm),
}

export default setup