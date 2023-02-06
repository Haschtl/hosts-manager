import { Stats } from 'fs';

export type Sources = Source[];
export type Source = SourceConfig & HostsFile;
export type SourceConfigFile = { sources: SourceConfig[]; active?: string };
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
} & Partial<Stats>;
export type HostsLine = {
  domain?: string;
  host?: string;
  comment?: string;
  enabled: boolean;
};

export type Settings = {
  blockedHostOverwrite?: string;
  removeComments: boolean;
  darkMode?: boolean;
  autoUpdates: boolean;
  blockMode: 'admin' | 'vpn';
  ipv6: boolean;
  diagnostics: boolean;
  logging: boolean;
};

export type FirewallSetting = {
  Name?: string;
  Exemptions?: string;
  EnableStatefulFtp?: boolean;
  EnableStatefulPptp?: boolean;
  ActiveProfile?: string;
  RemoteMachineTransportAuthorizationList?: string;
  RemoteMachineTunnelAuthorizationList?: string;
  RemoteUserTransportAuthorizationList?: string;
  RemoteUserTunnelAuthorizationList?: string;
  RequireFullAuthSupport?: boolean;
  CertValidationLevel?: string;
  AllowIPsecThroughNAT?: string;
  MaxSAIdleTimeSeconds?: number;
  KeyEncoding?: string;
  EnablePacketQueuing?: string;
};
export type FirewallProfile = {
  Name?: string;
  Enabled?: boolean;
  DefaultInboundAction?: string;
  DefaultOutboundAction?: string;
  AllowInboundRules?: string;
  AllowLocalFirewallRules?: string;
  AllowLocalIPsecRules?: string;
  AllowUserApps?: string;
  AllowUserPorts?: string;
  AllowUnicastResponseToMulticast?: string;
  NotifyOnListen?: string;
  EnableStealthModeForIPsec?: string;
  LogFileName?: string;
  LogMaxSizeKilobytes?: string;
  LogAllowed?: string;
  LogBlocked?: string;
  LogIgnored?: string;
};
export type FirewallRule = {
  Name?: string;
  DisplayName?: string;
  Description?: string;
  DisplayGroup?: string;
  Group?: string;
  Enabled?: boolean;
  Profile?: string;
  Platform?: string;
  Direction?: 'Outbound' | 'Inbound';
  Action?: 'Allow' | 'Block';
  EdgeTraversalPolicy?: 'Allow' | 'Block';
  LooseSourceMapping?: boolean;
  LocalOnlyMapping?: boolean;
  Owner?: string;
  PrimaryStatus?: string;
  EnforcementStatus?: string;
  PolicyStoreSource?: string;
  PolicyStoreSourceType?: string;
  RemoteDynamicKeywordAddresses?: string;
  Status?: string;

  // $_ | Get-NetFirewallAddressFilter
  LocalAddress?: string;
  RemoteAddress?: string;

  // $_ | Get-NetFirewallServiceFilter
  Service?: string;

  // $_ | Get-NetFirewallApplicationFilter
  Program?: string;
  Package?: string;

  // $_ | Get-NetFirewallInterfaceFilter
  InterfaceAlias?: string;

  // $_ | Get-NetFirewallInterfaceTypeFilter
  InterfaceType?: string;

  // $_ | Get-NetFirewallPortFilter
  Protocol?:
    | 'UDP'
    | 'TCP'
    | 'HOPOPT'
    | 'ICMPv4'
    | 'IPv6'
    | 'IPv6-Route'
    | 'IPv6-Frag'
    | 'GRE'
    | 'ICMPv6'
    | 'IPv6-NoNxt'
    | 'IPv6-Opts'
    | 'VRRP'
    | 'PGM'
    | 'L2TP';
  LocalPort?: string;
  RemotePort?: string;
  IcmpType?: string;
  DynamicTarget?: string;

  // $_ | Get-NetFirewallSecurityFilter
  Authentication?: 'NotRequired' | 'Required';
  Encryption?: 'NotRequired' | 'Required';
  OverrideBlockRules?: boolean;
  LocalUser?: string;
  RemoteUser?: string;
  RemoteMachine?: string;
};

export type FirewallRuleKeys = keyof FirewallRule;

export type FirewallRuleO = Partial<FirewallRule>;
