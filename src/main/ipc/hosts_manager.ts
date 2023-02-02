/* eslint no-console: off */

import {
  HostsFile,
  HostsLine,
  Source,
  SourceConfig,
  Sources,
} from '../../shared/types';

function splitMax(text: string, splitter: string, max: number) {
  let parts = text.split(splitter).filter((v) => v !== '');
  if (parts.length > max) {
    parts = [...parts.slice(0, max - 1), parts.slice(max, -1).join(splitter)];
  }
  return parts;
}
export function parseLine(line: string, enabled = true): HostsLine {
  if (line.trim().startsWith('#')) {
    if (enabled === true) {
      return parseLine(line.replace('#', ''), false);
    }
    return { comment: line, enabled };
  }
  const split = splitMax(line.trim().replace('\t', ' '), ' ', 3);
  if (split.length >= 2) {
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
  whitelist: string[]
): string | undefined {
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

export function hostsFileToString(source: HostsFile, whitelist: string[]) {
  let text = '';
  source.lines.forEach((l) => {
    const l2 = formatLine(l, whitelist);
    if (l2 !== undefined) {
      text += `${l2}\n`;
    }
  });
  // text += `${annotation_start} </group>`;
  return text;
}

export function formatHosts(sources: Sources, ignoreWhitelist = false) {
  let text = '';
  const whitelist: string[] = [];
  if (ignoreWhitelist === false) {
    sources.forEach((c) => {
      if (c.format === 'allow' && c.enabled) {
        c.lines.forEach((l) => {
          if (l.enabled && l.domain) {
            whitelist.push(l.domain);
          }
        });
      }
    });
  }
  sources.forEach((c) => {
    if (c.enabled || ignoreWhitelist) {
      text += `${hostsFileToString(c, whitelist)}\n`;
    }
  });
  return text;
}

export function parseHostsFile(file: string) {
  const lines: HostsLine[] = [];
  file.split('\n').forEach((line) => {
    if (line.trim() !== '') {
      const hostsLine = parseLine(line);
      lines.push(hostsLine);
    }
  });
  return lines;
}
