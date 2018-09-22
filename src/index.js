const path = require('path');

const config = require('./config');

const Hapi = require('hapi');

const server = new Hapi.server({
    host: config.get('host'),
    port: config.get('port')
});

(async function startServer() {
    try {
        await server.register(require('vision'));

        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: path.join(__dirname, '..'),
            path: 'templates'
        })

        await server.register([{
            plugin: require('./api'),
            routes: {
                prefix: '/api'
            }
        }, {
            plugin: require('./web')
        }]);

        await server.start();
    } catch (err) {
        console.log(err);

        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
})();

