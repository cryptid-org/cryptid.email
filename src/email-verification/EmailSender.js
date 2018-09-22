const sendGridMail = require('@sendgrid/mail');

const config = require('../../config');


const makeEmailSender = function makeEmailSender({ config, sendGridMail }) {
    sendGridMail.setApiKey(config.get('emailVerification.sendGrid.apiKey'));

    return {
        sendCode(recipient, verificationToken) {
            const message = {
                to: recipient,
                from: config.get('emailVerification.sendGrid.senderAddress'),
                subject: 'Your CryptID Verification Code',
                text: `Please enter the following code to verify your email address: ${verificationToken}`,
                html: `Please enter the following code to verify your email address: <pre>${verificationToken}</pre>`
            };

            sendGridMail.send(message);
        }
    }
};


module.exports = {
    makeEmailSender,
    EmailSender: makeEmailSender({ config, sendGridMail })
};
