import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::show
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/email-otp/challenge',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::show
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::show
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::show
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::show
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::show
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::show
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::verify
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:38
 * @route '/email-otp/challenge'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/email-otp/challenge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::verify
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:38
 * @route '/email-otp/challenge'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::verify
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:38
 * @route '/email-otp/challenge'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::verify
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:38
 * @route '/email-otp/challenge'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::verify
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:38
 * @route '/email-otp/challenge'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::resend
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:84
 * @route '/email-otp/resend'
 */
export const resend = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

resend.definition = {
    methods: ["post"],
    url: '/email-otp/resend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::resend
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:84
 * @route '/email-otp/resend'
 */
resend.url = (options?: RouteQueryOptions) => {
    return resend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::resend
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:84
 * @route '/email-otp/resend'
 */
resend.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::resend
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:84
 * @route '/email-otp/resend'
 */
    const resendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resend.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::resend
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:84
 * @route '/email-otp/resend'
 */
        resendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resend.url(options),
            method: 'post',
        })
    
    resend.form = resendForm
const EmailOtpChallengeController = { show, verify, resend }

export default EmailOtpChallengeController