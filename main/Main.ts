import { BrowserWindow, ipcMain, shell, Menu, Tray } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import * as io from "./files";
import isElevated from "./isElevated";
import notifier from "./notifier";

export default class Main {
  static mainWindow: Electron.BrowserWindow | null;
  static application: Electron.App;
  static BrowserWindow;
  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      Main.application.quit();
    }
  }

  private static onClose() {
    // Dereference the window object.
    Main.mainWindow = null;
  }

  private static onReady() {
    Main.mainWindow = new Main.BrowserWindow({
      width: 500,
      height: 700,
      frame: false,

      icon: __dirname + "/icon.ico",
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      opacity: 1,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
    // Main.mainWindow.loadURL("file://" + __dirname + "/index.html");
    Main.mainWindow?.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    Main.mainWindow?.on("closed", Main.onClose);
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);

    Main.application.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    Main.application.on("activate", () => {
      if (browserWindow === null) {
        Main.onReady();
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
    ipcMain.handle("app:download-file", (e, url: string) => {
      return io.downloadFile(url);
    });
    ipcMain.handle("app:open-user-folder", () => {
      shell.openPath(io.user_folder);
    });
    ipcMain.handle("app:is-elevated", () => {
      return isElevated();
    });
    ipcMain.handle("app:notify", (e, message: string) => {
      return notifier.notify({ title: "AdAway", message });
    });
    ipcMain.handle("app:close-window", () => {
      if (Main.mainWindow !== null) {
        Main.mainWindow = null;
      }
    });

    let tray: Tray | null = null;
    app.whenReady().then(() => {
      tray = new Tray("./icon.ico");
      const contextMenu = Menu.buildFromTemplate([
        { label: "Open", type: "normal" },
        { label: "Quit", type: "normal" },
        { label: "Disable", type: "radio" },
        { label: "Enable", type: "radio", checked: true },
      ]);
      tray.setToolTip("AdAway");
      tray.setContextMenu(contextMenu);

      tray.addListener("double-click", () => {
        if (Main.mainWindow === null) {
          Main.onReady();
        }
      });
    });
  }
}
