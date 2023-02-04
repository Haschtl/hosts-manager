import { combineReducers } from 'redux';
import { getUniqueID } from 'shared/helper';
import { Settings } from '../../shared/types';
import { AppState } from './types';
import { sourceTemplates } from './templates';

const VERSION = '1.0.0';
export const initialSettings: Settings = {
  autoUpdates: false,
  blockMode: 'admin',
  darkMode: true,
  diagnostics: false,
  ipv6: true,
  logging: false,
  blockedHostOverwrite: '0.0.0.0',
  removeComments: false,
};
export const initialState: AppState = {
  sourceTemplates,
  active: false,
  isElevated: true,
  version: VERSION,
  settings: initialSettings,
  systemHosts: { path: '', lines: [] },
  sourcesConfig: { sources: [] },
  profiles: [],
  sources: { files: [] },
  firewall: { rules: [] },
  searchText: '',
};
export const loadState = async () => {
  const config = await window.files.loadConfig();
  const systemHosts = await window.files.loadHostsFile();
  const sources = await window.files.loadSources();
  const profiles = await window.files.loadProfiles();
  const sourcesConfig = await window.files.loadSourcesConfig();
  sourcesConfig?.sources.forEach((sc) => {
    const f = sources?.files.find((s) => s.path === sc.location);
    if (f === undefined) {
      const id = sc.label.replaceAll(' ', '_');
      sources?.files.push({ path: `./sources/${id}.hosts`, lines: [] });
    }
    if (sc.location === undefined) {
      sc.location = `./sources/${sc.label.replaceAll(' ', '_')}.hosts`;
    }
  });
  sources?.files.forEach((f) => {
    const c = sourcesConfig?.sources.find((s) => s.location === f.path);
    if (c === undefined) {
      sourcesConfig?.sources.push({
        applyRedirects: false,
        comment: 'Auto-imported',
        enabled: false,
        format: 'block',
        label: f.path,
        lastChange: new Date(Date.now()).toString(),
        location: f.path,
        type: 'file',
        url: undefined,
        id: getUniqueID(sourcesConfig),
      });
    }
  });
  return {
    active: false,
    version: VERSION,
    settings: { ...config, ...initialSettings },
    sources,
    profiles,
    systemHosts,
    sourcesConfig,
  } as Partial<AppState>;
};

const appReducer = (
  state = initialState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: { type: string; payload: any }
): AppState => {
  let idx: number;
  let id: number;
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.payload.state };
    case 'setActive':
      return { ...state, active: action.payload.value };
    case 'setSearchText':
      return { ...state, searchText: action.payload.text };
    case 'setElevated':
      return { ...state, isElevated: action.payload.value };
    case 'setProfiles':
      return { ...state, profiles: action.payload.profiles };
    case 'setSystemHosts':
      return { ...state, systemHosts: action.payload.file };
    case 'setFirewallRules':
      return { ...state, firewall: { rules: action.payload.rules } };
    case 'setSettings':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload.settings },
      };
    case 'resetSettings':
      return { ...state, settings: initialSettings };
    case 'setSourceConfig':
      id = action.payload.config.id;
      if (id === -1) {
        id = getUniqueID(state.sourcesConfig);
      }
      idx = state.sourcesConfig.sources.findIndex((sc) => sc.id === id);
      if (idx === -1) {
        state.sourcesConfig.sources.push(action.payload.config);
      } else {
        state.sourcesConfig.sources[idx] = action.payload.config;
      }
      window.files.saveSourcesConfig({ sources: state.sourcesConfig.sources });
      return {
        ...state,
        sourcesConfig: { sources: state.sourcesConfig.sources },
      };

    case 'rmSource':
      idx = state.sourcesConfig.sources.findIndex(
        (sc) => sc.id === action.payload.id
      );
      if (idx !== -1) {
        const fileIdx = state.sources.files.findIndex(
          (f) => f.path === state.sourcesConfig.sources[idx].location
        );
        const rmSource = state.sourcesConfig.sources.splice(idx, 1);
        window.files.deleteSources(rmSource[0].location);
        window.files.saveSourcesConfig(state.sourcesConfig);
        if (fileIdx !== -1) {
          state.sources.files.splice(fileIdx, 1);
        }
      }
      return {
        ...state,
        sourcesConfig: {
          sources: [...state.sourcesConfig.sources],
        },
        sources: {
          files: state.sources.files,
        },
      };
    case 'setHostsFile':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      if (idx === -1) {
        state.sources.files.push(action.payload.file);
      } else {
        state.sources.files[idx] = action.payload.file;
      }
      window.files.saveSources({ files: [action.payload.file] });
      return { ...state, sources: { files: state.sources.files } };
    case 'setHostsLine':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      state.sources.files[idx].lines[action.payload.idx] = action.payload.line;
      state.sources.files[idx].lines = [...state.sources.files[idx].lines];
      state.sources.files[idx] = { ...state.sources.files[idx] };
      window.files.saveSources({ files: [state.sources.files[idx]] });
      return {
        ...state,
        sources: {
          files: state.sources.files,
        },
      };
    case 'rmHostsLine':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      state.sources.files[idx].lines.splice(action.payload.idx, 1);
      state.sources.files[idx] = { ...state.sources.files[idx] };
      window.files.saveSources({ files: [state.sources.files[idx]] });
      return {
        ...state,
        sources: {
          files: state.sources.files,
        },
      };
    case 'addHostsLine':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      state.sources.files[idx].lines.push(action.payload.line);
      window.files.saveSources({ files: [state.sources.files[idx]] });
      return {
        ...state,
        sources: { files: state.sources.files },
      };

    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer,
});
