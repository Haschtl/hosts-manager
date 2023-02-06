/* eslint no-console: off */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import fs from 'fs';
import https from 'https';
import { app, dialog } from 'electron';
import { exec, ExecException } from 'child_process';

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
import { annotateSources } from '../../shared/helper';

export const userFolder = `${app.getPath('home')}/.hosts`;
let hostsPath: string;
if (process.platform === 'win32') {
  hostsPath = 'C://windows/system32/drivers/etc/hosts';
} else if (process.platform === 'darwin') {
  hostsPath = '/private/etc/hosts';
} else {
  hostsPath = '/etc/hosts';
}
const sourcesFolder = `${userFolder}/sources/`;
const preHostsPath = `${userFolder}/hosts`;
const configPath = `${userFolder}/config.json`;
const sourcesPath = `${userFolder}/sources.json`;
const profilesFolder = `${userFolder}/profiles/`;

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
type ExecReturn = {
  error: ExecException | null;
  stdout: string;
  stderr: string;
};

/** Options to use when running an executable as admin */
interface RunAsAdminCommand {
  /** Path to the executable to run */
  path: string;
  /** Working dir to run the executable from */
  workingDir?: string;
}
/**
 * Runs a PowerShell command or an executable as admin
 *
 * @param command If a string is provided, it will be used as a command to
 *   execute in an elevated PowerShell. If an object with `path` is provided,
 *   the executable will be started in Run As Admin mode
 *
 * If providing a string for elevated PowerShell, ensure the command is parsed
 *   by PowerShell correctly by using an interpolated string and wrap the
 *   command in double quotes.
 *
 * Example:
 *
 * ```
 * `"Do-The-Thing -Param '${pathToFile}'"`
 * ```
 */

export const runAsAdminBase = async (command: string | RunAsAdminCommand) => {
  const usePowerShell = typeof command === 'string';
  let args;
  if (usePowerShell) {
    args = `-ArgumentList "${command.replaceAll('"', '`"')}"`;
  } else {
    args = `-FilePath '${command.path}'`;
    if (command.workingDir) {
      args += ` -WorkingDirectory '${command.workingDir}'`;
    }
  }
  const cmd = `Start-Process ${
    usePowerShell ? 'PowerShell' : ''
  } -Verb RunAs -WindowStyle Hidden -PassThru ${
    usePowerShell ? '-Wait' : ''
  } ${args}`;
  console.log(cmd);

  return new Promise<ExecReturn>((resolve) => {
    exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
      console.log(error, stdout, stderr);
      resolve({ error, stdout, stderr });
    });
  });
};
export const runScriptAsAdmin = async (script: string) => {
  const absPath = extendPath('./temp.ps1');
  fs.writeFileSync(absPath, script);
  return runAsAdminBase({ path: absPath, workingDir: userFolder });
};
export const runAsAdmin = async (
  command: string | RunAsAdminCommand,
  useScript = false
) => {
  if (useScript && typeof command === 'string') {
    return runScriptAsAdmin(command);
  }
  return runAsAdminBase(command);
};

export function openFolder(path: string) {
  return new Promise<ExecReturn>((resolve) =>
    exec(`start "${path}"`, (error, stdout, stderr) =>
      resolve({ error, stdout, stderr })
    )
  );
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
  console.log(`Setting profile ${absPath} to ${hostsPath}`);
  return runAsAdmin(`copy ${absPath} ${hostsPath}`).then(({ error }) => {
    if (!error) {
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
