module.exports.isNumeric = function(value) {
    return /^\d+$/.test(value);
}

module.exports.getExtension = function(fileName) {
    return fileName.split('.').pop();
}