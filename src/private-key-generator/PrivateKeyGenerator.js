const { Validation } = require('monet');

const MetaClient = require('../../ext/metaclient.cjs');

const { IbeExtractError, MissingParametersError } = require('../exception');
const { IbeParametersService } = require('../ibe-parameters/IbeParametersService');
const { IdentityConverter } = require('./identity-converter');

const makePrivateKeyGenerator = function makePrivateKeyGenerator({ IbeParametersService, IdentityConverter, MetaClient }) {
    return {
        async generate(parametersId, identity) {
            const parameters = await IbeParametersService.getParametersForId(parametersId);

            if (parameters.isNothing()) {
                return Validation.Fail(MissingParametersError(parametersId));
            }

            const client = await MetaClient.getInstance();

            const convertedIdentity = IdentityConverter.convert(identity);

            const { success, privateKey } = client.extract(parameters.just().publicParameters, parameters.just().masterSecret, convertedIdentity);

            return success ? Validation.Success(privateKey) : Validation.Fail(IbeExtractError(parametersId, identity));
        }
    };
};

module.exports = {
    makePrivateKeyGenerator,
    PrivateKeyGenerator: makePrivateKeyGenerator({ IbeParametersService, IdentityConverter, MetaClient })
};
