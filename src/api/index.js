const publicParameters = require('./public-parameters');

const verification = require('./verification');

const privateKey = require('./private-key');

const plugin = {
    name: 'api',
    register(server, options) {
        server.route([
            publicParameters.GET,
            verification.emailAddress.POST,
            verification.emailToken.POST,
            privateKey.POST
        ]);
    }
};

module.exports = plugin;
