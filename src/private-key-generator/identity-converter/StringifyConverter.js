/*
 * Must be kept in sync with /public/js/components/StringifyConverter.js
 * 
 * Obviously not the best solution, but a quick'n'dirty one.
 */
const makeStringifyConverter = function makeStringifyConverter() {
    return {
        convert(publicKey) {
            return JSON.stringify(publicKey);
        }
    };
};

module.exports = {
    makeStringifyConverter,
    StringifyConverter: makeStringifyConverter()
};
