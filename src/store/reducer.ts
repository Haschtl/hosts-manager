import {combineReducers} from 'redux';
import {AppState} from './types';

const initialState: AppState = {
  active: false,
  version: '1.0.0',
  settings: {
    autoUpdates: true,
    blockMode: 'admin',
    darkMode: true,
    diagnostics: true,
    ipv6: true,
    logging: true,
  },
  hosts: {categories: []},
};

const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'setState':
      return {...state, ...action.payload};
    case 'setActive':
      return {...state, active: action.payload};
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer,
});
