const {app, BrowserWindow} = require('electron')
const path = require ('path');
const url = require ('url');


function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1650,
    height: 800,
    minWidth: 1650,
    minHeight: 800
  })

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, './build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  return mainWindow
}

app.whenReady().then(() => {
  win = createWindow()
  win.maximize()
  win.setBackgroundColor('black')
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
