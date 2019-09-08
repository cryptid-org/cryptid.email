const { Validation } = require('monet');
const sendGridMail = require('@sendgrid/mail');

const logger = require('../logger');
const { EmailSendingError } = require('../exception');
const config = require('../../config');

const makeEmailSender = function makeEmailSender({ config, sendGridMail }) {
    sendGridMail.setApiKey(config.get('emailVerification.sendGrid.apiKey'));

    let sender;
    if (config.get('emailVerification.sendEmails')) {
        sender = sendGridSender.bind(sendGridMail);
    } else {
        sender = nullSender;
    }

    return {
        sendCode(recipient, verificationToken) {
            logger.info('verification token', { verificationToken });
            logger.info(`Sending verification token.`, { recipient });

            const message = {
                from: config.get('emailVerification.sendGrid.senderAddress'),
                to: recipient,
                subject: 'CryptID.email verification code',
                text: `You may verify your email address using the following code: ${verificationToken}.`,
                html: `You may verify your email address using the following code: <pre>${verificationToken}</pre>`
            };
    
            return sender(message);
        }
    }
};

function sendGridSender(sendGridMail, message) {
    try {
        sendGridMail.send(message);

        return Validation.Success();
    } catch (err) {
        logger.warn('Failed to send verification token.', { recipient }, err);

        return Validation.Fail(EmailSendingError(recipient));
    }
};

function nullSender(message) {
    logger.info(message);

    return Validation.Success();
};

module.exports = {
    makeEmailSender,
    EmailSender: makeEmailSender({ config, sendGridMail })
};
