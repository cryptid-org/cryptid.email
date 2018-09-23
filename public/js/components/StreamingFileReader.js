const StreamingFileReader = (function IIFE() {
    const DEFAULT_BLOCK_SIZE = 1024 * 1024; // 1 MB

    function onload(event) {
        const currentRead = event.target.result.byteLength;

        this.totalRead += currentRead;

        const onProgressHandler = (this.onProgress || (() => void 0));

        onProgressHandler({
            currentRead,
            totalRead: this.totalRead,
            totalSize: this.totalSize,
            percent: Math.round(this.totalRead / this.totalSize * 100),
            buffer: event.target.result
        });

        if (this.totalRead < this.totalSize) {
            const end = this.totalRead + this.blockSize;

            this.reader.readAsArrayBuffer(this.file.slice(this.totalRead, Math.min(end, this.totalSize)));
        } else {
            const onLoadHandler = (this.onLoad || (() => void 0));

            setTimeout(() => onLoadHandler({
                totalRead: this.totalRead,
                totalSize: this.totalSize,
                percent: 100
            }), 0);
        }
    }

    function onerror(event) {
        (this.onError || (() => void 0))(event);
    }

    function onabort(event) {
        (this.onAbort || (() => void 0))(event);
    }

    return {
        StreamingFileReader(file, blockSize = DEFAULT_BLOCK_SIZE) {
            this.file = file;
            this.blockSize = blockSize;

            this.totalSize = file.size;
            this.totalRead = 0;
            this.reader = new FileReader();

            this.reader.onload = onload.bind(this);
            this.reader.onerror = onerror.bind(this);
            this.reader.onabort = onabort.bind(this);
        },
        start() {
            console.log(this);
            this.reader.readAsArrayBuffer(this.file.slice(0, Math.min(this.totalSize, this.blockSize)));
        }
    };
})();

export default StreamingFileReader;
