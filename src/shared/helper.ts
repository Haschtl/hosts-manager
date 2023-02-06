import {
  HostsFile,
  SourceConfig,
  SourceConfigFile,
  SourceFiles,
  Sources,
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
