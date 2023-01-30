export type Hosts = {
  categories: HostsCategory[];
};
export type SourceConfig = {
  enabled?: boolean;
  label: string;
  format: "block" | "allow";
  type: "url" | "file";
  location?: string;
  applyRedirects: boolean;
  comment?: string;
  lastChange?: string;
};
export type HostsCategory = SourceConfig & {
  content: HostsLine[];
};
export type HostsFile = {
  lines: HostsLine[];
};
export type HostsLine = {
  domain?: string;
  host?: string;
  comment?: string;
  enabled: boolean;
};

export type Settings = {
  darkMode: boolean;
  autoUpdates: boolean;
  blockMode: "admin" | "vpn";
  ipv6: boolean;
  diagnostics: boolean;
  logging: boolean;
};
