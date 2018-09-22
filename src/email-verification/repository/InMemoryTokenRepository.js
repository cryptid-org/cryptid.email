const randomstring = require('randomstring');

const config = require('../../../config');


const makeInMemoryTokenRepository = function makeInMemoryTokenRepository({ config, randomstring }) {
    const generateFormToken = () => randomstring.generate(config.get('emailVerification.formToken'));
    const generateVerificationToken = () => randomstring.generate(config.get('emailVerification.verificationToken'));

    const storage = new Map();

    return {
        async requestFormToken() {
            const token = generateFormToken();

            const timeoutHandle = setTimeout(function removeFormToken() {
                storage.delete(token);
            }, config.get('emailVerification.formToken.placeholderExpiration') * 1000);

            storage.set(token, {
                verificationToken: config.get('emailVerification.formToken.placeholder'),
                timeoutHandle
            });

            return token;
        },
        async requestVerificationToken(email, formToken) {
            const value = storage.get(formToken);

            if (!value || (value.verificationToken != config.get('emailVerification.formToken.placeholder'))) {
                return null;
            }

            clearTimeout(value.timeoutHandle);

            const verificationToken = generateVerificationToken();

            const timeoutHandle = setTimeout(function removeVerificationToken() {
                storage.delete(formToken);
            }, config.get('emailVerification.verificationToken.expiration') * 1000);

            storage.set(formToken, {
                verificationToken,
                email,
                timeoutHandle
            });

            return verificationToken;
        },
        async checkVerificationToken(formToken, verificationToken) {
            const saved = storage.get(formToken);

            if (!saved || (saved.verificationToken != verificationToken)) {
                return null;
            }

            clearTimeout(saved.timeoutHandle);

            storage.delete(formToken);

            return saved.email;
        }
    };
};


module.exports = {
    makeInMemoryTokenRepository,
    InMemoryTokenRepository: makeInMemoryTokenRepository({ config, randomstring })
};
