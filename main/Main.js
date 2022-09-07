"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var electron_is_dev_1 = require("electron-is-dev");
var path_1 = require("path");
var io = require("./files");
var isElevated_1 = require("./isElevated");
var notifier_1 = require("./notifier");
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.onWindowAllClosed = function () {
        if (process.platform !== "darwin") {
            Main.application.quit();
        }
    };
    Main.onClose = function () {
        // Dereference the window object.
        Main.mainWindow = null;
    };
    Main.onReady = function () {
        var _a, _b;
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
                enableRemoteModule: true
            }
        });
        // Main.mainWindow.loadURL("file://" + __dirname + "/index.html");
        (_a = Main.mainWindow) === null || _a === void 0 ? void 0 : _a.loadURL(electron_is_dev_1["default"]
            ? "http://localhost:3000"
            : "file://".concat(path_1["default"].join(__dirname, "../build/index.html")));
        (_b = Main.mainWindow) === null || _b === void 0 ? void 0 : _b.on("closed", Main.onClose);
    };
    Main.main = function (app, browserWindow) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies. This
        // makes the code easier to write tests for
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on("window-all-closed", Main.onWindowAllClosed);
        Main.application.on("ready", Main.onReady);
        Main.application.on("window-all-closed", function () {
            if (process.platform !== "darwin") {
                app.quit();
            }
        });
        Main.application.on("activate", function () {
            if (browserWindow === null) {
                Main.onReady();
            }
        });
        electron_1.ipcMain.handle("app:get-system-hosts-file", function () {
            return io.getSystemHostsFile();
        });
        electron_1.ipcMain.handle("app:set-system-hosts-file", function () {
            return io.setSystemHostsFile();
        });
        electron_1.ipcMain.handle("app:load-config", function () {
            return io.loadConfig();
        });
        electron_1.ipcMain.handle("app:save-config", function (e, config) {
            return io.saveConfig(config);
        });
        electron_1.ipcMain.handle("app:load-sources", function () {
            return io.loadSources();
        });
        electron_1.ipcMain.handle("app:sources-exist", function () {
            return io.sourcesExist();
        });
        electron_1.ipcMain.handle("app:save-sources", function (e, sources) {
            return io.saveSources(sources);
        });
        electron_1.ipcMain.handle("app:delete-sources", function (e, path) {
            return io.deleteSource(path);
        });
        electron_1.ipcMain.handle("app:backup-hosts-file", function () {
            return io.backupHostsFile();
        });
        electron_1.ipcMain.handle("app:backup-exists", function () {
            return io.backupExists();
        });
        electron_1.ipcMain.handle("app:load-hosts-file", function (e, system) {
            return io.loadHostsFile(system);
        });
        electron_1.ipcMain.handle("app:save-hosts-file", function (e, hosts, system) {
            return io.saveHostsFile(hosts, system);
        });
        electron_1.ipcMain.handle("app:download-file", function (e, url) {
            return io.downloadFile(url);
        });
        electron_1.ipcMain.handle("app:open-user-folder", function () {
            electron_1.shell.openPath(io.user_folder);
        });
        electron_1.ipcMain.handle("app:is-elevated", function () {
            return (0, isElevated_1["default"])();
        });
        electron_1.ipcMain.handle("app:notify", function (e, message) {
            return notifier_1["default"].notify({ title: "AdAway", message: message });
        });
        electron_1.ipcMain.handle("app:close-window", function () {
            if (Main.mainWindow !== null) {
                Main.mainWindow = null;
            }
        });
        var tray = null;
        app.whenReady().then(function () {
            tray = new electron_1.Tray("./icon.ico");
            var contextMenu = electron_1.Menu.buildFromTemplate([
                { label: "Open", type: "normal" },
                { label: "Quit", type: "normal" },
                { label: "Disable", type: "radio" },
                { label: "Enable", type: "radio", checked: true },
            ]);
            tray.setToolTip("AdAway");
            tray.setContextMenu(contextMenu);
            tray.addListener("double-click", function () {
                if (Main.mainWindow === null) {
                    Main.onReady();
                }
            });
        });
    };
    return Main;
}());
exports["default"] = Main;
