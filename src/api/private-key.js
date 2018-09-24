const Boom = require('boom');
const Joi = require('joi');

const { VerificationFlow  } = require('../email-verification/VerificationFlow');
const { PrivateKeyGenerator } = require('../private-key-generator/PrivateKeyGenerator');

const POST = {
    method: 'POST',
    path: '/private-key',
    async handler(request) {
        const { emailToken, parametersId } = request.payload;

        request.logger.info('Private key requested with token and id.', { emailToken, parametersId });

        const tokenData = await VerificationFlow.checkEmailToken(emailToken);

        if (tokenData.isFail()) {
            return Boom.badRequest('Erroneous email token!');
        }

        const pkgResult = await PrivateKeyGenerator.generate(parametersId, { email: tokenData.success().email });
        
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
