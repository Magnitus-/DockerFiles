const fs = require('fs');
const path = require('path');
const actOnModules = require('act-on-modules');

var mainKey = '!APP!';

var info = {
    pathsByModule: {},
    dependenciesByModule: {},
    resolvedDependencies: {},
    dependencies: {}
};

function compileInfo(directory)
{
    var package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
    var packageName = this.mainModule ? mainKey : package.name;
    this.pathsByModule[packageName] = directory;
    if(package.localDependencies)
    {
        this.dependenciesByModule[packageName] = package.localDependencies;
    }
}

function compileDependencies(currentModule, info)
{
    if(info.resolvedDependencies[currentModule])
    {
        return;
    }
    
    info.resolvedDependencies[currentModule] = true;
    if(info.dependenciesByModule[currentModule])
    {
        info.dependenciesByModule[currentModule].forEach((dependency) => {
            info.dependencies[dependency] = true;
            compileDependencies(dependency, info);
        });
    }
}

module.exports = function() {
    var compileInfoBound = compileInfo.bind(info);
    info.mainModule = true;
    actOnModules.sync(process.env.APP_DIR, compileInfoBound);
    info.mainModule = false;
    actOnModules.sync(process.env.SHARED_DIR, compileInfoBound);
    
    compileDependencies(mainKey, info);
    
    delete info['mainModule'];
    
    return info;
};

