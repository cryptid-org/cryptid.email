const convict = require('convict');


const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test', 'staging'],
        default: 'development',
        env: 'NODE_ENV'
    },
    server: {
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
    },
    emailVerification: {
        sendGrid: {
            apiKey: {
                doc: 'The SendGrid API key.',
                format: String,
                default: 'WILL_NOT_WORK',
                env: 'SENDGRID_API_KEY'
            },
            senderAddress: {
                doc: 'The address that will appear as the sender in emails sent by SendGrid.',
                format: String,
                default: 'verify@cryptid.email',
            }
        },
        formToken: {
            length: {
                doc: 'The length of the form token.',
                format: Number,
                default: 128
            },
            charset: {
                doc: 'The charset used when generating the form token.',
                format: String,
                default: 'alphanumeric'
            },
            placeholder: {
                doc: 'A dummy value used when saving the token.',
                format: String,
                default: 'dummy'
            },
            placeholderExpiration: {
                doc: 'Time to live of the placeholder (in seconds).',
                format: Number,
                default: 600
            }
        },
        verificationToken: {
            length: {
                doc: 'The length of the verification token.',
                format: Number,
                default: 8
            },
            charset: {
                doc: 'The charset used when generating the verification token.',
                format: String,
                default: 'alphanumeric'
            },
            expiration: {
                doc: 'Time to live of the verification token (in seconds).',
                format: Number,
                default: 600
            }
        },
        sign: {
            algorithm: {
                doc: 'The algorithm used to sign the email.',
                format: ['HS256', 'HS384'],
                default: 'HS256',
            },
            expiration: {
                doc: 'The expiration time of the email token.',
                format: String,
                default: '1h'
            },
            secret: {
                doc: 'The secret key used to sign email tokens.',
                format: String,
                default: 'CHANGE_ME',
                env: 'EMAIL_SIGN_SECRET'
            }
        },
        redis: {
            url: {
                doc: 'The url of the email verification Redis instance.',
                format: String,
                default: 'redis://localhost:6379',
                env: 'REDIS_URL'
            }
        },
    },
    ibe: {
        parameterChangeInterval: {
            doc: 'IBE parameters are regenerated (ie. setup is called) periodically using this interval.',
            format: Number,
            default: 1000 * 60 * 60 * 24 * 30, // one month
        },
        securityLevel: {
            doc: 'The security level of the IBE system. Determines the strength of the system.',
            format: ['0', '1', '2', '3', '4'],
            default: '2'
        },
        privateKeyGenerator: {
            identityConverter: {
                doc: 'The strategy used when converting a JSON to an identity string.',
                format: String,
                default: 'StringifyConverter'
            }
        }
    }
});


config.loadFile(`./config/${config.get('env')}.json5`);

config.validate({ allowed: 'strict' });

module.exports = config;
