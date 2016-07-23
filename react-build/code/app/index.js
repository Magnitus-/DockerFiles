const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const uglifyify = require('uglifyify');
const fs = require('fs');
const path = require('path');

var es2015 = require('babel-preset-es2015');
var jsx = require('babel-preset-react');

const settings = JSON.parse(fs.readFileSync(process.env.BUILD_FILE, 'utf8'));

var b = browserify().transform(babelify, {presets: [es2015, jsx]});

if(settings.watch)
{
    b.plugin(watchify);
}

if(settings.minify)
{
    b.transform(uglifyify);
}

function recursivelyAddModules(_path)
{
    if(fs.lstatSync(_path).isDirectory())
    {
        var files = fs.readdirSync(_path);
        files.forEach((file) => {
            recursivelyAddModules(path.join(_path, file));
        });
    }
    else
    {
        if((!settings.extensions) || settings.extensions.some((extention) => {return ('.'+extention) == path.extname(_path);}))
        {
            b.require(_path, {'expose': path.basename(_path, path.extname(_path))});
        }
    }
}

function recursivelyAddEntrypoints(_path)
{
    if(fs.lstatSync(_path).isDirectory())
    {
        var files = fs.readdirSync(_path);
        files.forEach((file) => {
            recursivelyAddEntrypoints(path.join(_path, file));
        });
    }
    else
    {
        if((!settings.extensions) || settings.extensions.some((extention) => {return ('.'+extention) == path.extname(_path);}))
        {
            b.add(_path);
        }
    }
}

if(settings.modules)
{
    Object.keys(settings['modules']).forEach((key) => {
        if(key != '*')
        {
            b.require(settings['modules'][key], {'expose': key});
        }
        else
        {
            settings['modules'][key].forEach((path) => {
                recursivelyAddModules(path);
            });
        }
    });
}

if(settings.entrypoints &&  settings.entrypoints.length)
{
    settings.entrypoints.forEach((entrypoint) => {
        recursivelyAddEntrypoints(entrypoint);
    });
}

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

function bundle() 
{
    b.bundle().pipe(fs.createWriteStream(settings.destination));
    if(process.env.OUTPUT_UID)
    {
        fs.chownSync(settings.destination, Number(process.env.OUTPUT_UID), Number(process.env.OUTPUT_UID));
    }
}

if(settings.watch)
{
    b.on('update', bundle);
}

bundle();
 


