const CapitalizeArray = require('capitalize-array');

module.exports = {
    'getUsers': function() {
        return CapitalizeArray(['sally','craigs','chris','tom']);
    }
}
