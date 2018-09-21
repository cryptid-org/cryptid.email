const sendGridMail = require('@sendgrid/mail');

const config = require('../config');


const makeEmailSender = function makeEmailSender({ config, sendGridMail }) {
    sendGridMail.setApiKey(config.get('sendGrid.apiKey'));

    return {
        sendCode(recipient, verificationCode) {
            const message = {
                to: recipient,
                from: config.get('sendGrid.senderAddress'),
                subject: 'Your CryptID Verification Code',
                text: `Please enter the following code to verify your email address: ${verificationCode}`,
                html: `Please enter the following code to verify your email address: <pre>${verificationCode}</pre>`
            };

            sendGridMail.send(message);
        }
    }
};


module.exports = {
    makeEmailSender,
    EmailSender: makeEmailSender({ config, sendGridMail })
};
