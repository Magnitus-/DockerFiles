#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
var actOnModules = require('act-on-modules');

function linkGlobally(directory)
{
    process.chdir(directory);
    childProcess.execSync("npm link");
}

function resolveDependencies(directory)
{
    process.chdir(directory);
    var package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
    if(package.localDependencies)
    {
        package.localDependencies.forEach(function(localDependency) {
            childProcess.execSync("npm link "+localDependency);
        });
    }
}

//Link shared modules globally
actOnModules(process.env.SHARED_DIR, linkGlobally);

//Resolve dependencies
actOnModules(process.env.APP_DIR, resolveDependencies);
actOnModules(process.env.SHARED_DIR, resolveDependencies);

