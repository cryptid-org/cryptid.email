const Boom = require('boom');
const Joi = require('joi');

const { VerificationFlow  } = require('../email-verification/VerificationFlow');
const { PrivateKeyGenerator } = require('../private-key-generator/PrivateKeyGenerator');

const POST = {
    method: 'POST',
    path: '/private-key',
    async handler(request, h) {
        const { emailToken, parametersId } = request.payload;

        const tokenData = await VerificationFlow.checkEmailToken(emailToken);

        if (!tokenData) {
            return Boom.badRequest('Erroneous email token!');
        }

        const pkgResult = await PrivateKeyGenerator.generate(parametersId, { email: tokenData.email });
        
        return pkgResult.cata(
            err => Boom.badRequest('Could not extract private key!', err),
            privateKey => ({ privateKey })
        );
    },
    options: {
        description: 'Returns the private key corresponding to a set of parameters.',
        validate: {
            payload: {
                emailToken: Joi.string().required(),
                parametersId: Joi.string().required()
            }
        }
    }
};

module.exports = {
    POST
};
