export type Sources = Source[];
export type Source = SourceConfig & HostsFile;
export type SourceConfigFile = { sources: SourceConfig[] };
export type SourceFiles = { files: HostsFile[] };
export type SourceConfig = {
  id: number;
  enabled?: boolean;
  label: string;
  format: 'block' | 'allow';
  type: 'url' | 'file';
  location: string;
  applyRedirects: boolean;
  comment?: string;
  lastChange?: string;
  url?: string;
};
export type HostsFile = {
  path: string;
  lines: HostsLine[];
};
export type HostsLine = {
  domain?: string;
  host?: string;
  comment?: string;
  enabled: boolean;
};

export type Settings = {
  darkMode?: boolean;
  autoUpdates: boolean;
  blockMode: 'admin' | 'vpn';
  ipv6: boolean;
  diagnostics: boolean;
  logging: boolean;
};

export type FirewallRule = {
  Name: string;
  DisplayName: string;
  Description: string;
  DisplayGroup: string;
  Group: string;
  Enabled: boolean;
  Profile: string;
  Platform: string;
  Direction: 'Outbound' | 'Inbound';
  Action: 'Allow' | 'Block';
  EdgeTraversalPolicy: 'Allow' | 'Block';
  LooseSourceMapping: boolean;
  LocalOnlyMapping: boolean;
  Owner: string;
  PrimaryStatus: string;
  EnforcementStatus: string;
  PolicyStoreSource: string;
  PolicyStoreSourceType: string;
  RemoteDynamicKeywordAddresses: string;
};

export type FirewallRuleO = Partial<FirewallRule>;
