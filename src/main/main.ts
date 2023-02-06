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
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Tray,
  Menu,
  dialog,
  nativeTheme,
  globalShortcut,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import * as io from './ipc/files';
import notifier from './util/notifier';
import Positioner from './util/positioning';
import { resolve, lookup } from './ipc/dns';
import {
  copyFirewallRule,
  disableFirewallRule,
  enableFirewallRule,
  getFirewallRules,
  openWindowsFirewall,
  newFirewallRule,
  removeFirewallRule,
  renameFirewallRule,
  setFirewallRule,
  showFirewallRules,
  showSmartFirewallRules,
  getFirewallProfiles,
  showSmartFirewallRule,
} from './ipc/windowsFirewall';
import { getAssetPath } from './util/files';
import { FirewallRuleO } from '../shared/types';

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
let progressInterval: NodeJS.Timer;
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

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('ad-away', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('ad-away');
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

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }
  let options: Electron.BrowserWindowConstructorOptions = {
    show: false,
    height: 700,
    width: 760,
    minWidth: 760,
    minHeight: 380,
    // maxWidth: 1080,
    // minimizable: false,
    // maximizable: false,
    titleBarStyle: 'hidden',
    // frame: false,
    // resizable: false,
    // minimizable: false,
    // maximizable: false,
    // x
    icon: getAssetPath(app.isPackaged, 'icon.png'),
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
    titleBarOverlay: {
      height: 30,
      symbolColor: '#FFFFFF',
      color: '#404040',
    },
  };
  if (process.env.NODE_ENV === 'production') {
    options = {
      ...options,
      // transparent: true,
      // titleBarStyle: 'hidden',
      // frame: false,
      // resizable: false,
      // minimizable: false,
      // maximizable: false,
      // alwaysOnTop: true,
      // movable: false,
    };
  } else {
    options = {
      ...options,
    };
  }
  mainWindow = new BrowserWindow(options);

  const positioner = new Positioner(mainWindow, tray);
  positioner.move('trayCenter');

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

  // Taskbar flash icon
  mainWindow.on('focus', () => mainWindow?.flashFrame(false));
  if (process.env.NODE_ENV === 'production') {
    // mainWindow.on('blur', () => {
    //   if (onlyHide) {
    //     mainWindow?.hide();
    //   } else {
    //     mainWindow?.close();
    //   }
    // });
  }

  // ipcMain.on('ipc-example', async (event, arg) => {
  //   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  //   console.log(msgTemplate(arg));
  //   event.reply('ipc-example', msgTemplate('pong'));
  // });

  // ipcMain.handle("app:get-system-hosts-file", () => {
  //   return io.getSystemHostsFile();
  // });
  // ipcMain.handle("app:set-system-hosts-file", () => {
  //   return io.setSystemHostsFile();
  // });

  ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
      file: path.join(__dirname, filePath),
      icon: getAssetPath(app.isPackaged, 'icon.png'),
    });
  });
  ipcMain.handle('app:load-sources-config', () => {
    return io.loadSourceConfig();
  });
  ipcMain.handle('app:import-file', (e, origPath: string, newPath: string) => {
    return io.importFile(origPath, newPath);
  });
  ipcMain.handle('app:save-sources-config', (e, config) => {
    return io.saveSourceConfig(config);
  });
  ipcMain.handle('app:load-config', () => {
    return io.loadConfig();
  });
  ipcMain.handle('app:save-config', (e, config) => {
    return io.saveConfig(config);
  });
  ipcMain.handle('app:load-sources', () => {
    return io.loadSources();
  });
  ipcMain.handle('app:load-profiles', () => {
    const profiles = io.loadProfiles();
    if (profiles) {
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
        // { label: 'Disable', type: 'radio' },
        // { label: 'Enable', type: 'radio', checked: true },
        ...profiles.map((hf) => {
          return {
            label: hf.path.replace('./profiles/', '').replace('.hosts', ''),
            type: 'radio',
            checked: false,
            click: () => {
              io.applyProfile(hf.path);
            },
            enabled: true,
            // commandId: idx,
            // id: idx,
          } as Partial<Electron.MenuItem> as Electron.MenuItem;
        }),
        {
          label: 'Quit',
          // type: 'normal',
          click: () => {
            isQuiting = true;
            app.quit();
          },
        },
      ]);
      tray?.setToolTip('hosts_manager');
      tray?.setContextMenu(contextMenu);
    }
    return profiles;
  });
  ipcMain.handle('app:remove-profile', (e, filepath) => {
    return io.removeProfile(filepath);
  });
  ipcMain.handle('app:apply-profile', (e, filepath) => {
    return io.applyProfile(filepath);
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
  ipcMain.handle('app:backup-hosts-file', (e, filepath) => {
    return io.backupHostsFile(filepath);
  });
  // ipcMain.handle("app:backup-exists", () => {
  //   return io.backupExists();
  // });
  ipcMain.handle('app:load-hosts-file', (e, system) => {
    return io.loadHostsFile(system);
  });
  ipcMain.handle(
    'app:save-hosts-file',
    (
      e,
      sources,
      config,
      system,
      includeIPv6,
      hostOverwrite,
      removeComments
    ) => {
      return io.saveHostsFile(
        sources,
        config,
        system,
        includeIPv6,
        hostOverwrite,
        removeComments
      );
    }
  );
  ipcMain.handle('app:download-file', (e, url: string, filepath: string) => {
    return io.downloadFile(url, filepath);
  });
  ipcMain.handle('app:open-user-folder', () => {
    shell.openPath(io.userFolder);
  });
  ipcMain.handle('app:is-elevated', async () => {
    return false;
  });
  ipcMain.handle('app:notify', (e, message: string) => {
    return notifier.notify({ title: 'hosts_manager', message });
  });
  ipcMain.handle('app:close-window', () => {
    if (mainWindow !== null) {
      mainWindow.close();
    }
  });
  ipcMain.handle('app:show-open-dialog', () => {
    return io.showOpenDialog();
  });
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });

  // Taskbar flash icon
  ipcMain.handle('taskbar:flash:start', () => {
    mainWindow?.flashFrame(true);
  });
  ipcMain.handle('taskbar:flash:stop', () => {
    mainWindow?.flashFrame(false);
  });
  ipcMain.handle('taskbar:tray:tooltip', (e, text: string) => {
    tray?.setToolTip(text);
  });
  ipcMain.handle('taskbar:set-progress', (e, value: number) => {
    mainWindow?.setProgressBar(value);
  });

  ipcMain.handle('dns:resolve', (e, value: string) => {
    return resolve(value);
  });
  ipcMain.handle('dns:lookup', (e, value: string) => {
    return lookup(value);
  });
  ipcMain.handle('firewall:rules:get', () => {
    return getFirewallRules();
  });
  ipcMain.handle('firewall:profiles:get', () => {
    return getFirewallProfiles();
  });
  ipcMain.handle('firewall:rules:show', () => {
    return showFirewallRules();
  });
  ipcMain.handle('firewall:rules:show-smart', async () => {
    return showSmartFirewallRules();
  });
  ipcMain.handle('firewall:rules:get-smart', async (e, displayName: string) => {
    return showSmartFirewallRule(displayName);
  });
  ipcMain.handle('firewall:open', () => {
    return openWindowsFirewall();
  });
  ipcMain.handle('firewall:rules:set', (e, rule: FirewallRuleO) => {
    return setFirewallRule(rule);
  });
  ipcMain.handle('firewall:rules:new', (e, newRule: FirewallRuleO) => {
    return newFirewallRule(newRule);
  });
  ipcMain.handle('firewall:rules:copy', (e, displayName, newName) => {
    return copyFirewallRule(displayName, newName);
  });
  ipcMain.handle('firewall:rules:remove', (e, displayName) => {
    return removeFirewallRule(displayName);
  });
  ipcMain.handle('firewall:rules:enable', (e, displayName) => {
    return enableFirewallRule(displayName);
  });
  ipcMain.handle('firewall:rules:disable', (e, displayName) => {
    return disableFirewallRule(displayName);
  });
  ipcMain.handle('firewall:rules:rename', (e, name, newName) => {
    return renameFirewallRule(name, newName);
  });
  ipcMain.handle('firewall:rules:toggle', (e, displayName, value: boolean) => {
    if (value) {
      return enableFirewallRule(displayName);
    }
    return disableFirewallRule(displayName);
  });

  // // Taskbar overlay icon
  // mainWindow.setOverlayIcon(
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //  @ts-ignore
  //   getAssetPath('icon.png'),
  //   'Description for overlay'
  // );

  // Taskbar icon loading

  // const INCREMENT = 0.03;
  // const INTERVAL_DELAY = 100; // ms

  // let c = 0;
  // progressInterval = setInterval(() => {
  //   // update progress bar to next value
  //   // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
  //   mainWindow?.setProgressBar(c);

  //   // increment or reset progress bar
  //   if (c < 2) {
  //     c += INCREMENT;
  //   } else {
  //     c = -INCREMENT * 5; // reset to a bit less than 0 to show reset state
  //   }
  // }, INTERVAL_DELAY);

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // // Taskbar icon hover thumbar buttons
  // mainWindow.setThumbarButtons([
  //   {
  //     tooltip: 'button1',
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     icon: getAssetPath('icon.png'),
  //     click() {
  //       console.log('button1 clicked');
  //     },
  //   },
  //   {
  //     tooltip: 'button2',
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     icon: getAssetPath('icon.png'),
  //     flags: ['enabled', 'dismissonclick'],
  //     click() {
  //       console.log('button2 clicked.');
  //     },
  //   },
  // ]);

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

