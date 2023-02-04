import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import path from 'path';

import {
  FirewallRule,
  FirewallRuleO,
  HostsFile,
  Settings,
  SourceConfigFile,
  SourceFiles,
} from '../shared/types';

export type Channels =
  | 'ipc-example'
  | 'app:load-config'
  | 'app:save-config'
  | 'app:load-sources'
  | 'app:sources-exist'
  | 'app:save-sources'
  | 'app:delete-sources'
  | 'app:backup-hosts-file'
  | 'app:load-hosts-file'
  | 'app:save-hosts-file'
  | 'app:download-file'
  | 'app:open-user-folder'
  | 'app:is-elevated'
  | 'app:notify'
  | 'app:close-window';

const electronHandler = {
  startDrag: (fileName: string) => {
    ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName));
  },
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
    startDrag: (fileName: string) => {
      ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName));
    },
  },
};

const darkModeHandler = {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
};

const filesHandler = {
  importFile: async (origPath: string, newPath: string): Promise<void> => {
    return ipcRenderer.invoke('app:import-file', origPath, newPath);
  },
  loadConfig: async (): Promise<Partial<Settings> | undefined> => {
    return ipcRenderer.invoke('app:load-config');
  },
  saveConfig: async (config: Settings): Promise<void> => {
    return ipcRenderer.invoke('app:save-config', config);
  },
  loadSourcesConfig: async (): Promise<SourceConfigFile> => {
    return ipcRenderer.invoke('app:load-sources-config');
  },
  saveSourcesConfig: async (config: SourceConfigFile): Promise<void> => {
    return ipcRenderer.invoke('app:save-sources-config', config);
  },
  loadSources: async (): Promise<SourceFiles> => {
    return ipcRenderer.invoke('app:load-sources');
  },
  loadProfiles: async (): Promise<HostsFile[] | undefined> => {
    return ipcRenderer.invoke('app:load-profiles');
  },
  removeProfile: async (filepath: string): Promise<HostsFile[] | undefined> => {
    return ipcRenderer.invoke('app:remove-profile', filepath);
  },
  applyProfile: async (filepath: string): Promise<HostsFile | undefined> => {
    return ipcRenderer.invoke('app:apply-profile', filepath);
  },
  sourcesExist: async (): Promise<boolean> => {
    return ipcRenderer.invoke('app:sources-exist');
  },
  saveSources: async (sources: SourceFiles): Promise<void> => {
    return ipcRenderer.invoke('app:save-sources', sources);
  },
  deleteSources: async (filepath: string): Promise<void> => {
    return ipcRenderer.invoke('app:delete-sources', filepath);
  },
  backupHostsFile: async (
    filepath?: string
  ): Promise<HostsFile | undefined> => {
    return ipcRenderer.invoke('app:backup-hosts-file', filepath);
  },
  loadHostsFile: async (
    system: string | boolean | undefined = true
  ): Promise<HostsFile | undefined> => {
    return ipcRenderer.invoke('app:load-hosts-file', system);
  },
  saveHostsFile: async (
    sources: SourceFiles,
    config: SourceConfigFile,
    system: string | boolean | undefined = true,
    includeIPv6 = true,
    hostOverwrite?: string,
    removeComments = false
  ): Promise<void> => {
    return ipcRenderer.invoke(
      'app:save-hosts-file',
      sources,
      config,
      system,
      includeIPv6,
      hostOverwrite,
      removeComments
    );
  },
  downloadFile: async (
    url: string,
    filepath: string
  ): Promise<HostsFile | undefined> => {
    return ipcRenderer.invoke('app:download-file', url, filepath);
  },
  openUserFolder: async (): Promise<void> => {
    return ipcRenderer.invoke('app:open-user-folder');
  },
  isElevated: async (): Promise<boolean> => {
    return ipcRenderer.invoke('app:is-elevated');
  },
  notify: async (message: string): Promise<void> => {
    return ipcRenderer.invoke('app:notify', message);
  },
  closeWindow: async (): Promise<void> => {
    return ipcRenderer.invoke('app:close-window');
  },
};

const taskbarHandler = {
  flash: async (value: boolean) => {
    if (value) {
      return ipcRenderer.invoke('taskbar:flash:start');
    }
    return ipcRenderer.invoke('taskbar:flash:stop');
  },
  progress: async (value: number) => {
    return ipcRenderer.invoke('taskbar:set-progress', value);
  },
  tray: {
    tooltip: async (value: string) => {
      return ipcRenderer.invoke('taskbar:tray:tooltip', value);
    },
  },
};

const dnsHandler = {
  resolve: async (value: string): Promise<string[] | undefined> => {
    return ipcRenderer.invoke('dns:resolve', value);
  },
  lookup: async (
    value: string
  ): Promise<{
    address?: string;
    family?: number;
    error: NodeJS.ErrnoException | null;
  }> => {
    return ipcRenderer.invoke('dns:lookup', value);
  },
};
const firewallHandler = {
  rules: {
    get: async (): Promise<FirewallRule[]> => {
      return ipcRenderer.invoke('firewall:rules:get');
    },
    set: async (newRule: FirewallRuleO) => {
      return ipcRenderer.invoke('firewall:rules:set', newRule);
    },
    new: async (newRule: FirewallRuleO) => {
      return ipcRenderer.invoke('firewall:rules:new', newRule);
    },
    copy: async (newRule: FirewallRuleO) => {
      return ipcRenderer.invoke('firewall:rules:copy', newRule);
    },
    remove: async (newRule: FirewallRuleO) => {
      return ipcRenderer.invoke('firewall:rules:remove', newRule);
    },
    rename: async (newRule: FirewallRuleO) => {
      return ipcRenderer.invoke('firewall:rules:rename', newRule);
    },
    toggle: async (newRule: FirewallRuleO, value: boolean) => {
      return ipcRenderer.invoke('firewall:rules:toggle', newRule, value);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
contextBridge.exposeInMainWorld('darkMode', darkModeHandler);
contextBridge.exposeInMainWorld('files', filesHandler);
contextBridge.exposeInMainWorld('taskbar', taskbarHandler);
contextBridge.exposeInMainWorld('dns', dnsHandler);
contextBridge.exposeInMainWorld('firewall', firewallHandler);

export type ElectronHandler = typeof electronHandler;
export type FilesHandler = typeof filesHandler;
export type TaskbarHandler = typeof taskbarHandler;
export type DarkModeHandler = typeof darkModeHandler;
export type DNSHandler = typeof dnsHandler;
export type FirewallHandler = typeof firewallHandler;
