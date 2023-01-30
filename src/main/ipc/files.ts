/* eslint no-console: off */

import fs from 'fs';
import http from 'http';
import { dirname } from 'path';
import { app } from 'electron';

import { formatHosts, parseHostsFile } from './hosts_manager';
import { Hosts, Settings } from '../../shared/types';

export const userFolder = `${app.getPath('home')}/.adaway`;
const hostsPath = 'C://windows/system32/drivers/etc/hosts';
const backupFolder = `${userFolder}/backup/`;
const sourcesFolder = `${userFolder}/sources/`;
const preHostsPath = `${userFolder}/hosts`;
const backupPath = `${backupFolder}hosts.bak`;
const configPath = `${userFolder}/config.json`;
const sourcesPath = `${userFolder}/sources.json`;

function extendPath(path: string) {
  if (path.startsWith('./')) {
    return `${userFolder}/${path.replace('./', '')}`;
  }
  return path;
}

export const downloadFile = (url: string, path = sourcesFolder) => {
  const absPath = extendPath(path);
  try {
    fs.accessSync(absPath);
  } catch {
    fs.mkdirSync(absPath);
  }

  const file = fs.createWriteStream(absPath);
  http.get(url, (response: any) => {
    response.pipe(file);

    // after download completed close filestream
    file.on('finish', () => {
      file.close();
      console.log('Download Completed');
    });
  });
  file.close();
  return fs.readFileSync(absPath);
};

export const urlToFilename = (url: string) => {
  return `${url
    .replace('http://', '')
    .replace('https://', '')
    .replace('/', '_')}.host`;
};
export const loadConfig = (path = configPath) => {
  const absPath = extendPath(path);
  console.log(`Loading settings from ${absPath}`);

  try {
    fs.accessSync(absPath);
    return {
      ...JSON.parse(fs.readFileSync(absPath).toString()),
    } as Partial<Settings>;
  } catch {
    fs.mkdirSync(dirname(absPath));
    return undefined;
  }
};
export const saveConfig = (config: Settings, path = configPath) => {
  const absPath = extendPath(path);
  console.log(`Saving settings to ${absPath}`);
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

export const saveSourcesInner = (hosts: Hosts, path = sourcesFolder) => {
  const absPath = extendPath(path);
  hosts.categories.forEach((h) => {
    const fpath = `${absPath}${h.label}.host`;
    fs.writeFileSync(fpath, formatHosts({ categories: [h] }, true));
  });
};
export const saveSources = (hosts: Hosts, path = sourcesFolder) => {
  const absPath = extendPath(path);
  console.log(`Saving sources to ${absPath}`);

  try {
    fs.accessSync(absPath);
    saveSourcesInner(hosts, absPath);
  } catch {
    fs.mkdirSync(absPath);
    saveSourcesInner(hosts, absPath);
  }
};

export const deleteSource = (path = sourcesFolder) => {
  const absPath = extendPath(path);
  const files = fs.readdirSync(absPath);
  files.forEach((file: string) => {
    return fs.unlinkSync(file);
  });
};

export function backupHostsFile() {
  return fs.copyFileSync(hostsPath, backupPath);
}
export function fileExists(path = backupPath) {
  const absPath = extendPath(path);
  return fs.statSync(absPath).isFile();
}
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
    return parseHostsFile(hostsFile.toString());
  } catch {
    console.log('error');
    return undefined;
  }
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
    const sources: Hosts = { categories: [] };
    promises.forEach((h: any) => {
      if (h) {
        sources.categories = [...sources.categories, ...h.categories];
      }
    });
    return sources;
  } catch {
    console.log('error');
    return undefined;
  }
};

export const saveHostsFile = (
  hosts: Hosts,
  system: boolean | string = true
) => {
  let path = hostsPath;
  if (typeof system === 'string') {
    path = extendPath(system);
  } else if (!system) {
    path = preHostsPath;
  }
  console.log(`Saving hosts-file to ${path}`);
  const h = formatHosts(hosts);
  return fs.writeFileSync(path, h);
};
