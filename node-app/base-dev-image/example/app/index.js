const Xregexp = require('xregexp');
const Bluebird = require('bluebird');

(require('module1')());
(require('module2')());

console.log('console log from main, xregexp version should be 3.1.1');
console.log('xregexp version is: '+Xregexp.version);
