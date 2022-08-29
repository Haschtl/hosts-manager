import {DOMParser} from 'xmldom';

let annotation_start = '##AdAway# ';

export type Hosts = {
  categories: HostsCategory[];
};
export type HostsCategory = {
  enabled?: boolean;
  label: string;
  format: 'block' | 'allow';
  type: 'url' | 'file';
  location?: string;
  content: HostsLine[];
  applyRedirects: boolean;
};
export type HostsLine = {
  domain?: string;
  host?: string;
  comment?: string;
  enabled: boolean;
};

export function formatHosts(hosts: Hosts) {
  let text = '';
  hosts.categories.forEach(c => {
    text += hosts_category_to_string(c) + '\n';
  });
  return text;
}

export function hosts_category_to_string(category: HostsCategory) {
  let text = '';
  if (category.location !== null) {
    text += `${annotation_start} <group label="${category.label}" location="${category.location}">\n`;
  } else {
    text += `${annotation_start} <group label="${category.label}">\n`;
  }
  category.content.forEach(l => {
    let l2 = formatLine(l);
    if (l2 !== undefined) {
      text += l2 + '\n';
    }
  });
  text += `${annotation_start} </group>`;
  return text;
}

export function parseLine(line: string, enabled = true): HostsLine {
  if (line.trim().startsWith('#')) {
    if (enabled === true) {
      return parseLine(line.replace('#', ''), false);
    } else {
      return {comment: line, enabled};
    }
  } else {
    let split = line.split(' ');
    if (split.length >= 2 && split.length <= 3 && split[0].includes('.')) {
      let host = split[0];
      let domain = split[1];
      let comment: string | undefined;
      if (split.length === 3 && split[2].startsWith('#')) {
        comment = split.slice(2).join(' ').replace('#', '');
      }
      return {host, domain, comment, enabled};
    } else {
      return {comment: line.trim().replace('#', ''), enabled};
    }
  }
}

export function formatLine(line: HostsLine): string | undefined {
  if (line.domain === undefined && line.host === undefined) {
    if (line.comment) {
      return '# ' + line.comment;
    } else {
      return undefined;
    }
  } else {
    let text = line.host + ' ' + line.comment;
    if (line.comment) {
      text += ' # ' + line.comment;
    }
    if (line.enabled === false) {
      text = '# ' + text;
    }
    return text;
  }
}

export function parse_hosts_file(file: string) {
  let hosts: Hosts = {categories: []};
  let unknown_category: HostsCategory = {
    label: 'Unknown',
    content: [],
    location: undefined,
    enabled: true,
    type: 'file',
    applyRedirects: true,
    format: 'block',
  };
  let current_category: HostsCategory | undefined;
  let parser = new DOMParser();
  file.split('\n').forEach((line, idx) => {
    let is_annotation = false;
    if (line.startsWith(annotation_start)) {
      // Annotation for AdAway
      if (line.includes('</group>')) {
        if (current_category !== undefined) {
          hosts.categories.push(current_category);
          current_category = undefined;
          is_annotation = true;
        }
      } else {
        let tree = parser.parseFromString(
          line.replace(annotation_start, '').trim() + '</group>',
          'text/xml',
        );
        try {
          if (tree.childNodes[0].nodeName === 'group') {
            let attributes: {[id: number]: {name: string; value: string}} =
              //@ts-ignore
              tree.childNodes[0].attributes;
            let label: string | undefined = undefined;
            let location: string | undefined;
            let enabled = true;
            let format: 'block' | 'allow' = 'block';
            let type: 'file' | 'url' = 'file';
            let applyRedirects = true;
            Object.values(attributes).forEach(a => {
              switch (a.name) {
                case 'label':
                  label = a.value;
                  break;
                case 'location':
                  location = a.value;
                  break;
                case 'enabled':
                  enabled = Boolean(a.value);
                  break;
                case 'format':
                  format = a.value as 'block';
                  break;
                case 'type':
                  type = a.value as 'file';
                  break;
                case 'applyRedirects':
                  applyRedirects = Boolean(a.value);
                  break;
              }
            });
            if (label !== undefined) {
              is_annotation = true;
              if (current_category === undefined) {
                current_category = {
                  label,
                  content: [],
                  location,
                  enabled,
                  format,
                  applyRedirects,
                  type,
                };
              }
            }
          }
        } catch (e) {
          console.log('Error parsing line ' + (idx + 1), e);
        }
      }
    }
    if (!is_annotation) {
      let hostsLine = parseLine(line);
      if (current_category !== undefined) {
        current_category.content.push(hostsLine);
        if (current_category.enabled !== undefined) {
          if (line.startsWith('#')) {
            if (idx !== 0 && current_category.enabled === true) {
              current_category.enabled = undefined;
            } else {
              current_category.enabled = false;
            }
          } else if (current_category.enabled === false) {
            current_category.enabled = undefined;
          }
        }
      } else {
        unknown_category.content.push(hostsLine);
      }
    }
  });

  if (unknown_category.content.length > 0) {
    hosts.categories.push(unknown_category);
  }
  return hosts;
}

export function remove_duplicates(hosts: Hosts) {
  let entries: HostsLine[] = [];
  hosts.categories.forEach(c => {
    c.content.forEach(l => {
      if (entries.includes(l)) {
        console.log('Found duplicate: ' + l);
      } else {
        entries.push(l);
      }
    });
  });
  return hosts;
}