// // Configure taskbar icon right-click JumpList
// app.setUserTasks([
//   {
//     program: process.execPath,
//     arguments: '--new-window',
//     iconPath: process.execPath,
//     iconIndex: 0,
//     title: 'New Window',
//     description: 'Create a new window',
//   },
// ]);

// if (process.platform === 'win32') {
//   const eventLogger = new EventLogger({ source: 'hosts_manager' });
//   // Create a new service object
//   const svc = new Service({
//     name: 'hosts_manager',
//     description: 'Background autorun service for hosts_manager.',
//     script: path.join(__dirname, 'main.js'),
//     nodeOptions: '--harmony --max_old_space_size=4096',
//     // workingDirectory: '...',
//     // allowServiceLogon: true
//   });
//   svc.on('install', () => {
//     svc.start();
//   });
//   svc.on('uninstall', () => {
//     console.log('Uninstall complete.');
//   });

//   svc.install();
// }

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  /**
   * Add event listeners...
   */
  app.on('second-instance', (event, commandLine) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // the commandLine is array of strings in which last element is deep link url
    // the url str ends with /
    dialog.showErrorBox(
      'Welcome Back',
      `You arrived from: ${commandLine.pop()?.slice(0, -1)}`
    );
  });

  app.on('before-quit', () => {
    isQuiting = true;
    clearInterval(progressInterval);
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
      globalShortcut.register('Alt+CommandOrControl+I', () => {
        console.log('Toggle hosts_manager!');
        // io.toggleHosts();
      });
      tray = new Tray(getAssetPath(app.isPackaged, 'icon.ico'));
      createWindow();
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
        // { label: 'Disable', type: 'radio' },
        // { label: 'Enable', type: 'radio', checked: true },
      ]);
      tray.setToolTip('hosts_manager');
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
}
