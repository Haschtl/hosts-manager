import {combineReducers} from 'redux';
import {
  loadConfig,
  loadHostsFile,
  loadSources,
  saveSources,
  sourcesExist,
} from '../files';
import {AppState, Settings} from './types';
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
  hosts: {categories: []},
};
export const loadState = () => {
  return sourcesExist().then(exists => {
    let promises;
    if (exists) {
      promises = [loadConfig(), loadSources()];
    } else {
      promises = [loadConfig(), loadHostsFile()];
    }
    return Promise.all(promises).then(v => {
      if (!exists) {
        saveSources(v[1]);
      }
      return {
        active: false,
        version: VERSION,
        settings: v[0],
        hosts: v[1] !== undefined ? v[1] : {categories: []},
      } as AppState;
    });
  });
};

const appReducer = (
  state = initialState,
  action: {type: string; payload: any},
): AppState => {
  console.log(action);
  switch (action.type) {
    case 'setState':
      return {...state, ...action.payload.state};
    case 'setActive':
      return {...state, active: action.payload.value};
    case 'setElevated':
      return {...state, isElevated: action.payload.value};
    case 'setSettings':
      return {
        ...state,
        settings: {...state.settings, ...action.payload.settings},
      };
    case 'resetSettings':
      return {...state, settings: initialSettings};

    case 'setHostCategory':
      let categories = state.hosts.categories;
      categories[action.payload.idx] = action.payload.category;
      return {...state, hosts: {categories: categories}};
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
        hosts: {categories: state.hosts.categories},
      };

    case 'setHostsLine':
      let __idx = state.hosts.categories.indexOf(action.payload.category);
      state.hosts.categories[__idx].content.push(action.payload.line);
      let __categories = state.hosts.categories;
      let _category = __categories[__idx];
      _category.content[action.payload.idx] = action.payload.line;
      // _category.content = [..._category.content];
      __categories[__idx] = {..._category};
      return {
        ...state,
        hosts: {
          categories: __categories,
        },
      };
    case 'rmHostsLine':
      let _idx = state.hosts.categories.indexOf(action.payload.category);
      state.hosts.categories[_idx].content.push(action.payload.line);
      let _categories = state.hosts.categories;
      let category = _categories[_idx];
      category.content.splice(action.payload.idx, 1);
      // _category.content = [..._category.content];
      _categories[_idx] = {...category};
      return {
        ...state,
        hosts: {
          categories: _categories,
        },
      };
    case 'addHostsLine':
      let idx = state.hosts.categories.findIndex(action.payload.category);
      state.hosts.categories[idx].content.push(action.payload.line);
      return {
        ...state,
        hosts: {categories: state.hosts.categories},
      };

    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer,
});
