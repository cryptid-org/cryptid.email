const Boom = require('boom');
const Joi = require('joi');

const config = require('../../config');

const { VerificationFlow  } = require('../email-verification/VerificationFlow');

const emailAddress = {
    POST: {
        method: 'POST',
        path: '/verification/email/address',
        async handler(request, h) {
            const { email, formToken } = request.payload;

            const result = await VerificationFlow.initiateVerificationForAddress(email, formToken);

            return result.cata(
                err => Boom.badRequest('Could not initiate verification!', err),
                () => h.response().code(201)
            );
        },
        options: {
            description: 'Initiates the email verification process by sending a verification token.',
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    formToken: Joi.string().length(config.get('emailVerification.formToken.length')).required()
                }
            }
        }
    }
};

const emailToken = {
    POST: {
        method: 'POST',
        path: '/verification/email/token',
        async handler(request) {
            const { formToken, verificationToken } = request.payload;

            const result = await VerificationFlow.checkVerificationToken(formToken, verificationToken);

            return result.cata(
                err => Boom.badRequest('Invalid form token or verification token!', err),
                emailToken => ({ emailToken })
            );
        },
        options: {
            description: 'Checks if the token matches the email address.',
            validate: {
                payload: {
                    formToken: Joi.string().length(config.get('emailVerification.formToken.length')).required(),
                    verificationToken: Joi.string().length(config.get('emailVerification.verificationToken.length')).required()
                }
            }
        }
    }
};

module.exports = {
    emailAddress,
    emailToken
};
