const CryptidApi = (function IIFE() {
    return {
        CryptidApi() {
            // Do nothing.
        },
        async getCurrentPublicParameters() {
            const resp = await fetch('/api/public-parameters');

            return resp.json();
        },
        async deleteMe(email, parametersId) {
            const resp = await fetch('/api/delete-me', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ email, parametersId }),
            });

            const { privateKey } = await resp.json();

            return privateKey;
        }
    };
})();

export default CryptidApi;
