/* eslint no-console: off */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import fs from 'fs';
import https from 'https';
import { dialog } from 'electron';

import {
  mergeSources,
  hostsFileToString,
  parseHostsFile,
} from './hosts_manager';
import {
  HostsFile,
  Settings,
  SourceConfigFile,
  SourceFiles,
} from '../../shared/types';
import { annotateSources, path2profilename } from '../../shared/helper';
import { execAdmin } from '../util/os';
import {
  configPath,
  extendPath,
  preHostsPath,
  profilesFolder,
  shortenPath,
  sourcesFolder,
  sourcesPath,
  userFolder,
} from '../util/userFolder';

let hostsPath: string;
if (process.platform === 'win32') {
  hostsPath = 'C://windows/system32/drivers/etc/hosts';
} else if (process.platform === 'darwin') {
  hostsPath = '/private/etc/hosts';
} else {
  hostsPath = '/etc/hosts';
}
export function fileExists(path: string) {
  const absPath = extendPath(path);
  return fs.existsSync(absPath);
}
export function showOpenDialog(
  filters = [
    { extensions: ['exe'], name: 'Executable' },
    { extensions: ['*'], name: 'All' },
  ],
  title = 'Select executable',
  message = 'Select a executable',
  buttonLabel = 'Select',
  properties: (
    | 'openFile'
    | 'showHiddenFiles'
    | 'openDirectory'
    | 'multiSelections'
    | 'createDirectory'
    | 'promptToCreate'
    | 'noResolveAliases'
    | 'treatPackageAsDirectory'
    | 'dontAddToRecent'
  )[] = ['openFile', 'showHiddenFiles']
) {
  return dialog.showOpenDialog({
    properties,
    buttonLabel,
    filters,
    message,
    title,
  });
}

function httpGet(url: string, path: string) {
  const file = fs.createWriteStream(path);

  return new Promise<string>((resolve) => {
    https.get(url, (response) => {
      response.pipe(file);
      // after download completed close filestream
      file.on('finish', () => {
        file.close();
        console.log('Download Completed');
        resolve(fs.readFileSync(path).toString());
      });
    });
  });
}

export const downloadFile = (url: string, path = sourcesFolder) => {
  const absPath = extendPath(path);
  try {
    fs.accessSync(absPath);
  } catch (e) {
    console.log(e);
  }
  if (!fs.existsSync(absPath)) {
    fs.openSync(absPath, 'w');
  }
  console.log(`Writing ${url} to ${absPath}`);
  return httpGet(url, absPath)
    .then((c) => {
      return {
        path: shortenPath(absPath),
        lines: parseHostsFile(c),
      } as HostsFile;
    })
    .catch((e) => {
      console.log(e);
      return undefined;
    });
};

export const loadConfig = (path = configPath) => {
  const absPath = extendPath(path);
  console.log(`Loading settings from ${absPath}`);

  try {
    fs.accessSync(absPath);
    return {
      ...JSON.parse(fs.readFileSync(absPath).toString()),
    } as Partial<Settings>;
  } catch (e) {
    console.log('Warning: No ./config.json found.');
    return {
      autoUpdates: false,
      blockMode: 'admin',
      darkMode: true,
      diagnostics: false,
      ipv6: true,
      logging: false,
      blockedHostOverwrite: '0.0.0.0',
      removeComments: false,
    } as Settings;
  }
};
export const saveConfig = (config: Settings, path = configPath) => {
  const absPath = extendPath(path);
  console.log(`Saving settings to ${absPath}`);
  return fs.writeFileSync(absPath, JSON.stringify(config));
};
export const loadSourceConfig = (path = sourcesPath) => {
  const absPath = extendPath(path);
  console.log(`Loading sources config from ${absPath}`);

  try {
    fs.accessSync(absPath);
    return {
      ...JSON.parse(fs.readFileSync(absPath).toString()),
    } as SourceConfigFile;
  } catch (e) {
    console.log('Warning: ./sources.json does not exist.');
    return { sources: [] } as SourceConfigFile;
  }
};
export const saveSourceConfig = (
  config: SourceConfigFile,
  path = sourcesPath
) => {
  const absPath = extendPath(path);
  console.log(`Saving source config to ${absPath}`);
  return fs.writeFileSync(absPath, JSON.stringify(config));
};

export const sourcesExist = (path = sourcesFolder) => {
  const absPath = extendPath(path);
  try {
    fs.accessSync(absPath);
    const files = fs.readdirSync(absPath);
    return files.length > 0;
  } catch {
    return false;
  }
};

export const saveSources = (hosts: SourceFiles) => {
  hosts.files.forEach((h) => {
    const fpath = extendPath(h.path);
    console.log(`Saving sources to ${fpath}`);
    fs.writeFileSync(fpath, hostsFileToString(h.lines, []));
  });
};

