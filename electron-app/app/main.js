const electron = require('electron');

electron.crashReporter.start();

var mainWindow = null;

electron.app.on('window-all-closed', function() {
    electron.app.quit();
});

electron.app.on('ready', function() {
    mainWindow = new electron.BrowserWindow();
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
