import PreallocatingFileReader from '/js/components/PreallocatingFileReader.js'
import CryptidApi from '/js/components/CryptidApi.js';
import CryptidFile from '/js/components/CryptidFile.js';
import KeyEncryption from '/js/components/KeyEncryption.js';
import SymmetricCrypto from '/js/components/SymmetricCrypto.js';
import { saveAs } from '/js/third-party/FileSaver.js';

const fileNameLabel = document.getElementById('file-name');

const decryptContainer = document.getElementById('decrypt-container');
const decryptOverlay = document.getElementById('decrypt-overlay');
const decryptionProgress = document.getElementById('decryption-progress');
const decryptionDone = document.getElementById('decryption-done');

const decryptEmailPanel = document.getElementById('decrypt-email-panel');
const decryptTokenPanel = document.getElementById('decrypt-token-panel');
const decryptFilePanel = document.getElementById('decrypt-file-panel');

const toTokenPanelButton = document.getElementById('to-token-panel-button');
const toDecryptFilePanelButton = document.getElementById('to-decrypt-file-panel-button');

const tokenError = document.getElementById('token-error');
const decryptError = document.getElementById('decrypt-error');

const formTokenInput = document.getElementById('form-token');

const fileToDecryptInput = document.getElementById('file-to-decrypt');

const data = {};

const saveButton = document.getElementById('save-button');

saveButton.addEventListener('click', function onSaveButtonClick() {
    saveAs(data.fileBlob, data.filename);
});

fileToDecryptInput.addEventListener('change', function onFileToDecryptInputChange() {
    const [ file ] = fileToDecryptInput.files;

    fileNameLabel.textContent = file.name;

    decryptError.classList.add('hidden');
});

formTokenInput.addEventListener('click', function onFormTokenInputClick() {
    tokenError.classList.add('is-invisible');
    formTokenInput.classList.remove('is-danger');
});

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
            const toTokenPanelButton = document.getElementById('to-token-panel-button');

            if (requestCodeHandler) {
                toTokenPanelButton.removeEventListener('click', requestCodeHandler);
            }

            requestCodeHandler = handler;

            toTokenPanelButton.addEventListener('click', requestCodeHandler);
        },
        showVerificationCodeForm() {
            decryptEmailPanel.classList.add('hidden');
            decryptTokenPanel.classList.remove('hidden');
        },

        get verificationCode() {
            return document.getElementById('verification-code').value;
        },
        set onVerificationRequested(handler) {
            const toDecryptFilePanelButton = document.getElementById('to-decrypt-file-panel-button');

            if (requestVerificationHandler) {
                toDecryptFilePanelButton.removeEventListener('click', requestVerificationHandler);
            }

            requestVerificationHandler = handler;

            toDecryptFilePanelButton.addEventListener('click', requestVerificationHandler);
        },
        showFileSelectorForm() {
            decryptTokenPanel.classList.add('hidden');
            decryptFilePanel.classList.remove('hidden');
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

View.onCodeRequested = function onRequestCodeClick() {
    const email = View.emailAddressToVerify;

    api.initiateEmailVerification(email, View.formToken);

    View.showVerificationCodeForm();
};

View.onVerificationRequested = async function onRequestVerificationClick() {
    const verificatonToken = View.verificationCode;
    const formToken = View.formToken;

    const emailToken = await api.getEmailToken(formToken, verificatonToken);

    if (!emailToken) {
        tokenError.classList.remove('is-invisible');
        formTokenInput.classList.add('is-danger');
    } else {
        Store.emailToken = emailToken;
        View.showFileSelectorForm();
    }
}

View.onDecryptionRequested = async function onRequestDecryptionClick() {
    decryptContainer.style.filter = 'blur(5px)';
    decryptOverlay.classList.remove('hidden');
    decryptOverlay.classList.add('flex');
    decryptionProgress.classList.remove('hidden');
    decryptionProgress.classList.add('flex');

    try {
        const fileArray = await readFile(View.fileToDecrypt);

        const contents = await parseContents(fileArray);

        const rawSymmetricKey = await obtainRawSymmetricKey(contents);

        if (!rawSymmetricKey) {
            throw new Error('Unable to decrypt symmetric key!');
        }

        const decryptedContents = await decryptData(rawSymmetricKey, contents);

        data.fileBlob = new Blob([decryptedContents], { type: "application/octet-stream" });
        data.filename = contents.filenameString;

        decryptionProgress.classList.remove('flex');
        decryptionProgress.classList.add('hidden');

        decryptionDone.classList.remove('hidden');
        decryptionDone.classList.add('flex');
    } catch (err) {
        console.log(err);

        decryptContainer.style.filter = '';
        decryptOverlay.classList.add('hidden');
        decryptOverlay.classList.remove('flex');
        decryptionProgress.classList.add('hidden');
        decryptionProgress.classList.remove('flex');

        decryptError.classList.remove('hidden');
    }
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

    if (!privateKey) {
        return null;
    }

    const ke = Object.create(KeyEncryption);
    ke.KeyEncryption();

    const parameters = await api.getPublicParametersForId(parametersIdString);
    console.log(parameters);
    
    return ke.decrypt(parameters.publicParameters, privateKey, keyCiphertextString);
}

async function decryptData(rawSymmetricKey, { iv, dataCiphertext }) {
    const sc = Object.create(SymmetricCrypto);
    sc.SymmetricCrypto();

    const key = await sc.importKey(rawSymmetricKey);
    
    return sc.decrypt(key, dataCiphertext, iv);
}
