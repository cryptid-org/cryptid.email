const MetaClient = require('../../ext/metaclient.cjs');

const config = require('../config');

const makeIbeParametersService = function makeIbeParametersService({ config, MetaClient }) {
    
};

module.exports = {
    makeIbeParametersService,
    IbeParametersService = makeIbeParametersService({ config, MetaClient })
};
