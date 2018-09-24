const Err = {
    toString() {
        return `${this.type}: ${this.message}`;
    }
};

const makeError = function makeError(obj) {
    Object.setPrototypeOf(obj, Err);

    return obj;
};

const EmailSendingError = function EmailSendingError(email) {
    return makeError({
        type: 'EmailSendingError',
        message: 'Failed to send the verification message to the provided email address.',
        data: {
            email
        }
    });
};

const FormTokenGenerationError = function FormTokenGenerationError() {
    return makeError({
        type: 'FormTokenGenerationError',
        message: 'Failed to generate a form token.',
        data: {}
    });
};

const IbeExtractError = function IbeExtractError(parametersId, identity) {
    return makeError({
        type: 'IbeExtractError',
        message: 'Could not extract the private key corresponding to the specified identity.',
        data: {
            parametersId,
            identity
        }
    });
};

const IbeSetupError = function IbeSetupError() {
    return makeError({
        type: 'IbeSetupError',
        message: 'Could not setup the IBE system (master secret, public parameters).',
        data: {}
    });
};

const InvalidEmailTokenError = function InvalidEmailTokenError(emailToken) {
    return makeError({
        type: 'InvalidEmailTokenError',
        message: 'The supplied email token in invalid.',
        data: {
            emailToken
        }
    });
};

const InvalidFormTokenError = function InvalidFormTokenError(formToken) {
    return makeError({
        type: 'InvalidFormTokenError',
        message: 'The supplied form token is invalid.',
        data: {
            formToken
        }
    });
};

const InvalidVerificationTokenError = function InvalidVerificationTokenError(verificationToken) {
    return makeError({
        type: 'InvalidVerificationTokenError',
        message: 'The provided verification token is not correct.',
        data: {
            verificationToken
        }
    });
};

const MissingParametersError = function MissingParametersError(parametersId) {
    return makeError({
        type: 'MissingParametersError',
        message: 'No parameters found for the specified ID.',
        data: {
            parametersId
        }
    });
};

module.exports = {
    EmailSendingError,
    FormTokenGenerationError,
    IbeExtractError,
    IbeSetupError,
    InvalidEmailTokenError,
    InvalidFormTokenError,
    InvalidVerificationTokenError,
    MissingParametersError
};
