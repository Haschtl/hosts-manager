import {
  Settings,
  SourceConfigFile,
  SourceFiles,
  HostsFile,
  FirewallRule,
  SourceConfig,
  FirewallProfile,
  FirewallSetting,
} from '../../shared/types';

export type FirewallFilter = {
  system: boolean;
  blocked: boolean;
  allowed: boolean;
  enabled: boolean;
  disabled: boolean;
};
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
    profiles: FirewallProfile[];
    settings?: FirewallSetting;
    filter: FirewallFilter;
  };
  searchText: string;
};

export type State = {
  app: AppState;
};
