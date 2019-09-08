const config = require('../../../config');

module.exports = {
    TokenRepository: (function requireTokenRepository() {
        return require('./InMemoryTokenRepository').InMemoryTokenRepository;
    })(config.get('env'))
};
