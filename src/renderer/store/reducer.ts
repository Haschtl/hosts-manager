import { combineReducers } from 'redux';
import { getUniqueID } from 'shared/helper';
import { SourceFiles, Settings } from '../../shared/types';
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
  systemHosts: { path: '', lines: [] },
  sourcesConfig: { sources: [] },
  sources: { files: [] },
  firewall: { rules: [] },
  searchText: '',
};
export const loadState = async () => {
  const config = await window.files.loadConfig();
  const exists = await window.files.sourcesExist();
  let sources: SourceFiles | undefined;
  const systemHosts = await window.files.loadHostsFile();
  if (exists) {
    sources = await window.files.loadSources();
    // if (sources) {
    //   window.files.saveSources(sources);
    // }
  }
  const sourcesConfig = await window.files.loadSourcesConfig();
  sources?.files.forEach((f) => {
    const c = sourcesConfig?.sources.find((s) => s.location === f.path);
    if (c === undefined) {
      sourcesConfig?.sources.push({
        applyRedirects: false,
        comment: 'Auto-imported',
        enabled: true,
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
  sourcesConfig?.sources.forEach((sc) => {
    const f = sources?.files.find((s) => s.path === sc.location);
    if (f === undefined) {
      const id = sc.label;
      sources?.files.push({ path: `./sources/${id}.hosts`, lines: [] });
    }
  });
  const rules = await window.firewall.rules.get();
  return {
    active: false,
    version: VERSION,
    settings: { ...config, ...initialSettings },
    firewall: { rules },
    sources,
    systemHosts,
    sourcesConfig,
  } as Partial<AppState>;
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
    case 'setSearchText':
      return { ...state, searchText: action.payload.text };
    case 'setElevated':
      return { ...state, isElevated: action.payload.value };
    case 'setSettings':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload.settings },
      };
    case 'resetSettings':
      return { ...state, settings: initialSettings };

    case 'setHostsFile':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      if (idx === -1) {
        state.sources.files.push(action.payload.file);
      } else {
        state.sources.files[idx] = action.payload.file;
      }
      return { ...state, sources: { files: state.sources.files } };
    case 'setSourceConfig':
      idx = state.sourcesConfig.sources.findIndex(
        (sc) => sc.id === action.payload.config.id
      );
      if (idx === -1) {
        state.sourcesConfig.sources.push(action.payload.config);
      } else {
        state.sourcesConfig.sources[idx] = action.payload.config;
      }
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
        state.sourcesConfig.sources.splice(idx, 1);
      }
      return {
        ...state,
        sources: {
          files: state.sources.files,
        },
      };
    case 'addSource':
      state.sourcesConfig.sources.push(action.payload.config);
      return {
        ...state,
        sources: { files: state.sources.files },
      };

    case 'setHostsLine':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      // state.sources.files[idx].lines.push(action.payload.line);
      state.sources.files[idx].lines[action.payload.idx] = action.payload.line;
      state.sources.files[idx].lines = [...state.sources.files[idx].lines];
      state.sources.files[idx] = { ...state.sources.files[idx] };
      console.log(state.sources.files);
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
