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

    return {
        CryptidFile() {
            this.encoder = new TextEncoder();
            this.decoder = new TextDecoder();
        },
        async build({ filenameString, iv, keyCiphertextString, dataCiphertext }) {
            const filenameArray = this.encoder.encode(filenameString);

            const keyCiphertextArray = this.encoder.encode(keyCiphertextString);

            return assembleFile(filenameArray, iv, keyCiphertextArray, dataCiphertext);
        }
    }
})();

export default CryptidFile;
