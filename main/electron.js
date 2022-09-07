const electron = require("electron");
const { Menu, Tray } = require("electron");
const app = electron.app;
const ipcMain = electron.ipcMain;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const io = require("./files");
// const notifier = require("./notifier");
const isElevated = require("./isElevated");

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    icon: __dirname + "/icon.ico",
    resizable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    opacity: 1,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle("app:get-system-hosts-file", () => {
  return io.getSystemHostsFile();
});
ipcMain.handle("app:set-system-hosts-file", () => {
  return io.setSystemHostsFile();
});
ipcMain.handle("app:load-config", () => {
  return io.loadConfig();
});
ipcMain.handle("app:save-config", (e, config) => {
  return io.saveConfig(config);
});
ipcMain.handle("app:load-sources", () => {
  return io.loadSources();
});
ipcMain.handle("app:sources-exist", () => {
  return io.sourcesExist();
});
ipcMain.handle("app:save-sources", (e, sources) => {
  return io.saveSources(sources);
});
ipcMain.handle("app:delete-sources", (e, path) => {
  return io.deleteSource(path);
});
ipcMain.handle("app:backup-hosts-file", () => {
  return io.backupHostsFile();
});
ipcMain.handle("app:backup-exists", () => {
  return io.backupExists();
});
ipcMain.handle("app:load-hosts-file", (e, path) => {
  return io.loadHostsFile(path);
});
ipcMain.handle("app:save-hosts-file", (e, hosts, path) => {
  return io.saveHostsFile(hosts, path);
});
ipcMain.handle("app:download-file", (e, url) => {
  return io.downloadFile(url);
});
ipcMain.handle("app:open-user-folder", () => {
  shell.openPath(io.user_folder);
});
ipcMain.handle("app:is-elevated", () => {
  return isElevated.isElevated();
});
ipcMain.handle("app:close-window", () => {
  if (mainWindow !== null) {
    mainWindow = null;
  }
});
// ipcMain.handle("app:notify", (e, message) => {
//   return notifier.notify({ title: "AdAway", message });
// });

let tray = null;
app.whenReady().then(() => {
  tray = new Tray(__dirname + "./icon.ico");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      type: "normal",
      click: () => {
        if (mainWindow === null) {
          createWindow();
        }
      },
    },
    {
      label: "Quit",
      type: "normal",
      click: () => {
        app.quit();
      },
    },
    { label: "Disable", type: "radio" },
    { label: "Enable", type: "radio", checked: true },
  ]);
  tray.setToolTip("AdAway");
  tray.setContextMenu(contextMenu);
  tray.addListener("double-click", () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});
