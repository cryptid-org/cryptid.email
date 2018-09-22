const index = {
    method: 'GET',
    path: '/',
    handler: {
        view: 'index'
    }
}

const plugin = {
    name: 'web',
    register(server, options) {
        server.route([
            index
        ]);
    }
};

module.exports = plugin;
