const { VerificationFlow } = require('../email-verification/VerificationFlow');

const index = {
    method: 'GET',
    path: '/',
    handler: {
        view: 'index'
    }
};

const encrypt = {
    method: 'GET',
    path: '/encrypt',
    handler: {
        view: 'encrypt'
    }
};

const decrypt = {
    method: 'GET',
    path: '/decrypt',
    async handler(request, h) {
        const result = await VerificationFlow.createVerificationForm();

        return result.cata(
            err => h.view('erorr', err.message),
            formToken => h.view('decrypt', { formToken })
        );
    }
};

const plugin = {
    name: 'web',
    register(server, options) {
        server.route([
            index,
            encrypt,
            decrypt
        ]);
    }
};

module.exports = plugin;
