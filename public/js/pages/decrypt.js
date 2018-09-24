import PreallocatingFileReader from '/js/components/PreallocatingFileReader.js'
import CryptidApi from '/js/components/CryptidApi.js';
import CryptidFile from '/js/components/CryptidFile.js';
import KeyEncryption from '/js/components/KeyEncryption.js';
import SymmetricCrypto from '/js/components/SymmetricCrypto.js';
import { saveAs } from '/js/third-party/FileSaver.js';

const View = (function IIFE() {
    let requestCodeHandler = null;
    let requestVerificationHandler = null;
    let requestDecryptionHandler = null;

    return {
        get formToken() {
            return document.getElementById('form-token').value;
        },
        get emailAddressToVerify() {
            return document.getElementById('address-to-verify').value;
        },
        set onCodeRequested(handler) {
            const requestCodeButton = document.getElementById('request-code-button');

            if (requestCodeHandler) {
                requestCodeButton.removeEventListener('click', requestCodeHandler);
            }

            requestCodeHandler = handler;

            requestCodeButton.addEventListener('click', requestCodeHandler);
        },
        showVerificationCodeForm() {
            document.getElementById('verification-code-form').classList.remove('hidden');
        },

        get verificationCode() {
            return document.getElementById('verification-code').value;
        },
        set onVerificationRequested(handler) {
            const requestVerificationButton = document.getElementById('verify-button');

            if (requestVerificationHandler) {
                requestVerificationButton.removeEventListener('click', requestVerificationHandler);
            }

            requestVerificationHandler = handler;

            requestVerificationButton.addEventListener('click', requestVerificationHandler);
        },
        showFileSelectorForm() {
            document.getElementById('file-selector-form').classList.remove('hidden');
        },

        get fileToDecrypt() {
            const [ file ]  = document.getElementById('file-to-decrypt').files;

            return file;
        },
        set onDecryptionRequested(handler) {
            const requestDecryptionButton = document.getElementById('decrypt-button');

            if (requestDecryptionHandler) {
                requestDecryptionButton.removeEventListener('click', requestDecryptionHandler);
            }

            requestDecryptionHandler = handler;

            requestDecryptionButton.addEventListener('click', requestDecryptionHandler);
        },
    };
}());

// Quick'n'dirty
const Store = Object.create(null);
const api = Object.create(CryptidApi);
api.CryptidApi();

View.onCodeRequested = async function onRequestCodeClick() {
    const email = View.emailAddressToVerify;

    await api.initiateEmailVerification(email, View.formToken);

    View.showVerificationCodeForm();
};

View.onVerificationRequested = async function onRequestVerificationClick() {
    const verificatonToken = View.verificationCode;
    const formToken = View.formToken;

    Store.emailToken = await api.getEmailToken(formToken, verificatonToken);
    
    View.showFileSelectorForm();
}

View.onDecryptionRequested = async function onRequestDecryptionClick() {
    const fileArray = await readFile(View.fileToDecrypt);

    const contents = await parseContents(fileArray);

    const rawSymmetricKey = await obtainRawSymmetricKey(contents);

    const decryptedContents = await decryptData(rawSymmetricKey, contents);

    const fileBlob = new Blob([decryptedContents], { type: "application/octet-stream" });

    saveAs(fileBlob, contents.filenameString);
};

function readFile(file) {
    console.log(file);

    return new Promise((resolve, reject) => {
        const reader = Object.create(PreallocatingFileReader);
    
        reader.PreallocatingFileReader(file);
        reader.onLoad = ({ buffer }) => resolve(buffer);
        reader.onError = reject;
        reader.onAbort = reject;

        reader.start();
    });
}

function parseContents(fileArray) {
    const cf = Object.create(CryptidFile);
    cf.CryptidFile();

    return cf.parse(fileArray);
}

async function obtainRawSymmetricKey({ parametersIdString, keyCiphertextString }) {
    const privateKey = await api.getPrivateKey(Store.emailToken, parametersIdString);
    console.log(privateKey);

    const ke = Object.create(KeyEncryption);
    ke.KeyEncryption();

    const publicParameters = await api.getPublicParametersForId(parametersIdString);
    console.log(publicParameters);
    
    return ke.decrypt(publicParameters, privateKey, keyCiphertextString);
}

async function decryptData(rawSymmetricKey, { iv, dataCiphertext }) {
    const sc = Object.create(SymmetricCrypto);
    sc.SymmetricCrypto();

    const key = await sc.importKey(rawSymmetricKey);
    
    return sc.decrypt(key, dataCiphertext, iv);
}
