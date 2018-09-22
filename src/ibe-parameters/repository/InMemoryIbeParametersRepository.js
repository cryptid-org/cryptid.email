const makeInMemoryIbeParametersRepository = function makeInMemoryIbeParametersRepository() {
    let currentParameters = null;

    const parameterMap = new Map();

    return {
        async getCurrentPublicParameters() {
            if (!currentParameters) {
                return null;
            }
            
            return Object.assign({
                id: currentParameters.id
            }, currentParameters.publicParameters);
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
