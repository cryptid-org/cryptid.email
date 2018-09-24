const makeInMemoryIbeParametersRepository = function makeInMemoryIbeParametersRepository() {
    let currentParameters = null;

    const parameterMap = new Map();

    return {
        async getCurrentParameters() {
            if (!currentParameters) {
                return null;
            }
            
            return currentParameters;
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
