import { app } from 'electron';

export const userFolder = `${app.getPath('home')}/.hosts`;
export const sourcesFolder = `${userFolder}/sources/`;
export const preHostsPath = `${userFolder}/hosts`;
export const configPath = `${userFolder}/config.json`;
export const sourcesPath = `${userFolder}/sources.json`;
export const profilesFolder = `${userFolder}/profiles/`;

export function extendPath(path: string) {
  if (path.startsWith('./')) {
    return `${userFolder}/${path.replace('./', '')}`;
  }
  return path;
}
export function shortenPath(path: string) {
  if (path.startsWith(userFolder)) {
    return path.replace(`${userFolder}/`, './');
  }
  return path;
}
