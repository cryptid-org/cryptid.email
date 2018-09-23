const SymmetricCrypto = (function IIFE() {
    const ALGORITHM = 'AES-GCM'
    const KEY_LENGTH = 256;
    const KEY_FORMAT = 'raw';

    const KEY_OPTIONS = {
        name: ALGORITHM,
        length: KEY_LENGTH
    };

    const IV_LENGTH = 128;
    const TAG_LENGTH = 128;

    const makeEncryptDecryptAlgo = iv => ({
        name: ALGORITHM,
        iv,
        tagLength: TAG_LENGTH
    });

    return {
        SymmetricCrypto() {
            // Do nothing.
        },
        generateKey() {
            return window.crypto.subtle.generateKey(KEY_OPTIONS, true, ['encrypt']);
        },
        exportKey(key) {
            return window.crypto.subtle.exportKey(KEY_FORMAT, key);
        },
        importKey(buffer) {
            return window.crypto.subtle.importKey(KEY_FORMAT, buffer, KEY_OPTIONS, false, ['decrypt'])
        },
        async encrypt(key, plaintext) {
            const iv = new ArrayBuffer(IV_LENGTH);
            crypto.getRandomValues(new Uint8Array(iv));

            const algo = makeEncryptDecryptAlgo(iv);

            const ciphertext = await crypto.subtle.encrypt(algo, key, plaintext);

            return {
                ciphertext,
                iv
            };
        },
        decrypt(key, ciphertext, iv) {
            const algo = makeEncryptDecryptAlgo(iv);

            return crypto.subtle.decrypt(algo, key, ciphertext);
        }
    };
})();

export default SymmetricCrypto;
