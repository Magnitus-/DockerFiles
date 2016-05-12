const CapitalizeArray = require('capitalize-array');
const SortArray = require('sort-array');

module.exports = {
    'getUsers': function() {
        return SortArray(CapitalizeArray(['sally','craigs','chris','tom']));
    }
}
