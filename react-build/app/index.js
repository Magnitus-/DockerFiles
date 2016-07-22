const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const fs = require('fs');
const path = require('path');

const settings = JSON.parse(fs.readFileSync(process.env.BUILD_FILE, 'utf8'));

var b = browserify();

//TODO: Watchify + 2015 & jsx

function recursivelyAdModules(_path)
{
    if(fs.lstatSync(_path).isDirectory())
    {
        var files = fs.readdirSync(_path);
        files.forEach((file) => {
            recursivelyAdModules(path.join(_path, file));
        });
    }
    else
    {
        if((!settings.extentions) || settings.extentions.some((extention) => {return (','+extention) == path.extname(_path);}))
        {
            b.require(_path, {'expose': path.basename(_path, path.extname(_path))});
        }
    }
}

Object.keys(settings['modules']).forEach((key) => {
    if(key != '*')
    {
        b.require(settings['modules'][key], {'expose': key});
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
        switch(dependency)
        {
            case 'react':
                b.require(path.join(process.env.APP_DIR, 'node_modules', 'react', 'dist', 'react.min.js'), {'expose': 'react'});
            break;
            case 'react-dom':
                b.require(path.join(process.env.APP_DIR, 'node_modules', 'react-dom', 'dist', 'react-dom.min.js'), {'expose': 'react-dom'});
            break;
            case 'redux':
                b.require(path.join(process.env.APP_DIR, 'node_modules', 'redux', 'dist', 'redux.min.js'), {'expose': 'redux'});
            break;
        }
    });
}

b.bundle().pipe(fs.createWriteStream(settings.destination));

