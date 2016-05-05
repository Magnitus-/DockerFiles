#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

fs.readdirSync(process.env.SHARED_DIR).forEach(function(dirname) {
    process.chdir(path.join(process.env.SHARED_DIR, dirname));
    var package = JSON.parse(fs.readFileSync(path.join(process.env.SHARED_DIR, dirname, 'package.json'), 'utf8'));
    childProcess.execSync("npm link");
    process.chdir(process.env.APP_DIR);
    childProcess.execSync("npm link "+package.name);
});
