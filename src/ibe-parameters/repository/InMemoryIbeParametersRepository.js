const { Maybe }  = require('monet');

const makeInMemoryIbeParametersRepository = function makeInMemoryIbeParametersRepository() {
    let currentParameters = null;

    const parameterMap = new Map();

    return {
        async getCurrentParameters() {
            return Maybe.fromNull(currentParameters);
        },
        async getParametersForId(parametersId) {
            return Maybe.fromNull(parameterMap.get(parametersId));
        },
        async setCurrentParameters(parameters) {
            currentParameters = parameters;

            parameterMap.set(parameters.id, parameters);
        }
    };
};


module.exports = {
    makeInMemoryIbeParametersRepository,
    InMemoryIbeParametersRepository: makeInMemoryIbeParametersRepository()
};
