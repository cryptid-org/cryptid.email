const MetaClient = require('../../ext/metaclient.cjs');

const { IbeParametersService } = require('../ibe-parameters/IbeParametersService');
const { IdentityConverter } = require('./identity-converter');

const makePrivateKeyGenerator = function makePrivateKeyGenerator({ IbeParametersService, IdentityConverter, MetaClient }) {
    return {
        async generate(parametersId, publicKey) {
            const [parameters, client] = await Promise.all([IbeParametersService.getParametersForId(parametersId), MetaClient.getInstance()]);

            const { privateKey } = client.extract(parameters.publicParameters, IdentityConverter.convert(publicKey));

            return privateKey;
        }
    };
};

module.exports = {
    makePrivateKeyGenerator,
    PrivateKeyGenerator: makePrivateKeyGenerator({ IbeParametersService, IdentityConverter, MetaClient })
};
