const publicParameters = {
    GET: {
        method: 'GET',
        path: '/public-parameters',
        handler(request, h) {
            return 'public parameters';
        }
    }
};

const plugin = {
    name: 'api',
    register(server, options) {
        server.route(publicParameters.GET);
    }
};

module.exports = plugin;
