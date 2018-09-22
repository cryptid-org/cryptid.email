const { promisify }  = require('util');

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
    makeRedisTokenRepository,
    RedisTokenRepository: makeRedisTokenRepository({ config, randomstring, redis })
};
