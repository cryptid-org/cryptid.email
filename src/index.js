const path = require('path');

const config = require('../config');

const Hapi = require('hapi');

const server = new Hapi.server({
    port: config.get('server.port'),
    host: config.get('server.host'),
    routes: {
        files: {
            relativeTo: path.join(__dirname, '..', 'public')
        }
    }
});

(async function startServer() {
    try {
        await server.register([require('vision'), require('inert')]);

        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: path.join(__dirname, '..'),
            path: 'templates'
        });

        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: '.'
                }
            }
        });

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


process.on('unhandledRejection', err => {
    console.log(err);
});