export const deleteSource = (path = sourcesFolder) => {
  const absPath = extendPath(path);
  if (fileExists(absPath)) {
    fs.unlinkSync(absPath);
  }
};

export const importFile = (origPath: string, newPath: string) => {
  const absPath = extendPath(newPath);
  if (fileExists(origPath)) {
    fs.renameSync(origPath, absPath);
  }
};

export function loadHostsFile(system?: boolean | string) {
  let path = hostsPath;
  if (typeof system === 'string') {
    path = extendPath(system);
  } else if (!system) {
    path = preHostsPath;
  }
  console.log(`Loading hosts-file from ${path}`);
  try {
    fs.accessSync(path);
    const hostsFile = fs.readFileSync(path);
    const stat = fs.statSync(path);
    return {
      ...stat,
      path: shortenPath(path),
      lines: parseHostsFile(hostsFile.toString()),
    } as HostsFile;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
export function backupHostsFile(filepath?: string) {
  if (filepath === undefined) {
    const id = `hosts_${new Date(Date.now())
      .toUTCString()
      .replaceAll(' ', '_')
      .replaceAll(',', '_')
      .replaceAll(':', '_')}`;
    // eslint-disable-next-line no-param-reassign
    filepath = `./profiles/${id}.hosts`;
  }
  const absPath = extendPath(filepath);
  fs.copyFileSync(hostsPath, absPath);
  return loadHostsFile(absPath);
}
export function hostsFileAsSource(filepath?: string) {
  if (filepath === undefined) {
    // eslint-disable-next-line no-param-reassign
    filepath = `./sources/hostsBackup.hosts`;
  }
  const absPath = extendPath(filepath);
  fs.copyFileSync(hostsPath, absPath);
  return loadHostsFile(absPath);
}

export const loadSources = (path = sourcesFolder) => {
  const absPath = extendPath(path);
  console.log(`Loading sources from ${absPath}`);
  try {
    fs.accessSync(absPath);
    const files = fs.readdirSync(absPath);
    console.log(`Found files: ${files.join(', ')}`);
    const promises = files.map((file: string) => {
      return loadHostsFile(absPath + file);
    });
    const sources: SourceFiles = { files: [] };
    promises.forEach((h) => {
      if (h) {
        sources.files = [...sources.files, h];
      }
    });
    return sources;
  } catch (e) {
    console.log('Warning: No sources found');
    return { files: [] };
  }
};

export const loadProfiles = (path = profilesFolder) => {
  const absPath = extendPath(path);
  console.log(`Loading sources from ${absPath}`);
  try {
    fs.accessSync(absPath);
    const files = fs.readdirSync(absPath);
    console.log(`Found profiles: ${files.join(', ')}`);
    const promises = files.map((file: string) => {
      return loadHostsFile(absPath + file);
    });
    const sources: SourceFiles = { files: [] };
    promises.forEach((h) => {
      if (h) {
        sources.files = [...sources.files, h];
      }
    });
    return sources.files;
  } catch (e) {
    console.log('Warning: No profiles found.');
    return [];
  }
};
export const removeProfile = (path: string) => {
  const absPath = extendPath(path);
  console.log(`Removing profile ${absPath}`);
  fs.unlinkSync(absPath);
  return loadProfiles();
};
export const applyProfile = (path: string) => {
  const absPath = extendPath(path);
  const id = path2profilename(path);
  console.log(`Setting profile ${absPath} to ${hostsPath}`);
  return execAdmin(`copy '${absPath}' '${hostsPath}'`).then(({ error }) => {
    if (!error) {
      const currentConfig = loadSourceConfig();
      saveSourceConfig({ ...currentConfig, active: id });
      return loadHostsFile(true);
    }
    return undefined;
  });
};

export const saveHostsFile = (
  sources: SourceFiles,
  config: SourceConfigFile,
  system: boolean | string = true,
  includeIPv6 = true,
  hostOverwrite?: string,
  removeComments = false
) => {
  let path = hostsPath;
  if (typeof system === 'string') {
    path = extendPath(system);
  } else if (!system) {
    path = preHostsPath;
  }
  console.log(`Saving hosts-file to ${path}`);
  const h = hostsFileToString(
    mergeSources(annotateSources(sources, config), includeIPv6),
    [],
    hostOverwrite,
    removeComments
  );
  return fs.writeFileSync(path, h);
};

let isFirstRun = false;
if (!fileExists(userFolder)) {
  fs.mkdirSync(userFolder);
  isFirstRun = true;
}
[sourcesFolder, profilesFolder].forEach((p) => {
  if (!fileExists(p)) {
    fs.mkdirSync(p);
  }
});
if (isFirstRun) {
  backupHostsFile();
  hostsFileAsSource();
}
