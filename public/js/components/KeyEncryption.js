import IdentityBasedEncryption from '/js/components/IdentityBasedEncryption.js';
import Base64 from '/js/third-party/Base64.js';

const KeyEncryption = (function IIFE() {
    return {
        KeyEncryption() {
            // Do nothing.
        },
        async encrypt(publicParameters, publicKey, rawKey) {
            const keyAsBase64 = Base64.fromByteArray(new Uint8Array(rawKey));

            const { ciphertext, success } = await IdentityBasedEncryption.encrypt(publicParameters, publicKey, keyAsBase64);

            return success ? JSON.stringify(ciphertext) : null;
        },
        async decrypt(publicParameters, privateKey, ciphertextString) {
            const ciphertext = JSON.parse(ciphertextString);

            const { plaintext, success } = await IdentityBasedEncryption.decrypt(publicParameters, privateKey, ciphertext);

            return success ? Base64.toByteArray(plaintext) : null;
        }
    }
})();

export default KeyEncryption;
