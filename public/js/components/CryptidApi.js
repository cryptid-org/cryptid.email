const CryptidApi = (function IIFE() {
    const currentParametersRequest = '/api/public-parameters'

    return {
        CryptidApi() {
            // Do nothing.
        },
        async getCurrentPublicParameters() {
            const resp = await fetch(currentParametersRequest);

            return resp.json();
        }
    }
})();

export default CryptidApi;
