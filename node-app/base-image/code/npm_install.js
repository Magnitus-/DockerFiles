#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
var actOnModules = require('act-on-modules');
Promise = require('bluebird');

var childProcessExec = Promise.promisify(childProcess.exec, {'multiArgs': true});
var installPromises = [];

function npmInstall(directory)
{
    console.log('Npm install in directory: ' + directory);
    installPromises.push(childProcessExec("npm install --production", {'cwd': directory}));
}

Promise.all([actOnModules(process.env.APP_DIR, npmInstall), 
             actOnModules(process.env.SHARED_DIR, npmInstall)]).then(() => {
    Promise.all(installPromises).then((results) => {
        results.forEach((result) => {
            console.log(result[0]);
            console.log(result[1]);
        });
            
        if(process.env.NPM_MODULES)
        {
            var modules = process.env.NPM_MODULES.replace(' ','').split(';');
            if(modules.length > 0)
            {
                process.chdir(process.env.HOME_DIR);
                modules.forEach(function(module) {
                    childProcess.execSync("npm install "+module);
                });
            }
            
        }
    }).catch((err) => {
        console.log('npm install failed...');
        console.log(err);
    });
}).catch((err) => {
    console.log('npm install failed...');
    console.log(err);
});
