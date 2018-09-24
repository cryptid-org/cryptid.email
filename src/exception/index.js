const Exception = {
    toString() {
        return `${this.type}: ${this.message}`;
    }
};

const makeException = function makeException(obj) {
    Object.setPrototypeOf(obj, Exception);

    return obj;
};

const EmailSendingException = function EmailSendingException(email) {
    makeException({
        type: 'EmailSendingException',
        message: 'Failed to send the verification message to the provided email address.',
        data: {
            email
        }
    });
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

const InvalidVerificationToken = function InvalidVerificationToken(verificationToken) {
    return makeException({
        type: 'InvalidVerificationToken',
        message: 'The provided verification token is not correct.',
        data: {
            verification
        }
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
    EmailSendingException,
    IbeExtractError,
    IbeSetupError,
    InvalidVerificationToken,
    MissingParametersError
};
