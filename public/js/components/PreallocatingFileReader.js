import StreamingFileReader from '/js/components/StreamingFileReader.js';

const PreallocatingFileReader = (function IIFE() {
    const DEFAULT_BLOCK_SIZE = 1024 * 1024; // 1 MB

    function onProgress(event) {
        const readBuffer = event.buffer;
        const readBufferView = new Uint8Array(readBuffer);

        this.view.set(readBufferView, this.pointer);

        this.pointer += event.currentRead;

        const handler = (this.onProgress || (() => void 0));

        handler(event);
    }

    function onLoad(event) {
        const handler = (this.onLoad || (() => void 0));

        handler(Object.assign({ buffer: this.buffer }, event));
    }

    function onError(event) {
        (this.onError || (() => void 0))(event);
    }

    function onAbort(event) {
        (this.onAbort || (() => void 0))(event);
    }

    return {
        PreallocatingFileReader(file, blockSize = DEFAULT_BLOCK_SIZE) {
            this.reader = Object.create(StreamingFileReader);
            this.reader.StreamingFileReader(file, blockSize);

            this.reader.onLoad = onLoad.bind(this);
            this.reader.onProgress = onProgress.bind(this);
            this.reader.onError = onError.bind(this);
            this.reader.onAbort = onAbort.bind(this);

            this.pointer = 0;

            this.buffer = new ArrayBuffer(this.reader.totalSize);
            this.view = new Uint8Array(this.buffer);
        },
        start() {
            this.reader.start();
        }
    };
})();

export default PreallocatingFileReader;
