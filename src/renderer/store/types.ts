import { Hosts, Settings } from '../../shared/types';

export type AppState = {
  active: boolean;
  isElevated: boolean;
  version: string;
  settings: Settings;
  hosts: Hosts;
};

export type State = {
  app: AppState;
};
