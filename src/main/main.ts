/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import * as io from './ipc/files';
import { isElevated } from './util/isElevated';
import notifier from './util/notifier';

const onlyHide = false;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let isQuiting = false;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// ipcMain.handle("app:get-system-hosts-file", () => {
//   return io.getSystemHostsFile();
// });
// ipcMain.handle("app:set-system-hosts-file", () => {
//   return io.setSystemHostsFile();
// });
ipcMain.handle('app:load-config', () => {
  return io.loadConfig();
});
ipcMain.handle('app:save-config', (e, config) => {
  return io.saveConfig(config);
});
ipcMain.handle('app:load-sources', () => {
  return io.loadSources();
});
ipcMain.handle('app:sources-exist', () => {
  return io.sourcesExist();
});
ipcMain.handle('app:save-sources', (e, sources) => {
  return io.saveSources(sources);
});
ipcMain.handle('app:delete-sources', (e, p) => {
  return io.deleteSource(p);
});
ipcMain.handle('app:backup-hosts-file', () => {
  return io.backupHostsFile();
});
// ipcMain.handle("app:backup-exists", () => {
//   return io.backupExists();
// });
ipcMain.handle('app:load-hosts-file', (e, system) => {
  return io.loadHostsFile(system);
});
ipcMain.handle('app:save-hosts-file', (e, hosts, system) => {
  return io.saveHostsFile(hosts, system);
});
ipcMain.handle('app:download-file', (e, url: string) => {
  return io.downloadFile(url);
});
ipcMain.handle('app:open-user-folder', () => {
  shell.openPath(io.userFolder);
});
ipcMain.handle('app:is-elevated', () => {
  return isElevated();
});
ipcMain.handle('app:notify', (e, message: string) => {
  return notifier.notify({ title: 'AdAway', message });
});
ipcMain.handle('app:close-window', () => {
  if (mainWindow !== null) {
    mainWindow = null;
  }
});

let tray: Tray | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};
const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  if (process.env.NODE_ENV === 'production') {
    mainWindow = new BrowserWindow({
      show: false,
      width: 500,
      height: 700,
      frame: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      icon: getAssetPath('icon.png'),
      opacity: 1,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: true,
        // enableRemoteModule: true,
      },
    });
  } else {
    mainWindow = new BrowserWindow({
      show: false,
      width: 1000,
      height: 700,
      // frame: false,
      // resizable: false,
      // minimizable: false,
      // maximizable: false,
      alwaysOnTop: true,
      icon: getAssetPath('icon.png'),
      opacity: 1,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: true,
        // enableRemoteModule: true,
      },
    });
  }

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  if (onlyHide) {
    mainWindow.on('minimize', (event: Event) => {
      event.preventDefault();
      mainWindow?.hide();
    });

    mainWindow.on('close', (event: Event) => {
      if (!isQuiting) {
        event.preventDefault();
        mainWindow?.hide();
      }

      return false;
    });
  }

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('before-quit', function () {
  isQuiting = true;
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    if (onlyHide) {
      app.quit();
    }
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    tray = new Tray(getAssetPath('icon.ico'));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open',
        type: 'normal',
        click: () => {
          if (onlyHide) {
            mainWindow?.show();
          } else if (mainWindow === null) {
            createWindow();
          }
        },
      },
      {
        label: 'Quit',
        // type: 'normal',
        click: () => {
          isQuiting = true;
          app.quit();
        },
      },
      { label: 'Disable', type: 'radio' },
      { label: 'Enable', type: 'radio', checked: true },
    ]);
    tray.setToolTip('AdAway');
    tray.setContextMenu(contextMenu);

    tray.addListener('double-click', () => {
      if (onlyHide) {
        mainWindow?.show();
      } else if (mainWindow === null) {
        createWindow();
      }
    });
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
