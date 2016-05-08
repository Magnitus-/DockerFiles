#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const chownr = require('chownr');
const cpr = require('cpr');

const getCopyCmd = require('./getCopyCmd');
const getCopySharedCmd = require('./getCopySharedCmd');

//Read template in memory
var output = fs.readFileSync(process.env.TEMPLATE_PATH, 'utf8');

//Plug values in template
output = output.replace(/{{UID}}/, process.env.UID);
output = output.replace(/{{COPY_APP}}/, getCopyCmd(process.env.APP_DIR, "${APP_DIR}"));
output = output.replace(/{{COPY_SHARED}}/, getCopySharedCmd(process.env.APP_DIR, process.env.SHARED_DIR, "${SHARED_DIR}"));


fs.writeFileSync(path.join(process.env.OUTPUT_DIR, 'dockerfile'), output);
fs.writeFileSync(path.join(process.env.OUTPUT_DIR, 'build.sh'), "docker build -t "+process.env.OUTPUT_IMAGE+" -f dockerfile .");

cpr(process.env.APP_DIR, path.join(process.env.OUTPUT_DIR, 'app'), {
    deleteFirst: true, //Delete "to" before 
    overwrite: true, //If the file exists, overwrite it 
    confirm: true //After the copy, stat all the copied files to make sure they are there 
}, function(err, files) {
    if(err)
    {
        process.exit(1);
    }
    else
    {
        cpr(process.env.SHARED_DIR, path.join(process.env.OUTPUT_DIR, 'shared'), {
            deleteFirst: true, //Delete "to" before 
            overwrite: true, //If the file exists, overwrite it 
            confirm: true //After the copy, stat all the copied files to make sure they are there 
        }, function(err, files) {
            if(err)
            {
                process.exit(1);
            }
            chownr.sync(process.env.OUTPUT_DIR, parseInt(process.env.OUTPUT_UID), parseInt(process.env.OUTPUT_UID));
        });
    }
});




