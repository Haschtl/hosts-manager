import fs from 'react-native-fs';
import {formatHosts, Hosts, parse_hosts_file} from './hosts_manager';
import {initialSettings} from './store/reducer';
import {Settings} from './store/types';

let user_folder = fs.DocumentDirectoryPath + '/.adaway';
let hosts_path = 'C://windows/system32/drivers/etc/hosts';
let pre_hosts_path = user_folder + '/hosts';
let backup_path = user_folder + '/hosts.bak';
let config_path = user_folder + '/config.json';
let sources_path = user_folder + '/sources/';

export let downloadFile = (label: string, url: string) => {
  return fs
    .downloadFile({fromUrl: url, toFile: sources_path + label + '.host'})
    .promise.then(v => v);
};

export let loadConfig = (path = config_path) => {
  console.log('Loading settings from ' + path);
  return fs.exists(path).then(exists => {
    if (exists) {
      return fs.readFile(path).then(v => {
        return {...initialSettings, ...JSON.parse(v.toString())} as Settings;
      });
    } else {
      return fs.mkdir(user_folder).then(() => {
        return initialSettings;
      });
    }
  });
};
export let saveConfig = (config: Settings, path = config_path) => {
  console.log('Saving settings to ' + path);
  return fs.writeFile(path, JSON.stringify(config));
};
export let resetConfig = (path = config_path) => {
  console.log('Resetting settings ' + path);
  return fs.writeFile(path, JSON.stringify(initialSettings));
};

export let loadSources = (path = sources_path) => {
  console.log('Loading sources from ' + path);
  return fs.exists(path).then(exists => {
    if (exists) {
      return fs.readdir(path).then(files => {
        console.log('Found files: ' + files.join(', '));
        let promises = files.map(file => {
          return loadHostsFile(path + file);
        });
        return Promise.all(promises).then(v => {
          let sources: Hosts = {categories: []};
          v.forEach(h => {
            if (h) {
              sources.categories = [...sources.categories, ...h.categories];
            }
          });
          return sources;
        });
      });
    }
  });
};
export let sourcesExist = (path = sources_path) => {
  return fs.exists(path).then(exists => {
    if (exists) {
      return fs.readdir(path).then(files => files.length > 0);
    }
    return false;
  });
};
export let saveSources = (hosts: Hosts, path = sources_path) => {
  console.log('Saving sources to ' + path);
  fs.exists(path).then(exists => {
    if (!exists) {
      fs.mkdir(path).then(() => _saveSources(hosts, path));
    } else {
      _saveSources(hosts, path);
    }
  });
};
export let _saveSources = (hosts: Hosts, path = sources_path) => {
  hosts.categories.forEach(h => {
    let fpath = path + h.label + '.host';
    fs.writeFile(fpath, formatHosts({categories: [h]}, true));
  });
};

export let deleteSource = (path = sources_path) => {
  return fs.readdir(path).then(files => {
    return files.map(async file => {
      return fs.unlink(file);
    });
  });
};

export function backupHostsFile() {
  return fs.copyFile(hosts_path, backup_path);
}
export function backupExists() {
  return fs.exists(backup_path);
}
export function loadHostsFile(path = pre_hosts_path) {
  console.log('Loading hosts-file from ' + path);
  return fs.exists(path).then(exists => {
    if (exists) {
      return fs
        .readFile(path)
        .then(hostsFile => parse_hosts_file(hostsFile.toString()));
    }
  });
}
export let saveHostsFile = (hosts: Hosts, path = pre_hosts_path) => {
  console.log('Saving hosts-file to ' + path);
  let h = formatHosts(hosts);
  return fs.writeFile(path, h);
};
