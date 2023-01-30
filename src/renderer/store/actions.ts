import { HostsCategory, HostsLine, Settings } from '../../shared/types';
import { AppState } from './types';

export const setState = (state: AppState) => ({
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

export const setHostCategory = (idx: number, category: HostsCategory) => ({
  type: 'setHostCategory',
  payload: { idx, category },
});
export const setHostsLine = (
  category: HostsCategory,
  idx: number,
  line: HostsLine
) => ({
  type: 'setHostsLine',
  payload: { category, idx, line },
});

export const rmHostsLine = (category: HostsCategory, idx: number) => ({
  type: 'setHostsLine',
  payload: { category, idx },
});

export const rmHostCategory = (idx: number) => ({
  type: 'rmHostCategory',
  payload: { idx },
});

export const addHostCategory = (category: HostsCategory) => ({
  type: 'addHostCategory',
  payload: { category },
});
export const addHostsLine = (category: HostsCategory, line: HostsLine) => ({
  type: 'setHostsLine',
  payload: { category, line },
});
