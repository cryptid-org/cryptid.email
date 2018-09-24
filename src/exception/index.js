const Exception = {
    toString() {
        return `${this.type}: ${this.message}`;
    }
};

const makeException = function makeException(obj) {
    Object.setPrototypeOf(obj, Exception);

    return obj;
};

const IbeExtractError = function IbeExtractError(parametersId, identity) {
    return makeException({
        type: 'IbeExtractError',
        message: 'Could not extract the private key corresponding to the specified identity.',
        data: {
            parametersId,
            identity
        }
    });
};

const IbeSetupError = function IbeSetupError() {
    return makeException({
        type: 'IbeSetupError',
        message: 'Could not setup the IBE system (master secret, public parameters).',
        data: {},
    });
};

const MissingParametersError = function MissingParametersError(parametersId) {
    return makeException({
        type: 'MissingParametersError',
        message: 'No parameters found for the specified ID.',
        data: {
            parametersId
        }
    });
};

module.exports = {
    IbeExtractError,
    IbeSetupError,
    MissingParametersError
};
