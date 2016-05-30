const Xregexp = require('xregexp');

module.exports = function() {
    console.log('console log from module2, xregexp version should be undefined');
    console.log('xregexp version is: '+Xregexp.version);
}

