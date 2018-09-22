const config = require('../../../config');

module.exports = {
    TokenRepository: (function requireTokenRepository(env) {
        if (env == 'staging' || env == 'production') {
            return require('./RedisTokenRepository').RedisTokenRepository;
        }

        return require('./InMemoryTokenRepository').InMemoryTokenRepository;
    })(config.get('env'))
};
