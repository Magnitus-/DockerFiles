#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
var actOnModules = require('act-on-modules');
Promise = require('bluebird');

var childProcessExec = Promise.promisify(childProcess.exec, {'multiArgs': true});
var fsReadFile = Promise.promisify(fs.readFile);

var globalLinkPromises = [];

function linkGlobally(directory)
{
    console.log('Creating global link for directory: ' + directory);
    globalLinkPromises.push(childProcessExec("npm link", {'cwd': directory}));
}

var dependencyLinkPromises = [];

function resolveDependencies(directory)
{
    console.log('Resolving dependencies in directory: ' + directory);
    return fsReadFile(path.join(directory, 'package.json'), 'utf8').then((package) => {
        var package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
        if(package.localDependencies)
        {
            var promises = [];
            package.localDependencies.forEach(function(localDependency) {
                promises.push(childProcessExec("npm link "+localDependency, {'cwd': directory}));
            });
            if(promises.length > 0)
            {
                return Promise.all(promises);
            }
        }
    })

}

//Link shared modules globally
actOnModules(process.env.SHARED_DIR, linkGlobally).then(() => {
    Promise.all(globalLinkPromises).then((results) => {
        results.forEach((result) => {
            console.log(result[0]);
            console.log(result[1]);
        });
        
        //Resolve dependencies
        Promise.all([actOnModules(process.env.APP_DIR, resolveDependencies),
                     actOnModules(process.env.SHARED_DIR, resolveDependencies)]).then(() => {
            Promise.all(dependencyLinkPromises).catch((err) => {
                console.log('npm link failed...');
                console.log(err);
            });
        }).catch((err) => {
            console.log('npm link failed...');
            console.log(err);
        });
    
    }).catch((err) => {
        console.log('npm link failed...');
        console.log(err);
    });
}).catch((err) => {
    console.log('npm link failed...');
    console.log(err);
});

