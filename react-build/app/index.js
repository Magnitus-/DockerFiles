const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const fs = require('fs');

const settings = JSON.parse(fs.readFileSync(process.env.BUILD_FILE, 'utf8'));

var b = browserify();

function recursivelyAdModules(path)
{
    
}

Object.keys(settings['modules']).forEach((key) => {
    if(key != '*')
    {
        b.require(settings['modules'][key], {'expose': key})
    }
    else
    {
        settings['modules'][key].forEach((path) => {
            recursivelyAdModules(path);
        });
    }
});

if(settings.dependencies && settings.dependencies.length)
{
    settings.dependencies.forEach((dependency) => {
    });
}

b.bundle().pipe(fs.createWriteStream(settings.destination));

