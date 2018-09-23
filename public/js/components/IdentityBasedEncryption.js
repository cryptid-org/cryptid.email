import MetaClient from '/js/metaclient/metaclient.esm.js';
import StringifyConverter from '/js/components/StringifyConverter';

const IdentityBasedEncryption = (function IIFE() {
    const client = MetaClient.getInstance();
    const publicKeyConverter = Object.create(StringifyConverter);
    publicKeyConverter.StringifyConverter();

    return {
        IdentityBasedEncryption() {
            // Do nothing.
        },
        encrypt(publicParameters, publicKey, data) {
            const identity = publicKeyConverter.convert(publicKey);

            return client.encrypt(publicParameters, identity, data);
        },
        decrypt(publicParameters, privateKey, ciphertext) {
            return client.decrypt(publicParameters. privateKey, ciphertext);
        }
    }
})();

export default IdentityBasedEncryption;
