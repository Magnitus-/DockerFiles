#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const wgetDirCmd = require('./wgetDirCmd');

var exitCode = 0;

//Read template in memory
var output = fs.readFileSync(process.env.TEMPLATE_PATH, 'utf8');

//Plug values in template
output = output.replace(/{{UID}}/, process.env.UID);

var wgetFilesCmd =  wgetDirCmd(process.env.APP_DIR, "${APP_DIR}", process.env.APP_DIR, "RUN ");

try
{
    fs.accessSync(process.env.SHARED_DIR, fs.F_OK);
    wgetFilesCmd = wgetFilesCmd + wgetDirCmd(process.env.SHARED_DIR, "${SHARED_DIR}", process.env.SHARED_DIR, " && ");
}
catch(err)
{
}

output = output.replace(/{{COPY_ALL}}/, wgetFilesCmd);

console.log("Building image \""+process.env.OUTPUT_IMAGE+"\" with the following dockerfile: ")
console.log("*********************************");
console.log(output);
console.log("*********************************");

const serverProcess = childProcess.spawn('npm', ['start'], {'cwd': process.env.SERVER_DIR});

serverProcess.on('exit', (code) => {
    process.exit(exitCode);
});

if(process.env.CACHE == 'yes')
{
    var buildArgs = ['build', '-t', process.env.OUTPUT_IMAGE, '-'];
}
else
{
    var buildArgs = ['build', '--no-cache',  '-t', process.env.OUTPUT_IMAGE, '-']
}


const buildProcess = childProcess.spawn('docker', buildArgs, {'cwd': '/opt'});

buildProcess.stdout.pipe(process.stdout);
buildProcess.stderr.pipe(process.stderr);

buildProcess.on('exit', (code) => {
    exitCode = code;
    serverProcess.kill('SIGTERM');
});

buildProcess.stdin.write(output);
buildProcess.stdin.end();
