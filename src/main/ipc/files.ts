/* eslint no-console: off */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import fs, { existsSync } from 'fs';
import https from 'https';
import { dirname } from 'path';
import { app } from 'electron';
import { elevate } from 'node-windows';
import { exec, ExecException, ExecOptions } from 'child_process';

import {
  // formatHosts,
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
import { annotateSources } from '../../shared/helper';

export const userFolder = `${app.getPath('home')}/.adaway`;
const hostsPath = 'C://windows/system32/drivers/etc/hosts';
const backupFolder = `${userFolder}/backup/`;
const sourcesFolder = `${userFolder}/sources/`;
const preHostsPath = `${userFolder}/hosts`;
const backupPath = `${backupFolder}hosts.bak`;
const configPath = `${userFolder}/config.json`;
const sourcesPath = `${userFolder}/sources.json`;
const profilesFolder = `${userFolder}/profiles/`;

function elevateSync(cmd: string) {
  return new Promise<{
    error: ExecException | null;
    stdout: string;
    stderr: string;
  }>((resolve, reject) => {
    exec(
      `Start-Process powershell -ArgumentList "${cmd}" -Verb runAs`,
      { shell: 'powershell.exe' },
      (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
        resolve({ error, stdout, stderr });
      }
    );
    // elevate(
    //   cmd,
    //   { shell: 'powershell.exe' } as ExecOptions,
    //   // @ts-ignore
    //   (error: ExecException | null, stdout: string, stderr: string) => {
    //     console.log(error, stdout, stderr);
    //     resolve({ error, stdout, stderr });
    //   }
    // );
  });
}
function extendPath(path: string) {
  if (path.startsWith('./')) {
    return `${userFolder}/${path.replace('./', '')}`;
  }
  return path;
}
function shortenPath(path: string) {
  if (path.startsWith(userFolder)) {
    return path.replace(`${userFolder}/`, './');
  }
  return path;
}
export function fileExists(path = backupPath) {
  const absPath = extendPath(path);
  // return fs.statSync(absPath).isFile();
  return fs.existsSync(absPath);
}

if (!fileExists(userFolder)) {
  fs.mkdirSync(userFolder);
}
[backupFolder, sourcesFolder, profilesFolder].forEach((p) => {
  if (!fileExists(p)) {
    fs.mkdirSync(p);
  }
});

function httpGet(url: string, path: string) {
  const file = fs.createWriteStream(path);

  return new Promise<string>((resolve, reject) => {
    https.get(url, (response: any) => {
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
  } catch {
    // fs.mkdirSync(absPath);
  }
  if (!fs.existsSync(absPath)) {
    const fd = fs.openSync(absPath, 'w');
    // fs.closeSync();
  }
  console.log(`Writing ${url} to ${absPath}`);
  try {
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
  } catch (e) {
    console.log(e);
    return new Promise<undefined>((resolve) => resolve(undefined));
  }
};

// export const urlToFilename = (url: string) => {
//   return `${url
//     .replace('http://', '')
//     .replace('https://', '')
//     .replace('/', '_')}.host`;
// };
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
export const loadSourceConfig = (path = sourcesPath) => {
  const absPath = extendPath(path);
  console.log(`Loading sources config from ${absPath}`);

  try {
    fs.accessSync(absPath);
    return {
      ...JSON.parse(fs.readFileSync(absPath).toString()),
    } as SourceConfigFile;
  } catch {
    fs.mkdirSync(dirname(absPath));
    return undefined;
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

export const saveSourcesInner = (hosts: SourceFiles) => {
  // const absPath = extendPath(path);
  hosts.files.forEach((h) => {
    const fpath = extendPath(h.path);
    console.log(`Saving sources to ${fpath}`);
    // const fpath = `${absPath}${h.label}.host`;
    fs.writeFileSync(fpath, hostsFileToString(h.lines, []));
  });
};
export const saveSources = (hosts: SourceFiles, path = sourcesFolder) => {
  const absPath = extendPath(path);
  saveSourcesInner(hosts);

  // try {
  //   fs.accessSync(absPath);
  //   saveSourcesInner(hosts, absPath);
  // } catch {
  //   fs.mkdirSync(absPath);
  //   saveSourcesInner(hosts, absPath);
  // }
};

export const deleteSource = (path = sourcesFolder) => {
  const absPath = extendPath(path);
  // const files = fs.readdirSync(absPath);
  if (fileExists(absPath)) {
    // files.forEach((file: string) => {
    fs.unlinkSync(absPath);
  }
  // });
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
export function backupHostsFile(filepath: string) {
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
    console.log(e);
    return undefined;
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
    console.log(e);
    return undefined;
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
  console.log(`Setting profile ${absPath} to ${hostsPath}`);
  return elevateSync(`copy ${absPath} ${hostsPath}`).then(({ error }) => {
    if (error === null) {
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
  } else {
    elevate('ls', undefined, () => {
      console.log('wow');
    });
  }
  console.log(`Saving hosts-file to ${path}`);
  const h = hostsFileToString(
    mergeSources(annotateSources(sources, config), includeIPv6),
    [],
    hostOverwrite,
    removeComments
  );
  // const h = formatHosts(annotateSources(sources, config));
  return fs.writeFileSync(path, h);
};
