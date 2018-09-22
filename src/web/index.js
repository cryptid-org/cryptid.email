const { VerificationFlow } = require('../email-verification/VerificationFlow');

const index = {
    method: 'GET',
    path: '/',
    handler: {
        view: 'index'
    }
}

const decrypt = {
    method: 'GET',
    path: '/decrypt',
    async handler(request, h) {
        const formToken = await VerificationFlow.createVerificationForm();

        return h.view('decrypt', { formToken });
    }
};

const plugin = {
    name: 'web',
    register(server, options) {
        server.route([
            index,
            decrypt
        ]);
    }
};

module.exports = plugin;
