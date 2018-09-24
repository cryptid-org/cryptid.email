const uuid = require('uuid/v1');

const MetaClient = require('../../ext/metaclient.cjs');

const config = require('../../config');

const { IbeParametersRepository } = require('./repository');

const INSTANTLY = 0;
const DONE = true;

const makeIbeParametersService = function makeIbeParametersService({ config, IbeParametersRepository, MetaClient, uuid }) {
    const rotateParametersIn = function rotateParametersIn(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                MetaClient.getInstance()
                    .then(instance => instance.setup(config.get('ibe.securityLevel')))
                    .then(result => {
                        return Object.assign({
                            id: uuid(),
                            createdAt: Date.now()
                        }, result);
                    })
                    .then(parameters => IbeParametersRepository.setCurrentParameters(parameters))
                    .then(() => {
                        resolve();

                        rotateParametersIn(config.get('ibe.parameterChangeInterval'));

                        return DONE;
                    });
            }, ms);
        });
    };

    const firstSetup = IbeParametersRepository.getCurrentParameters()
        .then(pp => {
            if (pp != null) {
                const now = Date.now();
                const timeSince = now - pp.createdAt;
                const timeUntilExpiry = (pp.createdAt + config.get('ibe.parameterChangeInterval')) - now;

                if (timeSince > config.get('ibe.parameterChangeInterval')) {
                    return rotateParametersIn(INSTANTLY);
                }

                rotateParametersIn(timeUntilExpiry);

                return DONE;
            }

            return rotateParametersIn(INSTANTLY);
        });

    function convertToPublicParameters(parameters) {
        return Object.assign({
            id: parameters.id
        }, parameters.publicParameters);
    }

    return {
        async getCurrentPublicParameters() {
            await firstSetup;
            
            const params = await IbeParametersRepository.getCurrentParameters();

            return convertToPublicParameters(params);
        },
        async getPublicParametersForId(parametersId) {
            const params = await IbeParametersRepository.getParametersForId(parametersId);

            return convertToPublicParameters(params);
        },
        getParametersForId(parametersId) {
            return IbeParametersRepository.getParametersForId(parametersId);
        }
    };
};

module.exports = {
    makeIbeParametersService,
    IbeParametersService: makeIbeParametersService({ config, IbeParametersRepository, MetaClient, uuid })
};
