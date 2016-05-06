#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

//Link all shared modules globally
fs.readdirSync(process.env.SHARED_DIR).forEach(function(dirname) {
    process.chdir(path.join(process.env.SHARED_DIR, dirname));
    childProcess.execSync("npm link");
});

//Resolve dependencies
var directories = [process.env.APP_DIR].concat(fs.readdirSync(process.env.SHARED_DIR).map(function(directory) {
    return path.join(process.env.SHARED_DIR, directory);
}));

directories.forEach(function(directory) {
    process.chdir(directory);
    var package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
    if(package.localDependencies)
    {
        package.localDependencies.forEach(function(localDependency) {
            childProcess.execSync("npm link "+localDependency);
        });
    }
});
