const Boom = require('boom');
const Joi = require('joi');

const config = require('../../config');

const { EmailVerificationService } = require('../email-verification/EmailVerificationService');

const emailAddress = {
    POST: {
        method: 'POST',
        path: '/verification/email/address',
        async handler(request, h) {
            const { email, formToken } = request.payload;

            const result = await EmailVerificationService.initiateEmailVerification(email, formToken);

            if (!result) {
                return Boom.badRequest('Invalid form token!');
            }
        },
        options: {
            description: 'Initiates the email verification process.',
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
        async handler(request, h) {
            const { email, formToken } = request.payload;

            const result = await EmailVerificationService.initiateEmailVerification(email, formToken);

            if (!result) {
                return Boom.badRequest('Invalid form token!');
            }
        },
        options: {
            description: 'Initiates the email verification process.',
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    formToken: Joi.string().length(config.get('emailVerification.formToken.length')).required()
                }
            }
        }
    }
};

module.exports = {
    emailAddress,
    emailToken
};
