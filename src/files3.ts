// import fs from "fs";
// // import os from "os";
// import http from "http";
import { formatHosts, Hosts, parse_hosts_file } from "../src/hosts_manager";
import { Settings } from "../src/store/types";
import {app} from "electron"
const ipcRenderer = window.require("electron").ipcRenderer;
// var remote = window.require("electron").remote;
// var fs = remote.require("fs");
// var http = remote.require("http");
const fs = window.require("fs");
// const os = window.require("os");
const http = window.require("http");
export let user_folder = app.getPath("home") + "/.adaway";
// export let user_folder = os.homedir() + "/.adaway";
// export let user_folder = "";
let hosts_path = "C://windows/system32/drivers/etc/hosts";
let pre_hosts_path = user_folder + "/hosts";
let backup_path = user_folder + "/hosts.bak";
let config_path = user_folder + "/config.json";
let online_path = user_folder + "/online/";
let sources_path = user_folder + "/sources/";

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
export let getSystemHostsFile = (path = pre_hosts_path) => {
  return fetch(`https://localhost:1312/get?path=${encodeURI(path)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
export let setSystemHostsFile = (path = pre_hosts_path) => {
  return fetch(`https://localhost:1312/set?path=${encodeURI(path)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export let downloadFile = (url: string, path = online_path) => {
  try {
    fs.accessSync(path);
  } catch {
    fs.mkdirSync(path);
  }

  const file = fs.createWriteStream(path);
  http.get(url, (response: any) => {
    response.pipe(file);

    // after download completed close filestream
    file.on("finish", () => {
      file.close();
      console.log("Download Completed");
    });
  });
  file.close();
  return fs.readFileSync(path);
};

export let urlToFilename = (url: string) => {
  return (
    url.replace("http://", "").replace("https://", "").replace("/", "_") +
    ".host"
  );
};
export let loadConfig = (path = config_path) => {
  console.log("Loading settings from " + path);

  try {
    fs.accessSync(path);
    return {
      // ...initialSettings,
      ...JSON.parse(fs.readFileSync(path).toString()),
    } as Partial<Settings>;
  } catch {
    fs.mkdirSync(path);
    return undefined;
  }
};
export let saveConfig = (config: Settings, path = config_path) => {
  console.log("Saving settings to " + path);
  return fs.writeFileSync(path, JSON.stringify(config));
};
// export let resetConfig = (path = config_path) => {
//   console.log("Resetting settings " + path);
//   return fs.writeFileSync(path, JSON.stringify(initialSettings));
// };

export let loadSources = (path = sources_path) => {
  console.log("Loading sources from " + path);

  try {
    fs.accessSync(path);
    let files = fs.readdirSync(path);
    console.log("Found files: " + files.join(", "));
    let promises = files.map((file: string) => {
      return loadHostsFile(path + file);
    });
    let sources: Hosts = { categories: [] };
    promises.forEach((h: any) => {
      if (h) {
        sources.categories = [...sources.categories, ...h.categories];
      }
    });
    return sources;
  } catch {}
};
export let sourcesExist = (path = sources_path) => {
  try {
    fs.accessSync(path);
    let files = fs.readdirSync(path);
    return files.length > 0;
  } catch {
    return false;
  }
};
export let saveSources = (hosts: Hosts, path = sources_path) => {
  console.log("Saving sources to " + path);

  try {
    fs.accessSync(path);
    _saveSources(hosts, path);
  } catch {
    fs.mkdirSync(path);
    _saveSources(hosts, path);
  }
};
export let _saveSources = (hosts: Hosts, path = sources_path) => {
  hosts.categories.forEach((h) => {
    let fpath = path + h.label + ".host";
    fs.writeFileSync(fpath, formatHosts({ categories: [h] }, true));
  });
};

export let deleteSource = (path = sources_path) => {
  let files = fs.readdirSync(path);
  files.forEach((file: string) => {
    return fs.unlinkSync(file);
  });
};

export function backupHostsFile() {
  return fs.copyFileSync(hosts_path, backup_path);
}
export function backupExists() {
  return fs.statSync(backup_path).isFile();
}
export function loadHostsFile(path = pre_hosts_path) {
  console.log("Loading hosts-file from " + path);

  try {
    fs.accessSync(path);
    let hostsFile = fs.readFileSync(path);
    return parse_hosts_file(hostsFile.toString());
  } catch {}
}
export let saveHostsFile = (hosts: Hosts, path = pre_hosts_path) => {
  console.log("Saving hosts-file to " + path);
  let h = formatHosts(hosts);
  return fs.writeFileSync(path, h);
};

export let notify = async (message: string): Promise<void> => {
  return await ipcRenderer.invoke("app:notify", message);
};

export let closeWindow = async (): Promise<void> => {
  return await ipcRenderer.invoke("app:close-window");
};
export let openUserFolder = async (): Promise<void> => {
  return await ipcRenderer.invoke("app:open-user-folder");
};