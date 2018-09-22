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

    const firstSetup = IbeParametersRepository.getCurrentPublicParameters()
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

    return {
        async getCurrentPublicParameters() {
            await firstSetup;
            
            return IbeParametersRepository.getCurrentPublicParameters();
        },
        async getParametersForId(parametersId) {
            return IbeParametersRepository.getParametersForId(parametersId);
        }
    };
};

module.exports = {
    makeIbeParametersService,
    IbeParametersService: makeIbeParametersService({ config, IbeParametersRepository, MetaClient, uuid })
};
