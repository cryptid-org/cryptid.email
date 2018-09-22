const makeInMemoryIbeParametersRepository = function makeInMemoryIbeParametersRepository() {
    let currentParameters;

    const parameterMap = new Map();

    return {
        async getCurrentPublicParameters() {
            return currentParameters.publicParameters;
        },
        async getParametersForId(parametersId) {
            return parameterMap.get(parametersId);
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
