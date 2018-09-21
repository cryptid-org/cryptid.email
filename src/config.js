const convict = require('convict');


const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    port: {
        doc: 'The port the server will listen on.',
        format: 'port',
        default: '8080',
        env: 'PORT'
    },
    host: {
        doc: 'The host the server is running on.',
        format: String,
        default: 'localhost',
        env: 'HOST'
    }
});


config.validate({ allowed: 'strict' });

module.exports = config;
