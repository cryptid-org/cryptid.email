const publicParameters = require('./public-parameters');

const email = {
    verify: {
        POST: {
            method: 'POST',
            path: '/email/verify',
            handler(request, h) {
                return 'Verify email.';
            },
            options: {
                description: 'Initiates the email verification process.'
            }
        }
    }
};

const privateKey = {
    POST: {
        method: 'POST',
        path: '/private-key',
        handler(request, h) {

        },
        options: {
            description: 'Returns the private key corresponding to the specified public key.'
        }
    }
};

const plugin = {
    name: 'api',
    register(server, options) {
        server.route([
            publicParameters.GET,
            email.verify.POST,
            privateKey.POST
        ]);
    }
};

module.exports = plugin;
