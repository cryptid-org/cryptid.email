const MetaClient = require('../../ext/metaclient.cjs');

const config = require('../../config');

const { IbeParametersRepository } = require('./repository');

const makeIbeParametersService = function makeIbeParametersService({ config, IbeParametersRepository, MetaClient }) {
    
};

module.exports = {
    makeIbeParametersService,
    IbeParametersService = makeIbeParametersService({ config, IbeParametersRepository, MetaClient })
};
