import {
  HostsFile,
  HostsLine,
  Settings,
  SourceConfig,
} from '../../shared/types';
import { AppState } from './types';

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

export const addSource = (config: SourceConfig) => ({
  type: 'addSource',
  payload: { config },
});
export const addHostsLine = (file: HostsFile, line: HostsLine) => ({
  type: 'setHostsLine',
  payload: { file, line },
});
