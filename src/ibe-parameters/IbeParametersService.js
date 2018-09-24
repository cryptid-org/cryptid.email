const uuid = require('uuid/v1');

const MetaClient = require('../../ext/metaclient.cjs');

const config = require('../../config');

const { IbeSetupError } = require('../exception');

const { IbeParametersRepository } = require('./repository');

const INSTANTLY = 0;
const DONE = true;

const makeIbeParametersService = function makeIbeParametersService({ config, IbeParametersRepository, MetaClient, uuid }) {
    const parameterFactory = function parameterFactory(masterSecret, publicParameters) {
        return {
            id: uuid(),
            createdAt: Date.now(),
            masterSecret,
            publicParameters
        };
    };

    const rotateParametersIn = function rotateParametersIn(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(async function rotate() {
                const instance = await MetaClient.getInstance();
                const { success, masterSecret, publicParameters } = instance.setup(config.get('ibe.securityLevel'));

                if (!success) {
                    reject(IbeSetupError());

                    return;
                }
                
                const parameters = parameterFactory(masterSecret, publicParameters);

                IbeParametersRepository.setCurrentParameters(parameters);
                    
                resolve();

                rotateParametersIn(config.get('ibe.parameterChangeInterval'));

                return DONE;
            });
        }, ms);
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

    function filterFields(parameters) {
        return {
            id: parameters.id,
            publicParameters: parameters.publicParameters
        };
    }

    return {
        async getCurrentPublicParameters() {
            await firstSetup;

            const parametersMaybe = await IbeParametersRepository.getCurrentParameters();

            return parametersMaybe.map(filterFields);
        },
        async getPublicParametersForId(parametersId) {
            const parametersMaybe = await IbeParametersRepository.getParametersForId(parametersId);

            return parametersMaybe.map(filterFields);
        },
        getParametersForId: parametersId => IbeParametersRepository.getParametersForId(parametersId)
    };
};

module.exports = {
    makeIbeParametersService,
    IbeParametersService: makeIbeParametersService({ config, IbeParametersRepository, MetaClient, uuid })
};
