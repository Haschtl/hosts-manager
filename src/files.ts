// import { ipcRenderer } from "electron";
import { Hosts } from "./hosts_manager";
import { Settings } from "./store/types";
// const ipcRenderer = window.require("electron").ipcRenderer;
// const remote = window.require("electron").remote;
// const fs = remote.require("fs")
let ipcRenderer={
    invoke(p:string,...args:any[]){
        return undefined as any
    }
}

// export let getSystemHostsFile = async (): Promise<Response> => {
//   return await ipcRenderer.invoke("app:get-system-hosts-file");
// };

// export let setSystemHostsFile = async (): Promise<Response> => {
//   return await ipcRenderer.invoke("app:set-system-hosts-file");
// };

export let loadConfig = async (): Promise<Partial<Settings> | undefined> => {
  return await ipcRenderer.invoke("app:load-config");
};


export let saveConfig = async (config: Settings): Promise<void> => {
  return await ipcRenderer.invoke("app:save-config", config);
};

export let loadSources = async (): Promise<Hosts | undefined> => {
  return await ipcRenderer.invoke("app:load-sources");
};
export let sourcesExist = async (): Promise<boolean> => {
  return await ipcRenderer.invoke("app:sources-exist");
};
export let saveSources = async (sources: Hosts): Promise<void> => {
  return await ipcRenderer.invoke("app:save-sources", sources);
};
export let deleteSources = async (path: string): Promise<void> => {
  return await ipcRenderer.invoke("app:delete-sources", path);
};
export let backupHostsFile = async (): Promise<void> => {
  return await ipcRenderer.invoke("app:backup-hosts-file");
};
export let backupExists = async (): Promise<boolean> => {
  return await ipcRenderer.invoke("app:backup-exists");
};
export let loadHostsFile = async (system=true): Promise<Hosts | undefined> => {
  return await ipcRenderer.invoke("app:load-hosts-file",system);
};

export let saveHostsFile = async (
    hosts: Hosts,
    system: boolean=true,
): Promise<void> => {
  return await ipcRenderer.invoke("app:save-hosts-file", hosts, system);
};

export let downloadFile = async (url: string): Promise<Buffer> => {
  return await ipcRenderer.invoke("app:download-file", url);
};

export let openUserFolder = async (): Promise<void> => {
  return await ipcRenderer.invoke("app:open-user-folder");
};

export let isElevated = async (): Promise<boolean> => {
  return await ipcRenderer.invoke("app:is-elevated");
};

export let notify = async (message:string): Promise<void> => {
  return await ipcRenderer.invoke("app:notify",message);
};

export let closeWindow = async (): Promise<void> => {
  return await ipcRenderer.invoke("app:close-window");
};