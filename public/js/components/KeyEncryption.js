import IdentityBasedEncryption from '/js/components/IdentityBasedEncryption.js';
import Base64 from '/js/third-party/Base64.js';

const KeyEncryption = (function IIFE() {
    return {
        KeyEncryption() {
            // Do nothing.
        },
        async encrypt(publicParameters, publicKey, rawKey) {
            const keyAsBase64 = Base64.fromByteArray(new Uint8Array(rawKey));

            const ciphertext = await IdentityBasedEncryption.encrypt(publicParameters, publicKey, keyAsBase64);

            return JSON.stringify(ciphertext);
        },
        async decrypt(publicParameters, privateKey, ciphertextString) {
            const ciphertext = JSON.parse(ciphertextString);

            const keyAsBase64 = await IdentityBasedEncryption.decrypt(publicParameters, privateKey, ciphertext);

            return Base64.toByteArray(keyAsBase64);
        }
    }
})();

export default KeyEncryption;
