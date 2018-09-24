const Exception = {
    toString() {
        return `${this.type}: ${this.message}`;
    }
};

const IbeSetupError = function IbeSetupError() {
    const err = {
        type: 'IbeSetupError',
        message: 'Could not setup the IBE system (master secret, public parameters).',
        data: {},
    };

    Object.setPrototypeOf(err, Exception);

    return err;
};

module.exports = {
    IbeSetupError
};
