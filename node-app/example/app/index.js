//Sample app that prints all the users in a mock database
//The database entrypoints would be shared modules accross apps
var UserStore = require('shared_modules/user-store');

var users = UserStore.getUsers();

users.forEach(function(user) {
    console.log(user);
});
