import PreallocatingFileReader from '/js/components/PreallocatingFileReader.js'
import SymmetricCrypto from '/js/components/SymmetricCrypto.js';
import CryptidApi from '/js/components/CryptidApi.js';
import KeyEncryption from '/js/components/KeyEncryption.js';
import CryptidFile from '/js/components/CryptidFile.js';
import { saveAs } from '/js/third-party/FileSaver.js';

const fileInput = document.getElementById('file-to-encrypt');
const emailInput = document.getElementById('recipient-address');
const encryptButton = document.getElementById('encrypt-button');
const saveButton = document.getElementById('save-button');

const fileNameLabel = document.getElementById('file-name');

const encryptContainer = document.getElementById('encrypt-container');
const encryptOverlay = document.getElementById('encrypt-overlay');
const encryptionProgress = document.getElementById('encryption-progress');
const encryptionDone = document.getElementById('encryption-done');

const data = {};

saveButton.addEventListener('click', function onSaveClick() {
    saveAs(data.cryptidBlob, `${data.filename}.cryptid`);
});

encryptButton.addEventListener('click', async function onEncryptClick() {
    const [ file ] = fileInput.files;
    const email = emailInput.value;

    data.filename = file.name;

    encryptContainer.style.filter = 'blur(5px)';
    encryptOverlay.classList.remove('hidden');
    encryptOverlay.classList.add('flex');
    encryptionProgress.classList.remove('hidden');
    encryptionProgress.classList.add('flex');

    const contents = await readFile(file);

    const contentEncryptionResult = await encryptContents(contents);

    const { keyCiphertext, parametersId } = await encryptContentEncryptionKey(contentEncryptionResult.rawContentEncryptionKey, email);

    data.cryptidBlob = await embedIntoCryptidFile(file.name, parametersId, contentEncryptionResult.iv,
                                                   keyCiphertext, contentEncryptionResult.ciphertext);

    encryptionProgress.classList.remove('flex');
    encryptionProgress.classList.add('hidden');

    encryptionDone.classList.remove('hidden');
    encryptionDone.classList.add('flex');
});

fileInput.addEventListener('change', function onFileSelected() {
    const [ file ] = fileInput.files;

    fileNameLabel.textContent = file.name;
});

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

async function encryptContents(contents) {
    const sc = Object.create(SymmetricCrypto);
    sc.SymmetricCrypto();

    const encryptionKey = await sc.generateKey();

    const { ciphertext, iv } = await sc.encrypt(encryptionKey, contents);

    const rawKey = await sc.exportKey(encryptionKey);

    return {
        ciphertext,
        iv,
        rawContentEncryptionKey: rawKey
    };
}

async function encryptContentEncryptionKey(rawKey, email) {
    const api = Object.create(CryptidApi);
    api.CryptidApi();

    const parameters = await api.getCurrentPublicParameters();

    const ke = Object.create(KeyEncryption);
    ke.KeyEncryption();

    const publicKey = {
        email
    };

    const keyCiphertext = await ke.encrypt(parameters.publicParameters, publicKey, rawKey);

    return {
        keyCiphertext,
        parametersId: parameters.id
    };
}

async function embedIntoCryptidFile(filename, parametersId, iv, keyCiphertext, dataCiphertext) {
    const cf = Object.create(CryptidFile);
    cf.CryptidFile();

    const fileArray = await cf.build({
        filenameString: filename,
        parametersIdString: parametersId,
        iv,
        keyCiphertextString: keyCiphertext,
        dataCiphertext
    });

    return new Blob([fileArray], { type: "application/octet-stream" });
}
