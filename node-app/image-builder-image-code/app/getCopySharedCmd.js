const fs = require('fs');
const path = require('path');
const getCopyCmd = require('./getCopyCmd');

var namesToPaths = {};
var namesToDependencies = {};
var resolvedDependencies = {};

function mapNames(rootPath)
{
    fs.readdirSync(rootPath).forEach(function(directory) {
        var package = JSON.parse(fs.readFileSync(path.join(rootPath, directory, 'package.json'), 'utf8'));
        namesToPaths[package.name] = path.join(rootPath, directory);
        namesToDependencies[package.name] = package.localDependencies;
    });
}

function dependenciesToCmds(name, destination)
{
    if(namesToDependencies[name])
    {
        return namesToDependencies[name].reduce((cmds, currentDep) => {
            if(!resolvedDependencies[currentDep])
            {
                resolvedDependencies[currentDep] = true;
                var _path = namesToPaths[currentDep];
                var _destination = path.join(destination, path.basename(namesToPaths[currentDep]));
                return cmds + "\n" + getCopyCmd(_path, _destination) + dependenciesToCmds(currentDep, destination);
            }
        }, "");
    }
    else
    {
        return "\n";
    }
}

module.exports = function (appDir, sharedAppDir, destinationDir)
{
    resolvedDependencies = {};
    namesToPaths = {};
    namesToDependencies = {};
    
    var package = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf8'));
    namesToDependencies['[APP]'] = package.localDependencies;
    
    mapNames(sharedAppDir);
    return dependenciesToCmds('[APP]', destinationDir);
}
