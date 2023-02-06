import {
  FirewallProfile,
  FirewallRule,
  FirewallSetting,
  HostsFile,
  HostsLine,
  Settings,
  SourceConfig,
} from '../../shared/types';
import { AppState, FirewallFilter } from './types';

export const setState = (state: Partial<AppState>) => ({
  type: 'setState',
  payload: { state },
});
export const setActive = (value: boolean) => ({
  type: 'setActive',
  payload: { value },
});
export const setElevated = (value: boolean) => ({
  type: 'setElevated',
  payload: { value },
});
export const setSettings = (settings: Settings) => ({
  type: 'setSettings',
  payload: { settings },
});
export const resetSettings = () => ({
  type: 'resetSettings',
  payload: {},
});

export const setSearchText = (text: string) => ({
  type: 'setSearchText',
  payload: { text },
});
export const setHostsFile = (file: HostsFile) => ({
  type: 'setHostsFile',
  payload: { file },
});
export const setSourceConfig = (config: SourceConfig) => ({
  type: 'setSourceConfig',
  payload: { config },
});
export const setActiveProfile = (value: string) => ({
  type: 'setActiveProfile',
  payload: { value },
});
export const setFirewallRules = (rules: FirewallRule[]) => ({
  type: 'setFirewallRules',
  payload: { rules },
});
export const setFirewallRule = (rule: FirewallRule) => ({
  type: 'setFirewallRule',
  payload: { rule },
});
export const setFirewallSettings = (setting: FirewallSetting) => ({
  type: 'setFirewallSettings',
  payload: { setting },
});
export const removeFirewallRule = (displayName: string) => ({
  type: 'removeFirewallRule',
  payload: { displayName },
});
export const setFirewallProfiles = (profiles: FirewallProfile[]) => ({
  type: 'setFirewallProfiles',
  payload: { profiles },
});
export const setFirewallFilter = (filter: Partial<FirewallFilter>) => ({
  type: 'setFirewallFilter',
  payload: { filter },
});
export const setHostsLine = (
  file: HostsFile,
  idx: number,
  line: HostsLine
) => ({
  type: 'setHostsLine',
  payload: { file, idx, line },
});

export const rmHostsLine = (file: HostsFile, idx: number) => ({
  type: 'setHostsLine',
  payload: { file, idx },
});

export const rmSource = (id: number) => ({
  type: 'rmSource',
  payload: { id },
});

export const setProfiles = (profiles: HostsFile[]) => ({
  type: 'setProfiles',
  payload: { profiles },
});
export const addHostsLine = (file: HostsFile, line: HostsLine) => ({
  type: 'setHostsLine',
  payload: { file, line },
});

export const setSystemHosts = (file: HostsFile) => ({
  type: 'setSystemHosts',
  payload: { file },
});
