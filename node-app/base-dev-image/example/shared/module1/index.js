const Xregexp = require('xregexp');

module.exports = function() {
    console.log('console log from module1, xregexp version should be 3.1.1');
    console.log('xregexp version is: '+Xregexp.version);
}

