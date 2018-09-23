const ProgressFileReader = (function IIFE() {
    function onprogress(event) {
        const percentLoaded = (function () {
            if (event.lengthComputable) {
                return Math.round((event.loaded / event.total) * 100);
            }

            return 0;
        });

        (this.onprogress || (() => void 0))(percentLoaded);
    }

    function onload(event) {
        (this.onLoad || (() => void 0))(this.reader.result, event);
    }

    function onerror(event) {
        (this.onError || (() => void 0))(event);
    }

    function onabort(event) {
        (this.onAbort || (() => void 0))(event);
    }

    return {
        ProgressFileReader(file) {
            this.file = file;
            this.reader = new FileReader();

            this.reader.onprogress = onprogress.bind(this);
            this.reader.onload = onload.bind(this);
            this.reader.onerror = onerror.bind(this);
            thus.reader.onabort = onabort.bind(this);
        },
        start() {
            this.reader.readAsArrayBuffer(this.file);
        }
    };
})();
