/* eslint no-console: off */

import { HostsLine, Sources } from '../../shared/types';
import { defaultLines, isLineFiltered } from '../../shared/helper';

function isIP(text: string) {
  if (text.split('.').length === 4 || text.split(':').length >= 3) {
    return true;
  }
  return false;
}
function isDomain(text: string) {
  if (text.split('.').length >= 1 && !text.trim().includes(' ')) {
    return true;
  }
  return false;
}

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
    if (isIP(host)) {
      const domain = split[1];
      let comment: string | undefined;
      if (split.length === 3 && split[2].startsWith('#')) {
        comment = split.slice(2).join(' ').replace('#', '');
      }
      return { host, domain, comment, enabled };
    }
    return { comment: line, enabled: false };
  }
  if (split.length === 1 && isDomain(split[0])) {
    return { domain: split[0], enabled };
  }
  return { comment: line.trim().replace('#', ''), enabled };
}

export function formatLine(
  line: HostsLine,
  whitelist: string[],
  hostOverwrite?: string,
  removeComments = false
): string | undefined {
  if (line.domain === undefined && line.host === undefined) {
    if (!removeComments && line.comment) {
      return `# ${line.comment}`;
    }
    return undefined;
  }
  if (line.domain === undefined || whitelist.indexOf(line.domain) >= 0) {
    return undefined;
  }
  let host;
  if (
    hostOverwrite === undefined ||
    !['0.0.0.0', '127.0.0.1', 'localhost'].includes(line.host!)
  ) {
    host = line.host;
  } else {
    host = hostOverwrite;
  }
  if (host === undefined) {
    host = '0.0.0.0';
  }
  let text = `${host} ${line.domain}`;

  if (!removeComments && line.comment) {
    text += ` # ${line.comment}`;
  }
  if (!removeComments && line.enabled === false) {
    text = `# ${text}`;
  }
  return text;
}

export function hostsFileToString(
  lines: HostsLine[],
  whitelist: string[],
  hostOverwrite?: string,
  removeComments = false
) {
  let text = '';
  lines.forEach((l) => {
    const l2 = formatLine(l, whitelist, hostOverwrite, removeComments);
    if (l2 !== undefined) {
      text += `${l2}\n`;
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

export function mergeSources(sources: Sources, includeIPv6: boolean) {
  const entries: HostsLine[] = defaultLines;
  const domains: string[] = [];
  const blockSources = sources.filter((s) => s.enabled && s.format === 'block');
  const allowSources = sources.filter((s) => s.enabled && s.format === 'allow');
  const whiteList = allowSources
    .map((s) => s.lines)
    .flat()
    .filter((l) => l.domain !== undefined)
    .map((l) => l.domain as string);
  blockSources.forEach((c) => {
    if (c.enabled) {
      c.lines.forEach((l) => {
        const isFiltered = isLineFiltered(
          l,
          domains,
          whiteList,
          includeIPv6,
          c
        );
        if (isFiltered) {
          domains.push(l.domain!);
          entries.push(l);
        }
      });
    }
  });
  return entries;
}
