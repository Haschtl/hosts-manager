import { combineReducers } from 'redux';
import {
  loadConfig,
  loadHostsFile,
  loadSources,
  saveSources,
  sourcesExist,
} from '../ipc/files';
import { Hosts, Settings } from '../../shared/types';
import { AppState } from './types';

const VERSION = '1.0.0';
export const initialSettings: Settings = {
  autoUpdates: true,
  blockMode: 'admin',
  darkMode: true,
  diagnostics: true,
  ipv6: true,
  logging: true,
};
export const initialState: AppState = {
  active: false,
  isElevated: true,
  version: VERSION,
  settings: initialSettings,
  hosts: { categories: [] },
};
export const loadState = async () => {
  const config = await loadConfig();
  const exists = await sourcesExist();
  let sources: Hosts | undefined;
  if (exists) {
    sources = await loadSources();
    if (sources) {
      saveSources(sources);
    }
  } else {
    sources = await loadHostsFile();
  }
  return {
    active: false,
    version: VERSION,
    settings: { ...config, ...initialSettings },
    hosts: sources !== undefined ? sources : { categories: [] },
  } as AppState;
};

const appReducer = (
  state = initialState,
  action: { type: string; payload: any }
): AppState => {
  let idx: number;
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.payload.state };
    case 'setActive':
      return { ...state, active: action.payload.value };
    case 'setElevated':
      return { ...state, isElevated: action.payload.value };
    case 'setSettings':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload.settings },
      };
    case 'resetSettings':
      return { ...state, settings: initialSettings };

    case 'setHostCategory':
      state.hosts.categories[action.payload.idx] = action.payload.category;
      return { ...state, hosts: { categories: state.hosts.categories } };
    case 'rmHostCategory':
      state.hosts.categories.splice(action.payload.idx, 1);
      return {
        ...state,
        hosts: {
          categories: state.hosts.categories,
        },
      };
    case 'addHostCategory':
      state.hosts.categories.push(action.payload.category);
      return {
        ...state,
        hosts: { categories: state.hosts.categories },
      };

    case 'setHostsLine':
      idx = state.hosts.categories.indexOf(action.payload.category);
      state.hosts.categories[idx].content.push(action.payload.line);
      state.hosts.categories[idx].content[action.payload.idx] =
        action.payload.line;
      state.hosts.categories[idx].content = [
        ...state.hosts.categories[idx].content,
      ];
      // _category.content = [..._category.content];
      state.hosts.categories[idx] = { ...state.hosts.categories[idx] };
      console.log(state.hosts.categories);
      return {
        ...state,
        hosts: {
          categories: state.hosts.categories,
        },
      };
    case 'rmHostsLine':
      idx = state.hosts.categories.indexOf(action.payload.category);
      state.hosts.categories[idx].content.push(action.payload.line);
      state.hosts.categories[idx].content.splice(action.payload.idx, 1);
      state.hosts.categories[idx] = { ...state.hosts.categories[idx] };
      return {
        ...state,
        hosts: {
          categories: state.hosts.categories,
        },
      };
    case 'addHostsLine':
      idx = state.hosts.categories.findIndex(action.payload.category);
      state.hosts.categories[idx].content.push(action.payload.line);
      return {
        ...state,
        hosts: { categories: state.hosts.categories },
      };

    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer,
});
