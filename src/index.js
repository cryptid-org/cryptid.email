const config = require('./config');

const Hapi = require('hapi');

const server = new Hapi.server({
    host: config.get('host'),
    port: config.get('port')
});

(async function startServer() {
    try {
        await server.start();
    } catch (err) {
        console.log(err);

        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
})();

