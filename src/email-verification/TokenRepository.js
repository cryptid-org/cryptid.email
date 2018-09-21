const { promisify }  = require('util');

const randomstring = require('randomstring');
const redis = require('redis');

const config = require('../config');

const FORM_TOKEN_OPTIONS = {
    length: 128,
    charset: 'alphanumeric'
};
const FORM_TOKEN_PLACEHOLDER = 'Hello darkness, my old friend';
const FORM_TOKEN_PLACEHOLDER_EXPIRATION = 60 * 60 * 24; // 1 day
const OK = 'OK';
const VERIFICATION_TOKEN_OPTIONS = {
    length: 8,
    charset: 'alphanumeric'
};
const VERIFICATION_TOKEN_EXPIRATION = 60 * 10; // 10 minutes

const makeTokenRepository = function makeTokenRepository({ config, randomstring, redis }) {
    const client = redis.createClient(config.get('redis.url'));

    const generateFormToken = () => randomstring(FORM_TOKEN_OPTIONS);
    const generateVerificationToken = () => randomstring(VERIFICATION_TOKEN_OPTIONS);

    const delAsync = promisify(client.del).bind(client);
    const getAsync = promisify(client.get).bind(client);
    const setAsync = promisify(client.set).bind(client);

    return {
        async requestFormToken() {
            const token = generateFormToken();

            const result = await setAsync(token, FORM_TOKEN_PLACEHOLDER, 'EX', FORM_TOKEN_PLACEHOLDER_EXPIRATION);

            return result == OK ? token : null;
        },
        async requestVerificationToken(formToken) {
            const placeholderValue = await getAsync(formToken);

            if (placeholderValue != FORM_TOKEN_PLACEHOLDER) {
                return null;
            }

            const verificationToken = generateVerificationToken();

            const result = await setAsync(formToken, verificationToken, 'EX', VERIFICATION_TOKEN_EXPIRATION);

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
    makeTokenRepository,
    TokenRepository: makeTokenRepository({ config, randomstring, redis })
};
