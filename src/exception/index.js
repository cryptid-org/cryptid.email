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
    return makeException({
        type: 'EmailSendingException',
        message: 'Failed to send the verification message to the provided email address.',
        data: {
            email
        }
    });
};

const FormTokenGenerationException = function FormTokenGenerationException() {
    return makeException({
        type: 'FormTokenGenerationException',
        message: 'Failed to generate a form token.',
        data: {}
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
        data: {}
    });
};

const InvalidEmailTokenException = function InvalidEmailTokenException(emailToken) {
    return makeException({
        type: 'InvalidEmailTokenException',
        message: 'The supplied email token in invalid.',
        data: {
            emailToken
        }
    });
};

const InvalidFormTokenException = function InvalidFormTokenException(formToken) {
    return makeException({
        type: 'InvalidFormTokenException',
        message: 'The supplied form token is invalid.',
        data: {
            formToken
        }
    });
};

const InvalidVerificationTokenException = function InvalidVerificationTokenException(verificationToken) {
    return makeException({
        type: 'InvalidVerificationTokenException',
        message: 'The provided verification token is not correct.',
        data: {
            verificationToken
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
    FormTokenGenerationException,
    IbeExtractError,
    IbeSetupError,
    InvalidEmailTokenException,
    InvalidFormTokenException,
    InvalidVerificationTokenException,
    MissingParametersError
};
