/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  HostsFile,
  SourceConfig,
  SourceConfigFile,
  SourceFiles,
  Sources,
  HostsLine,
} from './types';

export function getUniqueID(configs: SourceConfigFile) {
  let id = 0;
  const ids = configs.sources.map((s) => s.id);
  while (ids.includes(id)) {
    id += 1;
  }
  return id;
}
export function getSourceConfig(file: HostsFile, config: SourceConfigFile) {
  let conf = config.sources?.find((sc) => sc.location === file.path);
  if (conf === undefined) {
    conf = {
      applyRedirects: false,
      comment: undefined,
      enabled: true,
      format: 'block',
      label: file.path,
      lastChange: new Date(Date.now()).toString(),
      location: file.path,
      type: 'file',
      id: getUniqueID(config),
    };
  }
  return conf;
}
export function getSource(conf: SourceConfig, files: SourceFiles) {
  let file = files.files.find((f) => f.path === conf.location);
  if (file === undefined) {
    file = {
      path: `./sources/${conf.label.replaceAll(' ', '_')}.hosts`,
      lines: [],
    };
  }
  return file;
}
export function annotateSources(
  sourceFiles: SourceFiles,
  config: SourceConfigFile
) {
  const sources: Sources = sourceFiles.files.map((f) => {
    return { ...getSourceConfig(f, config), ...f };
  });

  return sources;
}

export default annotateSources;

export function hostsFile2sources(file: HostsFile) {
  return [
    {
      applyRedirects: true,
      enabled: true,
      format: 'block',
      id: -1,
      ...file,
    },
  ] as Sources;
}

export function path2profilename(p: string) {
  return p.replace('./profiles/', '').replace('.hosts', '');
}

export const defaultLines: HostsLine[] = [
  // { host: '::1', domain: 'localhost', enabled: true },
  { host: '127.0.0.1', domain: 'localhost', enabled: true },
  { host: '127.0.0.1', domain: 'localhost.localdomain', enabled: true },
];
const defaultDomains = defaultLines.map((l) => l.domain!);

export function isLineFiltered(
  line: HostsLine,
  existing: string[],
  whiteList: string[],
  includeIPv6: boolean,
  config?: SourceConfig
) {
  if (existing.includes(line.domain!)) {
    // console.log(`Found duplicate: ${l.domain}`);
    return false;
  }
  if (whiteList.includes(line.domain!)) {
    console.log(`Skipping whitelisted entry: ${line.domain}`);
    return false;
  }
  if (
    config?.type === 'url' &&
    !config?.applyRedirects &&
    !['0.0.0.0', '127.0.0.1'].includes(line.host!)
  ) {
    console.log(
      `Skipping entry, because applyRedirects is disabled: ${line.domain}`
    );
    return false;
  }
  if (defaultDomains.includes(line.domain!)) {
    console.log(
      `Skipping domain, because it is included in the defaults: ${line.domain}`
    );
    return false;
  }
  return true;
}
