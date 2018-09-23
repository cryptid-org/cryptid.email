/*
 * Conversion code created by Ben Reeves - https://stackoverflow.com/questions/8482309/converting-javascript-integer-to-byte-array-and-back
 */
const IntArrayConverter = (function IIFE() {
    return {
        IntArrayConverter() {
            // Do nothing.
        },
        fromByteArray(arr) {
            const x = new Uint8Array(arr);
            var val = 0;
            for (var i = 0; i < x.length; ++i) {        
                val += x[i];        
                if (i < x.length-1) {
                    val = val << 8;
                }
            }
            return val;
        },
        toByteArray(x) {
            var bytes = [];
            var i = 8;
            do {
            bytes[--i] = x & (255);
            x = x>>8;
            } while (i);
            const arr = new ArrayBuffer(8);
            const arrView = new Uint8Array(arr);

            arrView.set(bytes, 0);

            return arrView;
        }
    };
})();

export default IntArrayConverter;
