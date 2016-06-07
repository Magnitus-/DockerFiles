#!/usr/bin/env node

const childProcess = require('child_process');

childProcess.execSync('crontab -u node-app -r');

function processEntry(entry)
{
    var split = entry.split(';');
    return split[0]+' '+"(cd /home/node-app/app; npm run "+split[1]+";)";
}

var cronEntries = "";

if(process.env.ENTRY)
{
    cronEntries = processEntry(process.env.ENTRY);
}
else
{
    var index = 1;
    while(process.env['ENTRY_'+index])
    {
        cronEntries += processEntry(process.env['ENTRY_'+index]);
        cronEntries += "\n";
        index++;
    }
}

const cronProcess = childProcess.spawn('crontab', ['-u', 'node-app', '-']);

cronProcess.stdout.pipe(process.stdout);
cronProcess.stderr.pipe(process.stderr);

cronProcess.stdin.write(cronEntries);
cronProcess.stdin.end();
