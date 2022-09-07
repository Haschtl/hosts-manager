"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.saveHostsFile = exports.loadHostsFile = exports.backupExists = exports.backupHostsFile = exports.deleteSource = exports._saveSources = exports.saveSources = exports.sourcesExist = exports.loadSources = exports.saveConfig = exports.loadConfig = exports.urlToFilename = exports.downloadFile = exports.setSystemHostsFile = exports.getSystemHostsFile = exports.user_folder = void 0;
var fs_1 = require("fs");
// import os from "os";
var http_1 = require("http");
var path_1 = require("path");
var hosts_manager_1 = require("../src/hosts_manager");
var electron_1 = require("electron");
// const fs = window.require("fs");
// const os = window.require("os");
// const http = window.require("http");
exports.user_folder = electron_1.app.getPath("home") + "/.adaway";
// export let user_folder = os.homedir() + "/.adaway";
// export let user_folder = "";
var hosts_path = "C://windows/system32/drivers/etc/hosts";
var pre_hosts_path = exports.user_folder + "/hosts";
var backup_path = exports.user_folder + "/hosts.bak";
var config_path = exports.user_folder + "/config.json";
var online_path = exports.user_folder + "/online/";
var sources_path = exports.user_folder + "/sources/";
// export let checkBackendService = () => {
//   // return RNFetchBlob.config({
//   //   trusty: true,
//   // })
//   return fetch("https://localhost:1312/", {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((e) => {
//       console.log(e);
//       return true;
//     })
//     .catch((e) => {
//       console.log(e);
//       return false;
//     });
// };
var getSystemHostsFile = function (path) {
    if (path === void 0) { path = hosts_path; }
    return fetch("https://localhost:1312/get?path=".concat(encodeURI(path)), {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
};
exports.getSystemHostsFile = getSystemHostsFile;
var setSystemHostsFile = function (path) {
    if (path === void 0) { path = hosts_path; }
    return fetch("https://localhost:1312/set?path=".concat(encodeURI(path)), {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
};
exports.setSystemHostsFile = setSystemHostsFile;
var downloadFile = function (url, path) {
    if (path === void 0) { path = online_path; }
    try {
        fs_1.accessSync(path);
    }
    catch (_a) {
        fs_1.mkdirSync(path);
    }
    var file = fs_1.createWriteStream(path);
    http_1["default"].get(url, function (response) {
        response.pipe(file);
        // after download completed close filestream
        file.on("finish", function () {
            file.close();
            console.log("Download Completed");
        });
    });
    file.close();
    return fs_1.readFileSync(path);
};
exports.downloadFile = downloadFile;
var urlToFilename = function (url) {
    return (url.replace("http://", "").replace("https://", "").replace("/", "_") +
        ".host");
};
exports.urlToFilename = urlToFilename;
var loadConfig = function (path) {
    if (path === void 0) { path = config_path; }
    console.log("Loading settings from " + path);
    try {
        fs_1.accessSync(path);
        return __assign({}, JSON.parse(fs_1.readFileSync(path).toString()));
    }
    catch (_a) {
        fs_1.mkdirSync((0, path_1.dirname)(path));
        return undefined;
    }
};
exports.loadConfig = loadConfig;
var saveConfig = function (config, path) {
    if (path === void 0) { path = config_path; }
    console.log("Saving settings to " + path);
    return fs_1.writeFileSync(path, JSON.stringify(config));
};
exports.saveConfig = saveConfig;
// export let resetConfig = (path = config_path) => {
//   console.log("Resetting settings " + path);
//   return fs.writeFileSync(path, JSON.stringify(initialSettings));
// };
var loadSources = function (path) {
    if (path === void 0) { path = sources_path; }
    console.log("Loading sources from " + path);
    try {
        fs_1.accessSync(path);
        var files = fs_1.readdirSync(path);
        console.log("Found files: " + files.join(", "));
        var promises = files.map(function (file) {
            return loadHostsFile(path + file);
        });
        var sources_1 = { categories: [] };
        promises.forEach(function (h) {
            if (h) {
                sources_1.categories = __spreadArray(__spreadArray([], sources_1.categories, true), h.categories, true);
            }
        });
        return sources_1;
    }
    catch (_a) { }
};
exports.loadSources = loadSources;
var sourcesExist = function (path) {
    if (path === void 0) { path = sources_path; }
    try {
        fs_1.accessSync(path);
        var files = fs_1.readdirSync(path);
        return files.length > 0;
    }
    catch (_a) {
        return false;
    }
};
exports.sourcesExist = sourcesExist;
var saveSources = function (hosts, path) {
    if (path === void 0) { path = sources_path; }
    console.log("Saving sources to " + path);
    try {
        fs_1.accessSync(path);
        (0, exports._saveSources)(hosts, path);
    }
    catch (_a) {
        fs_1.mkdirSync(path);
        (0, exports._saveSources)(hosts, path);
    }
};
exports.saveSources = saveSources;
var _saveSources = function (hosts, path) {
    if (path === void 0) { path = sources_path; }
    hosts.categories.forEach(function (h) {
        var fpath = path + h.label + ".host";
        fs_1.writeFileSync(fpath, (0, hosts_manager_1.formatHosts)({ categories: [h] }, true));
    });
};
exports._saveSources = _saveSources;
var deleteSource = function (path) {
    if (path === void 0) { path = sources_path; }
    var files = fs_1.readdirSync(path);
    files.forEach(function (file) {
        return fs_1.unlinkSync(file);
    });
};
exports.deleteSource = deleteSource;
function backupHostsFile() {
    return fs_1.copyFileSync(hosts_path, backup_path);
}
exports.backupHostsFile = backupHostsFile;
function backupExists() {
    return fs_1.statSync(backup_path).isFile();
}
exports.backupExists = backupExists;
function loadHostsFile(system) {
    var path = hosts_path;
    if (typeof system === "string") {
        path = system;
    }
    else {
        if (!system) {
            path = pre_hosts_path;
        }
    }
    console.log("Loading hosts-file from " + path);
    try {
        fs_1.accessSync(path);
        var hostsFile = fs_1.readFileSync(path);
        return (0, hosts_manager_1.parse_hosts_file)(hostsFile.toString());
    }
    catch (_a) { }
}
exports.loadHostsFile = loadHostsFile;
var saveHostsFile = function (hosts, system) {
    if (system === void 0) { system = true; }
    var path = hosts_path;
    if (typeof system === "string") {
        path = system;
    }
    else if (!system) {
        path = pre_hosts_path;
    }
    console.log("Saving hosts-file to " + path);
    var h = (0, hosts_manager_1.formatHosts)(hosts);
    return fs_1.writeFileSync(path, h);
};
exports.saveHostsFile = saveHostsFile;
