/*
 * Must be kept in sync with /src/private-key-generator/StringifyConverter.js
 * 
 * Obviously not the best solution, but a quick'n'dirty one.
 */
const StringifyConverter = (function IIFE() {
    return {
        StringifyConverter() {
            // Do nothing.
        },
        convert(publicKey) {
            return JSON.stringify(publicKey);
        }
    };
})();

export default StringifyConverter;
