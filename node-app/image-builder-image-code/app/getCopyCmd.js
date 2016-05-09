const fs = require('fs');
const path = require('path');

var ignoreRegex = process.env.IGNORE ? new RegExp(process.env.IGNORE) : null;

module.exports = function (rootPath, destination)
{
    //Plug app copy in template
    var copyAppCmd = "COPY [";
    
    fs.readdirSync(rootPath).forEach((filename) => {
        if(filename != "node_modules" && (ignoreRegex && (!ignoreRegex.test(filename))))
        {
            copyAppCmd += ("\""+path.join(rootPath, filename).replace('/opt', '.')+"\", ");
        }
    });
    
    copyAppCmd += ("\""+destination+"/\"]");
    return copyAppCmd;
}
