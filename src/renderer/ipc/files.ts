// import { ipcRenderer } from 'electron';
import { Settings, Hosts } from '../../shared/types';

// export const getSystemHostsFile = async (): Promise<Response> => {
//   return ipcRenderer.invoke("app:get-system-hosts-file");
// };

// export const setSystemHostsFile = async (): Promise<Response> => {
//   return ipcRenderer.invoke("app:set-system-hosts-file");
// };

export const loadConfig = async (): Promise<Partial<Settings> | undefined> => {
  return window.electron.ipcRenderer.invoke('app:load-config');
};

export const saveConfig = async (config: Settings): Promise<void> => {
  return window.electron.ipcRenderer.invoke('app:save-config', config);
};

export const loadSources = async (): Promise<Hosts | undefined> => {
  return window.electron.ipcRenderer.invoke('app:load-sources');
};
export const sourcesExist = async (): Promise<boolean> => {
  return window.electron.ipcRenderer.invoke('app:sources-exist');
};
export const saveSources = async (sources: Hosts): Promise<void> => {
  return window.electron.ipcRenderer.invoke('app:save-sources', sources);
};
export const deleteSources = async (path: string): Promise<void> => {
  return window.electron.ipcRenderer.invoke('app:delete-sources', path);
};
export const backupHostsFile = async (): Promise<void> => {
  return window.electron.ipcRenderer.invoke('app:backup-hosts-file');
};
// export const backupExists = async (): Promise<boolean> => {
//   return window.electron.ipcRenderer.invoke('app:backup-exists');
// };
export const loadHostsFile = async (
  system = true
): Promise<Hosts | undefined> => {
  return window.electron.ipcRenderer.invoke('app:load-hosts-file', system);
};

export const saveHostsFile = async (
  hosts: Hosts,
  system = true
): Promise<void> => {
  return window.electron.ipcRenderer.invoke(
    'app:save-hosts-file',
    hosts,
    system
  );
};

export const downloadFile = async (url: string): Promise<Buffer> => {
  return window.electron.ipcRenderer.invoke('app:download-file', url);
};

export const openUserFolder = async (): Promise<void> => {
  return window.electron.ipcRenderer.invoke('app:open-user-folder');
};

export const isElevated = async (): Promise<boolean> => {
  return window.electron.ipcRenderer.invoke('app:is-elevated');
};

export const notify = async (message: string): Promise<void> => {
  return window.electron.ipcRenderer.invoke('app:notify', message);
};

export const closeWindow = async (): Promise<void> => {
  return window.electron.ipcRenderer.invoke('app:close-window');
};
