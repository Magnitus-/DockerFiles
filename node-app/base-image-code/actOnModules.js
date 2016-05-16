const fs = require('fs');
const path = require('path');

function actOnModules(directory, action)
{
    try
    {
        fs.accessSync(directory, fs.F_OK);
        var files = fs.readdirSync(directory);
        if(files.some(function(file) {
            return(file == "package.json");
        }))
        {
            action(directory);
        }
        else
        {
            files.forEach(function(file) {
                if(fs.lstatSync(path.join(directory, file)).isDirectory() && file != "node_modules")
                {
                    actOnModules(path.join(directory, file), action);
                }
            });
        }
    }
    catch(err)
    {
    }
}

module.exports = actOnModules;
