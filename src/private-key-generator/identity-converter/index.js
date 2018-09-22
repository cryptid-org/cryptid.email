const config = require('../../../config');

const implementations = {
    StringifyConverter() {
        return require('./StringifyConverter').StringifyConverter;
    }
};

module.exports = {
    IdentityConverter: (function requireIdentityConverter(impl) {
        return implementations[impl]();      
    })(config.get('ibe.privateKeyGenerator.identityConverter'))
};
