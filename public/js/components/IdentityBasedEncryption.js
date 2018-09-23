import MetaClient from '/js/metaclient/metaclient.esm.js';
import StringifyConverter from '/js/components/StringifyConverter.js';

const IdentityBasedEncryption = (function IIFE() {
    const clientPromise = MetaClient.getInstance();
    const publicKeyConverter = Object.create(StringifyConverter);
    publicKeyConverter.StringifyConverter();

    return {
        IdentityBasedEncryption() {
            // Do nothing.
        },
        async encrypt(publicParameters, publicKey, data) {
            const identity = publicKeyConverter.convert(publicKey);

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
