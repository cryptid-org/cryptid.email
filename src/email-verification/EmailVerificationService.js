const { CodeRepository } = require('./CodeRepository');
const { EmailSender } = require('./EmailSender');

const makeEmailVerificationService = function makeEmailVerificationService({ CodeRepository, EmailSender }) {
    return {
        async getFormToken() {
            return CodeRepository.requestFormToken();
        },
        async initiateEmailVerification(email, formToken) {
            const verificationToken = await CodeRepository.requestVerificationToken(formToken);

            if (!verificationToken) {
                return false;
            }

            EmailSender.sendCode(email, verificationToken);

            return true;
        },
        async checkVerificationToken(formToken, verificationToken) {
            return CodeRepository.checkVerificationToken(formToken, verificationToken);
        }
    }
};

module.exports = {
    makeEmailVerificationService,
    EmailVerificationService: makeEmailVerificationService({ CodeRepository, EmailSender })
};
