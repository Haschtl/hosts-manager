import {combineReducers} from 'redux';
import {AppState} from './types';

const initialState: AppState = {
  active: false,
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
