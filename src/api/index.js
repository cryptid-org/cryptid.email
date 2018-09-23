const config = require('../../config');

const publicParameters = require('./public-parameters');
const verification = require('./verification');
const privateKey = require('./private-key');
const deleteMe = require('./delete-me');

const plugin = {
    name: 'api',
    register(server, options) {
        server.route([
            publicParameters.GET,
            verification.emailAddress.POST,
            verification.emailToken.POST,
            privateKey.POST
        ]);

        if (config.get('env') == 'development') {
            server.route(deleteMe.POST);
        }
    }
};

module.exports = plugin;
