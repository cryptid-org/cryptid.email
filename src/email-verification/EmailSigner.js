const { Validation } = require('monet');
const jwt = require('jsonwebtoken');

const logger = require('../logger');
const { InvalidEmailTokenError } = require('../exception');
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

            try {
                return Validation.Success(jwt.verify(token, config.get('emailVerification.sign.secret'), options));
            } catch(err) {
                logger.info('Invalid email token.', { token }, err);

                return Validation.Fail(InvalidEmailTokenError(token));
            }
        }
    };
};

module.exports = {
    makeEmailSigner,
    EmailSigner: makeEmailSigner({ config, jwt })
};
