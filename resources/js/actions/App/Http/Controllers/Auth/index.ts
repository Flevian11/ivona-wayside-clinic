import EmailOtpChallengeController from './EmailOtpChallengeController'
import EmailOtpTwoFactorSetupController from './EmailOtpTwoFactorSetupController'
const Auth = {
    EmailOtpChallengeController: Object.assign(EmailOtpChallengeController, EmailOtpChallengeController),
EmailOtpTwoFactorSetupController: Object.assign(EmailOtpTwoFactorSetupController, EmailOtpTwoFactorSetupController),
}

export default Auth