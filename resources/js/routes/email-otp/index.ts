import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import setup from './setup'
/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::challenge
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
export const challenge = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: challenge.url(options),
    method: 'get',
})

challenge.definition = {
    methods: ["get","head"],
    url: '/email-otp/challenge',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::challenge
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
challenge.url = (options?: RouteQueryOptions) => {
    return challenge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::challenge
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
challenge.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: challenge.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::challenge
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
challenge.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: challenge.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::challenge
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
    const challengeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: challenge.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::challenge
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
        challengeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: challenge.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\EmailOtpChallengeController::challenge
 * @see app/Http/Controllers/Auth/EmailOtpChallengeController.php:19
 * @route '/email-otp/challenge'
 */
        challengeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: challenge.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    challenge.form = challengeForm
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
const emailOtp = {
    challenge: Object.assign(challenge, challenge),
verify: Object.assign(verify, verify),
resend: Object.assign(resend, resend),
setup: Object.assign(setup, setup),
}

export default emailOtp