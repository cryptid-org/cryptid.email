const { TokenRepository } = require('./repository');
const { EmailSender } = require('./EmailSender');

const makeEmailVerificationService = function makeEmailVerificationService({ TokenRepository, EmailSender }) {
    return {
        async getFormToken() {
            return TokenRepository.requestFormToken();
        },
        async initiateEmailVerification(email, formToken) {
            const verificationToken = await TokenRepository.requestVerificationToken(formToken);

            if (!verificationToken) {
                return false;
            }

            EmailSender.sendCode(email, verificationToken);

            return true;
        },
        async checkVerificationToken(formToken, verificationToken) {
            return TokenRepository.checkVerificationToken(formToken, verificationToken);
        }
    }
};

module.exports = {
    makeEmailVerificationService,
    EmailVerificationService: makeEmailVerificationService({ TokenRepository, EmailSender })
};
