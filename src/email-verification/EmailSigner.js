const jwt = require('jsonwebtoken');

const config = require('../../config');

const makeEmailSigner = function makeEmailSigner({ config, jwt }) {
    return {
        sign(email) {
            const options = {
                algorithm: config.get('emailVerification.sign.algorithm'),
                expiresIn: config.get('emailVerification.sign.expiration')
            };

            const t = jwt.sign({ email }, config.get('emailVerification.sign.secret'), options);

            return t;
        },
        verify(token) {
            const options = {
                algorithm: [config.get('emailVerification.sign.algorithm')]
            };

            return jwt.verify(token, config.get('emailVerification.sign.secret'),options);
        }
    };
};

module.exports = {
    makeEmailSigner,
    EmailSigner: makeEmailSigner({ config, jwt })
};
