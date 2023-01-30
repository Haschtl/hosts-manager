/* eslint no-console: off */

import {
  Hosts,
  HostsCategory,
  HostsFile,
  HostsLine,
  SourceConfig,
} from '../../shared/types';

export function parseLine(line: string, enabled = true): HostsLine {
  if (line.trim().startsWith('#')) {
    if (enabled === true) {
      return parseLine(line.replace('#', ''), false);
    }
    return { comment: line, enabled };
  }
  const split = line.split(' ');
  if (split.length >= 2 && split.length <= 3 && split[0].includes('.')) {
    const host = split[0];
    const domain = split[1];
    let comment: string | undefined;
    if (split.length === 3 && split[2].startsWith('#')) {
      comment = split.slice(2).join(' ').replace('#', '');
    }
    return { host, domain, comment, enabled };
  }
  return { comment: line.trim().replace('#', ''), enabled };
}

export function formatLine(
  line: HostsLine,
  whitelist: string[],
  category: SourceConfig
): string | undefined {
  // let appendix = {
  //   // enabled: category.enabled,
  //   label: category.label,
  //   format: category.format,
  //   // type: category.type,
  //   location: category.location,
  //   applyRedirects: category.applyRedirects,
  //   comment: line.comment,
  // };
  if (line.domain === undefined && line.host === undefined) {
    if (line.comment) {
      return `# ${line.comment}`;
    }
    return undefined;
  }
  if (line.domain === undefined || whitelist.indexOf(line.domain) >= 0) {
    return undefined;
  }
  let text = `${line.host} ${line.domain}`;
  if (line.comment) {
    text += ` # ${line.comment}`;
  }
  if (line.enabled === false) {
    text = `# ${text}`;
  }
  return text;
}

export function hostsCategoryToString(
  category: HostsCategory,
  whitelist: string[]
) {
  // let text = `${annotation_start} <group`;
  // if (category.label !== undefined) {
  //   text += ` label="${category.label}"`;
  // }
  // if (category.location !== undefined) {
  //   text += ` location="${category.location}"`;
  // }
  // if (category.enabled !== undefined) {
  //   text += ` enabled="${category.enabled}"`;
  // }
  // if (category.format !== undefined) {
  //   text += ` format="${category.format}"`;
  // }
  // if (category.applyRedirects !== undefined) {
  //   text += ` applyRedirects="${category.applyRedirects}"`;
  // }
  // if (category.type !== undefined) {
  //   text += ` type="${category.type}"`;
  // }
  // text += '>\n';
  let text = '';
  category.content.forEach((l) => {
    const l2 = formatLine(l, whitelist, category);
    if (l2 !== undefined) {
      text += `${l2}\n`;
    }
  });
  // text += `${annotation_start} </group>`;
  return text;
}

export function formatHosts(hosts: Hosts, ignoreWhitelist = false) {
  let text = '';
  const whitelist: string[] = [];
  if (ignoreWhitelist === false) {
    hosts.categories.forEach((c) => {
      if (c.format === 'allow' && c.enabled) {
        c.content.forEach((l) => {
          if (l.enabled && l.domain) {
            whitelist.push(l.domain);
          }
        });
      }
    });
  }
  hosts.categories.forEach((c) => {
    if (c.enabled || ignoreWhitelist) {
      text += `${hostsCategoryToString(c, whitelist)}\n`;
    }
  });
  return text;
}

export function parseHostsFile(file: string) {
  const hosts: HostsFile = { lines: [] };
  file.split('\n').forEach((line) => {
    if (line.trim() !== '') {
      const hostsLine = parseLine(line);
      hosts.lines.push(hostsLine);
    }
  });
  return hosts;
}
