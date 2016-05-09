#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const getCopyCmd = require('./getCopyCmd');
const getCopySharedCmd = require('./getCopySharedCmd');

var exitCode = 0;

//Read template in memory
var output = fs.readFileSync(process.env.TEMPLATE_PATH, 'utf8');

//Plug values in template
output = output.replace(/{{UID}}/, process.env.UID);
output = output.replace(/{{COPY_APP}}/, getCopyCmd(process.env.APP_DIR, "${APP_DIR}"));
output = output.replace(/{{COPY_SHARED}}/, getCopySharedCmd(process.env.APP_DIR, process.env.SHARED_DIR, "${SHARED_DIR}"));

console.log("Building image \""+process.env.OUTPUT_IMAGE+"\" with the following dockerfile: ")
console.log("*********************************");
console.log(output);
console.log("*********************************");

const serverProcess = childProcess.spawn('npm', ['start'], {'cwd': process.env.SERVER_DIR});

serverProcess.on('exit', (code) => {
    process.exit(exitCode);
});

const buildProcess = childProcess.spawn('docker', ['build', '-t', process.env.OUTPUT_IMAGE, '-'], {'cwd': '/opt'});

buildProcess.stdout.pipe(process.stdout);
buildProcess.stderr.pipe(process.stderr);

buildProcess.on('exit', (code) => {
    exitCode = code;
    serverProcess.kill('SIGTERM');
});

buildProcess.stdin.write(output);
buildProcess.stdin.end();
