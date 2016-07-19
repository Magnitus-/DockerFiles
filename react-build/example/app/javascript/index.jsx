var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');

var reactElement = React.createElement(App, {'balls': 50, 
                                             'draws': 3, 
                                             'initPot': 200,
                                             'winRatios': [0.375, 0.075, 0.05]});
ReactDOM.render(reactElement, document.getElementById('app'));



