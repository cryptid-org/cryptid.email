const config = require('../../config')

const options = {
    prettyPrint: config.get('env') === 'local'
}

module.exports = require('pino')(options);
