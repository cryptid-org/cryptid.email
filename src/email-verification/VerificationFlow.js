const { InvalidVerificationTokenException } = require('../exception');
const { EmailVerificationService } = require('./EmailVerificationService');
const { EmailSigner } = require('./EmailSigner');

const makeVerificationFlow = function makeVerificationFlow({ EmailSigner, EmailVerificationService }) {
    return {
        async createVerificationForm() {
            return EmailVerificationService.getFormToken();
        },
        async initiateVerificationForAddress(email, formToken) {
            return EmailVerificationService.initiateEmailVerification(email, formToken);
        },
        async checkVerificationToken(formToken, verificationToken) {
            const email = await EmailVerificationService.getEmailForVerificationToken(formToken, verificationToken);

            email
                .toValidation()

            return EmailSigner.sign(email);
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
