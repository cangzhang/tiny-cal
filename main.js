try {
  require('electron-reloader')(module);
} catch (_) {}

const path = require('path');
const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const { is, centerWindow } = require('electron-util');
const debug = require('electron-debug');

const Note = require('./src/native/store/note');

debug();

const webPreferences = {
  nodeIntegration: true,
  webSecurity: false,
  allowRunningInsecureContent: true,
  zoomFactor: 1,
};

let mainWindow = null;
let tray = null;

const MainWindowSize = {
  height: 500,
  width: 300,
};

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: `TinyCal`,
    height: isDev ? MainWindowSize.height + 600 : MainWindowSize.height,
    width: MainWindowSize.width,
    frame: false,
    show: false,
    transparent: true,
    resizable: isDev,
    webPreferences,
  });

  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show();
  // });

  mainWindow.on('closed', () => {
    // Dereference the window
    // For multiple windows store them in an array
    mainWindow = undefined;
  });

  mainWindow.on('blur', () => {
    if (isDev) return;

    mainWindow.hide();
  });

  // mainWindow.on('close', (ev) => {
  //   ev.preventDefault();
  //   if (mainWindow) {
  //     mainWindow.hide();
  //   }
  // });

  await mainWindow.loadURL(
    isDev ? 'http://127.0.0.1:3000' : `file://${path.join(__dirname, 'build/index.html')}`,
  );
}

function toggleMainWindow(x, y) {
  if (!mainWindow) return;

  const visible = mainWindow.isVisible();
  if (visible) {
    return mainWindow.hide();
  }

  mainWindow.setAlwaysOnTop(true);
  mainWindow.show();
  mainWindow.setPosition(x, y);
}

async function makeTray() {
  const iconPath = path.join(isDev ? __dirname : process.resourcesPath, 'res/tray.png');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Exit`,
      click: () => {
        mainWindow = undefined;
        app.quit();
      },
    },
  ]);

  tray = new Tray(iconPath);
  tray.setToolTip('TinyCal');
  tray.setIgnoreDoubleClickEvents(true);

  tray.on(`click`, (ev, bounds) => {
    const { x, y, height, width } = bounds;
    toggleMainWindow(x + width / 2 - MainWindowSize.width / 2, y + height);
  });

  tray.on(`right-click`, () => {
    if (mainWindow) {
      mainWindow.hide();
    }
    tray.popUpContextMenu(contextMenu);
  });
}

ipcMain.on(`request-all-notes`, () => {
  if (!mainWindow) return;

  const notes = Note.getAllNotes();
  const noteMap = notes.reduce((res, cur) => {
    if (!res[cur.date]) {
      res[cur.date] = [];
    }

    res[cur.date].push(cur);
    return res;
  }, {});

  mainWindow.webContents.send(`all-notes`, noteMap);
});

ipcMain.on(`create-note`, (ev, data) => {
  Note.appendNote(data);
  console.log(`appended note`);
});

ipcMain.on(`delete-note`, (ev, idx) => {
  Note.deleteNote(idx);
  console.log(`deleted note: ${idx}`);
});

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

(async () => {
  await app.whenReady();
  await createMainWindow();
  await centerWindow({
    window: mainWindow,
    animated: true,
  });

  await makeTray();
})();
