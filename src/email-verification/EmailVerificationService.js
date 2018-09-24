const { FormTokenGenerationError, InvalidFormTokenError } = require('../exception');
const { TokenRepository } = require('./repository');
const { EmailSender } = require('./EmailSender');

const makeEmailVerificationService = function makeEmailVerificationService({ TokenRepository, EmailSender }) {
    return {
        async getFormToken() {
            const tokenResult = await TokenRepository.requestFormToken();

            return tokenResult.toValidation(FormTokenGenerationError());
        },
        async initiateEmailVerification(email, formToken) {
            const verificationToken = await TokenRepository.requestVerificationToken(email, formToken);

            return verificationToken
                .toValidation(InvalidFormTokenError(formToken))
                .bind(token => EmailSender.sendCode(email, token));
        },
        async getEmailForVerificationToken(formToken, verificationToken) {
            return TokenRepository.getEmailForVerificationToken(formToken, verificationToken);
        }
    }
};

module.exports = {
    makeEmailVerificationService,
    EmailVerificationService: makeEmailVerificationService({ TokenRepository, EmailSender })
};
