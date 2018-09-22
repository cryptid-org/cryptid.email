const Boom = require('boom');
const Joi = require('joi');

const config = require('../../config');

const POST = {
    method: 'POST',
    path: '/private-key',
    async handler(request, h) {
        const { formToken, verificationToken } = request.payload;

        
    },
    options: {
        description: 'Returns the private key corresponding to the specified public key.',
        validate: {
            payload: {
                formToken: Joi.string().length(config.get('emailVerification.formToken.length')).required(),
                verificationToken: Joi.string().length(config.get('emailVerification.verificationToken.length')).required()
            }
        }
    }
};

module.exports = {
    POST
};
