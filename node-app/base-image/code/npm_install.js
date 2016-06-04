#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
var actOnModules = require('act-on-modules');

function npmInstall(directory)
{
    process.chdir(directory);
    childProcess.execSync("npm install --production");
}

actOnModules(process.env.APP_DIR, npmInstall);
actOnModules(process.env.SHARED_DIR, npmInstall);

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
