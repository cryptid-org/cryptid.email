const IdentityBasedEncryption = (function IIFE() {
    const clientPromise = CryptID.default.getInstance();

    return {
        IdentityBasedEncryption() {
            // Do nothing.
        },
        async encrypt(publicParameters, publicKey, data) {
            const identity = publicKey;

            const instance = await clientPromise;

            return instance.encrypt(publicParameters, identity, data);
        },
        async decrypt(publicParameters, privateKey, ciphertext) {
            const instance = await clientPromise;

            return instance.decrypt(publicParameters, privateKey, ciphertext);
        }
    }
})();

export default IdentityBasedEncryption;
