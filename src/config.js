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
    },
    redis: {
        url: {
            doc: 'The url of the email verification Redis instance.',
            format: String,
            default: 'redis://localhost:6379',
            env: 'REDIS_URL'
        }
    }
});


config.validate({ allowed: 'strict' });

module.exports = config;
