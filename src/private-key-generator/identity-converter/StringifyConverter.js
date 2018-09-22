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
