module.exports = function(array) {
    return array.map(function(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    });
}

