import {
  Settings,
  SourceConfigFile,
  SourceFiles,
  HostsFile,
  FirewallRule,
} from '../../shared/types';

export type AppState = {
  active: boolean;
  isElevated: boolean;
  version: string;
  settings: Settings;
  sources: SourceFiles;
  sourcesConfig: SourceConfigFile;
  systemHosts: HostsFile;
  firewall: {
    rules: FirewallRule[];
  };
  searchText: string;
};

export type State = {
  app: AppState;
};
