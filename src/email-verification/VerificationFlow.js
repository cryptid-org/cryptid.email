const logger = require('../logger');
const { InvalidVerificationTokenError } = require('../exception');
const { EmailVerificationService } = require('./EmailVerificationService');
const { EmailSigner } = require('./EmailSigner');

const makeVerificationFlow = function makeVerificationFlow({ EmailSigner, EmailVerificationService }) {
    return {
        async createVerificationForm() {
            logger.info('Creating new form token.');

            return EmailVerificationService.getFormToken();
        },
        async initiateVerificationForAddress(email, formToken) {
            return EmailVerificationService.initiateEmailVerification(email, formToken);
        },
        async checkVerificationToken(formToken, verificationToken) {
            const email = await EmailVerificationService.getEmailForVerificationToken(formToken, verificationToken);

            return email
                .toValidation(InvalidVerificationTokenError(verificationToken))
                .map(address => EmailSigner.sign(address));
        },
        async checkEmailToken(emailToken) {
            return EmailSigner.verify(emailToken);
        }
    };
};

module.exports = {
    makeVerificationFlow,
    VerificationFlow: makeVerificationFlow({ EmailSigner, EmailVerificationService })
};
