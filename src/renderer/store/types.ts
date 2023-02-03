import {
  Settings,
  SourceConfigFile,
  SourceFiles,
  HostsFile,
  FirewallRule,
  SourceConfig,
} from '../../shared/types';

export type AppState = {
  active: boolean;
  isElevated: boolean;
  version: string;
  settings: Settings;
  sources: SourceFiles;
  sourcesConfig: SourceConfigFile;
  systemHosts: HostsFile;
  profiles: HostsFile[];
  sourceTemplates: Partial<SourceConfig>[];
  firewall: {
    rules: FirewallRule[];
  };
  searchText: string;
};

export type State = {
  app: AppState;
};
