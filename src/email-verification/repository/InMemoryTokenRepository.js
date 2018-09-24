const { Maybe } = require('monet');
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

            return Maybe.fromNull(token);
        },
        async requestVerificationToken(email, formToken) {
            const value = Maybe
                .fromNull(storage.get(formToken))
                .bind(value => value.verificationToken == config.get('emailVerification.formToken.placeholder') ? Maybe.Just(value) : Maybe.Nothing());

            if (value.isNothing()) {
                return Maybe.Nothing();
            }

            clearTimeout(value.just().timeoutHandle);

            const verificationToken = generateVerificationToken();

            const timeoutHandle = setTimeout(function removeVerificationToken() {
                storage.delete(formToken);
            }, config.get('emailVerification.verificationToken.expiration') * 1000);

            storage.set(formToken, {
                email,
                timeoutHandle,
                verificationToken
            });

            return Maybe.Just(verificationToken);
        },
        async checkVerificationToken(formToken, verificationToken) {
            const saved = Maybe
                .fromNull(storage.get(formToken))
                .bind(value => value.verificationToken == verificationToken ? Maybe.Just(value) : Maybe.Nothing());

            if (saved.isNothing()) {
                return Maybe.Nothing();
            }

            clearTimeout(saved.just().timeoutHandle);

            storage.delete(formToken);

            return saved.map(value => value.email);
        }
    };
};


module.exports = {
    makeInMemoryTokenRepository,
    InMemoryTokenRepository: makeInMemoryTokenRepository({ config, randomstring })
};
