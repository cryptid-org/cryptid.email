const randomstring = require('randomstring');

const config = require('../../../config');

const makeInMemoryTokenRepository = function makeInMemoryTokenRepository({ config, randomstring }) {
    const generateFormToken = () => randomstring(config.get('emailVerification.formToken'));
    const generateVerificationToken = () => randomstring(config.get('emailVerification.verificationToken'));

    return {
        async requestFormToken() {
            const token = generateFormToken();

            const result = await setAsync(token, config.get('emailVerification.formToken.placeholder'), 
                                          'EX', config.get('emailVerification.formToken.placeholderExpiration'));

            return result == OK ? token : null;
        },
        async requestVerificationToken(formToken) {
            const placeholderValue = await getAsync(formToken);

            if (placeholderValue != config.get('emailVerification.formToken.placeholder')) {
                return null;
            }

            const verificationToken = generateVerificationToken();

            const result = await setAsync(formToken, verificationToken, 'EX', config.get('emailVerification.verificationToken.expiration'));

            return result == OK ? verificationToken : null;
        },
        async checkVerificationToken(formToken, verificationToken) {
            const savedToken = await getAsync(formToken);

            if (savedToken != verificationToken) {
                return false;
            }

            await delAsync(formToken);

            return true;
        }
    };
};


module.exports = {
    makeInMemoryTokenRepository,
    InMemoryTokenRepository: makeInMemoryTokenRepository({ config, randomstring })
};
