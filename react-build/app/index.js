const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const fs = require('fs');

const settings = JSON.parse(fs.readFileSync(process.env.BUILD_FILE, 'utf8'));
console.log(settings);
