#!/usr/bin/env node

const path = require('path');
const childProcess = require('child_process');
const moduleLinker = require('module-linker');
const recursiveInstaller = require('recursive-installer');
Promise = require('bluebird');

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

Promise.all([recursiveInstaller([process.env.APP_DIR, process.env.SHARED_DIR], null, 1024 * 1024 * 5),
             moduleLinker([process.env.APP_DIR, process.env.SHARED_DIR], [process.env.SHARED_DIR])]).catch((err) => {
    console.log(err);
})
