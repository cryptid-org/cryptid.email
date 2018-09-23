const Boom = require('boom');
const Joi = require('joi');

const { PrivateKeyGenerator } = require('../private-key-generator/PrivateKeyGenerator');

const POST = {
    method: 'POST',
    path: '/delete-me',
    async handler(request, h) {
        const { email, parametersId } = request.payload;

        const privateKey = await PrivateKeyGenerator.generate(parametersId, { email });
        
        if (!privateKey) {
            return Boom.badRequest('Could not extract private key!');
        }

        return {
            privateKey
        };
    },
    options: {
        description: 'FOR TESTING PURPOSES ONLY!!!! Returns the private key corresponding to a set of parameters WITHOUT ANY CHECKS!',
        validate: {
            payload: {
                email: Joi.string().required(),
                parametersId: Joi.string().required()
            }
        }
    }
};

module.exports = {
    POST
};
