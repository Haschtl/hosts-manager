import {Hosts} from '../hosts_manager';

export type AppState = {
  active: boolean;
  version: string;
  settings: Settings;
  hosts: Hosts;
};

export type State = {
  app: AppState;
};

export type Settings = {
  darkMode: boolean;
  autoUpdates: boolean;
  blockMode: 'admin' | 'vpn';
  ipv6: boolean;
  diagnostics: boolean;
  logging: boolean;
};
