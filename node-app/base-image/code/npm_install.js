#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
var actOnModules = require('./actOnModules');

function npmInstall(directory)
{
    process.chdir(directory);
    childProcess.execSync("npm install --production");
}

actOnModules(process.env.APP_DIR, npmInstall);
actOnModules(process.env.SHARED_DIR, npmInstall);
