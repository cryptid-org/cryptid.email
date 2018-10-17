const path = require('path');

const config = require('../config');
const logger =  require('./logger');

const Hapi = require('hapi');

const server = new Hapi.server({
    port: config.get('server.port'),
    //host: config.get('server.host'),
    routes: {
        files: {
            relativeTo: path.join(__dirname, '..', 'public')
        }
    }
});

(async function startServer(server) {
    try {
        await logging(server); 
        
        await templating(server);
        
        await staticFileServing(server);

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
        logger.error('Could not start server.', err);

        process.exit(1);
    }

    logger.info('Server running at:', server.info.uri);
})(server);

async function logging(server) {
    const options = {
        prettyPrint: config.get('env') !== 'production',
        level: config.get('env') == 'development' ? 'debug' : 'info',
        instance: require('./logger')
    };

    await server.register({
        plugin: require('hapi-pino'),
        options
    });
}

async function templating(server) {
    await server.register([require('vision'), require('inert')]);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: path.join(__dirname, '..'),
        path: 'templates'
    });
}

async function staticFileServing(server) {
    let options = {};
    if (config.get('env') == 'development') {
        options = {
            cache: {
                expiresIn: 1,
                privacy: 'private'
            }
        };
    }

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.'
            }
        },
        options
    });
}

process.on('unhandledRejection', err => {
    logger.error('Unhandled rejection', err);
});

process.on('uncaughtError', err => {
    logger.error('Uncaught exception', err);
});
