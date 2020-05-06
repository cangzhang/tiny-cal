const path = require("path");
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require("electron-is-dev");
const { is, centerWindow } = require('electron-util');
const debug = require('electron-debug');

debug();

const webPreferences = {
  nodeIntegration: true,
  webSecurity: false,
  allowRunningInsecureContent: true,
  zoomFactor: 1,
};

let mainWindow;

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: `TinyCal`,
    height: 800,
    width: 1000,
    webPreferences,
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    // Dereference the window
    // For multiple windows store them in an array
    mainWindow = undefined;
  });

  await mainWindow.loadURL(
    isDev ? 'http://127.0.0.1:3000' : `file://${path.join(__dirname, 'build/index.html')}`,
  );
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

app.on(`quit`, () => {
  mainWindow = undefined;
});

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow();
  }
});

ipcMain.on(`log-msg`, (ev, data) => {
  console.log(data.value)
});

(async () => {
  await app.whenReady();
  await createMainWindow();
  await centerWindow({
    window: mainWindow,
    animated: true,
  });
})()
