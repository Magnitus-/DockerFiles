const fs = require('fs');
const path = require('path');
const actOnModules = require('./actOnModules');

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
    info.dependenciesByModule[currentModule].forEach((dependency) => {
        info.resolvedDependencies[currentModule] = true;
        info.dependencies[dependency] = true;
        compileDependencies(dependency, info);
    });
}

module.exports = function() {
    var compileInfoBound = compileInfo.bind(info);
    info.mainModule = true;
    actOnModules(process.env.APP_DIR, compileInfoBound);
    info.mainModule = false;
    actOnModules(process.env.SHARED_DIR, compileInfoBound);
    
    compileDependencies(mainKey, info);
    
    delete info['mainModule'];
    
    return info;
};

