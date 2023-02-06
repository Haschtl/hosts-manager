import {
  DarkModeHandler,
  DNSHandler,
  ElectronHandler,
  FilesHandler,
  FirewallHandler,
  TaskbarHandler,
} from 'main/preload';

declare global {
  interface Window {
    electron: ElectronHandler;
    darkMode: DarkModeHandler;
    files: FilesHandler;
    taskbar: TaskbarHandler;
    firewall: FirewallHandler;
    dns: DNSHandler;
  }
}

export {};
