import {AppState} from './types';

export const setState = (state: AppState) => ({
  type: 'setState',
  payload: state,
});
export const setActive = (value: boolean) => ({
  type: 'setActive',
  payload: value,
});
