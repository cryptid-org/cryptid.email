const { Validation } = require('monet');
const sendGridMail = require('@sendgrid/mail');

const logger = require('../logger');
const { EmailSendingError } = require('../exception');
const config = require('../../config');

const makeEmailSender = function makeEmailSender({ config, sendGridMail }) {
    sendGridMail.setApiKey(config.get('emailVerification.sendGrid.apiKey'));

    return {
        sendCode(recipient, verificationToken) {
            logger.info(`Sending verification token.`, { recipient });

            const message = {
                to: recipient,
                from: config.get('emailVerification.sendGrid.senderAddress'),
                subject: 'Your CryptID Verification Code',
                text: `Please enter the following code to verify your email address: ${verificationToken}`,
                html: `Please enter the following code to verify your email address: <pre>${verificationToken}</pre>`
            };
    
            try {
                sendGridMail.send(message);

                return Validation.Success();
            } catch (err) {
                logger.warn('Failed to send verification token.', { recipient }, err);

                return Validation.Fail(EmailSendingError(recipient));
            }
        }
    }
};


module.exports = {
    makeEmailSender,
    EmailSender: makeEmailSender({ config, sendGridMail })
};
