import IntArrayConverter from '/js/components/IntArrayConverter.js';

const CryptidFile = (function IIFE() {
    const SIZE_BYTE_LENGTH = 8;

    const converter = Object.create(IntArrayConverter);
    converter.IntArrayConverter();

    function assembleFile(...arrays) {
        const parts = arrays
            .map(arr => new Uint8Array(arr))
            .map(arr => ({ 
                lengthArray: converter.toByteArray(arr.length), 
                dataArray: arr 
            }));
        
        const totalLength = parts.reduce((acc, curr) => acc + curr.lengthArray.length + curr.dataArray.length, 0);

        const fileArray = new ArrayBuffer(totalLength);
        const fileArrayView = new Uint8Array(fileArray);

        let pointer = 0;
        for (const { lengthArray, dataArray } of parts) {
            fileArrayView.set(lengthArray, pointer);
            pointer += lengthArray.length;

            fileArrayView.set(dataArray, pointer);
            pointer += dataArray.length;
        }

        return fileArray;
    }

    function readNextPart(view, offset) {
        let pointer = offset;
        const lengthArray = view.slice(pointer, pointer + SIZE_BYTE_LENGTH);
        const partLength = converter.fromByteArray(lengthArray);
        pointer += SIZE_BYTE_LENGTH;

        const dataArray = view.slice(pointer, pointer + partLength);
        pointer += partLength;

        return { 
            dataArray,
            pointer
        };
    }

    function parseFile(fileArray) {
        const fileArrayView = new Uint8Array(fileArray);

        const result = {};

        let pointer = 0;
        for (const chunkName of ['filenameArray', 'parametersIdArray', 'iv', 'keyCiphertextArray', 'dataCiphertext']) {
            let readResult = readNextPart(fileArrayView, pointer);
            pointer = readResult.pointer;
            result[chunkName] = readResult.dataArray;
        }

        return result;
    }

    return {
        CryptidFile() {
            this.encoder = new TextEncoder();
            this.decoder = new TextDecoder();
        },
        async build({ filenameString, parametersIdString, iv, keyCiphertextString, dataCiphertext }) {
            const filenameArray = this.encoder.encode(filenameString);
            const keyCiphertextArray = this.encoder.encode(keyCiphertextString);
            const parametersIdArray = this.encoder.encode(parametersIdString);

            return assembleFile(filenameArray, parametersIdArray, iv, keyCiphertextArray, dataCiphertext);
        },
        async parse(fileArray) {
            const { filenameArray, parametersIdArray, iv, keyCiphertextArray, dataCiphertext } = parseFile(fileArray);

            const filenameString = this.decoder.decode(filenameArray);
            const parametersIdString = this.decoder.decode(parametersIdArray);
            const keyCiphertextString = this.decoder.decode(keyCiphertextArray);

            return {
                filenameString,
                parametersIdString,
                iv,
                keyCiphertextString,
                dataCiphertext
            };
        }
    }
})();

export default CryptidFile;
