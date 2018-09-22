const config = require('../../../config');

module.exports = {
    IbeParametersRepository: (function requireIbeParametersRepository(env) {
        return require('./InMemoryIbeParametersRepository').InMemoryIbeParametersRepository;
    })(config.get('env'))
};
