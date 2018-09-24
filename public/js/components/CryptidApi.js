const CryptidApi = (function IIFE() {
    return {
        CryptidApi() {
            // Do nothing.
        },
        async getCurrentPublicParameters() {
            const resp = await fetch('/api/public-parameters');

            return resp.json();
        },
        async getPublicParametersForId(id) {
            const resp = await fetch(`/api/public-parameters?id=${id}`);

            return resp.json();
        },
        async deleteMe(email, parametersId) {
            const resp = await fetch('/api/delete-me', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ email, parametersId })
            });

            const { privateKey } = await resp.json();

            return privateKey;
        },
        initiateEmailVerification(email, formToken) {
            return fetch('/api/verification/email/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ email, formToken })
            });
        },
        async getEmailToken(formToken, verificationToken) {
            const resp = await fetch('/api/verification/email/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ formToken, verificationToken })
            });

            const { emailToken } = await resp.json();

            return emailToken;
        },
        async getPrivateKey(emailToken, parametersId) {
            const resp = await fetch('/api/private-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ emailToken, parametersId })
            });

            const { privateKey } = await resp.json();

            return privateKey;
        }
    };
})();

export default CryptidApi;
