const { promisify }  = require('util');

const { Maybe } = require('monet');
const randomstring = require('randomstring');
const redis = require('redis');

const config = require('../../../config');

const OK = 'OK';

const makeRedisTokenRepository = function makeRedisTokenRepository({ config, randomstring, redis }) {
    const client = redis.createClient(config.get('emailVerification.redis.url'));

    const generateFormToken = () => randomstring(config.get('emailVerification.formToken'));
    const generateVerificationToken = () => randomstring(config.get('emailVerification.verificationToken'));

    const delAsync = promisify(client.del).bind(client);
    const getAsync = promisify(client.get).bind(client);
    const setAsync = promisify(client.set).bind(client);

    return {
        async requestFormToken() {
            const token = generateFormToken();

            const result = await setAsync(token, config.get('emailVerification.formToken.placeholder'), 
                                          'EX', config.get('emailVerification.formToken.placeholderExpiration'));

            return Maybe.fromNull(result == OK ? token : null);
        },
        async requestVerificationToken(email, formToken) {
            const placeholderValue = await getAsync(formToken);

            if (placeholderValue != config.get('emailVerification.formToken.placeholder')) {
                return Maybe.Nothing();
            }

            const verificationToken = generateVerificationToken();

            const value = { verificationToken, email };

            const result = await setAsync(formToken, JSON.stringify(value), 'EX', config.get('emailVerification.verificationToken.expiration'));

            return Maybe.fromNull(result == OK ? verificationToken : null);
        },
        async checkVerificationToken(formToken, verificationToken) {
            const value = await getAsync(formToken);

            if (value.verificationToken != verificationToken) {
                return Maybe.Nothing();
            }

            await delAsync(formToken);

            return Maybe.Just(value.email);
        }
    };
};


module.exports = {
    makeRedisTokenRepository,
    RedisTokenRepository: makeRedisTokenRepository({ config, randomstring, redis })
};
