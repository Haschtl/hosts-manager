import fs from 'fs';
import {DOMParser} from 'xmldom';

let hosts_path = 'C://windows/system32/drivers/etc/hosts';
let backup_path = './hosts.bak';
let annotation_start = '###';

export function backup_hosts_file() {
  fs.copyFileSync(hosts_path, backup_path);
}
export function backup_exists() {
  return fs.existsSync(backup_path);
}

export function load_hosts_file() {
  let hostsFile = fs.readFileSync(hosts_path);
  return parse_hosts_file(hostsFile.toString());
}

export type Hosts = {
  categories: HostsCategory[];
};
export type HostsCategory = {
  label: string;
  location: string | null;
  format: 'block' | 'allow';
  type: 'url' | 'file';
  content: string[];
  enabled?: boolean;
  applyRedirects: boolean;
};

export function hosts_to_string(hosts: Hosts) {
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
    text += l + '\n';
  });
  text += `${annotation_start} </group>`;
  return text;
}

export function parse_hosts_file(file: string) {
  let hosts: Hosts = {categories: []};
  let unknown_category: HostsCategory = {
    label: 'Unknown',
    content: [],
    location: null,
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
      let is_category_end = false;
      if (line.includes('</group>')) {
        is_category_end = true;
        line = line.replace('</', '<');
      }
      let tree = parser.parseFromString(
        line.replace(annotation_start, ''),
        'text/xml',
      );
      try {
        if (tree.children[0].nodeName === 'group') {
          let category_name = tree.children[0].getAttribute('label');
          let location = tree.children[0].getAttribute('location');
          if (category_name !== null) {
            is_annotation = true;
            if (!is_category_end && current_category === undefined) {
              current_category = {
                label: category_name,
                content: [],
                location: location,
                enabled: true,
                format: 'block',
                applyRedirects: true,
                type: 'file',
              };
            } else if (current_category !== undefined) {
              hosts.categories.push(current_category);
              current_category = undefined;
            }
          }
        }
      } catch {
        console.log('Error parsing line ' + (idx + 1));
      }
    }
    if (!is_annotation) {
      if (current_category !== undefined) {
        current_category.content.push(line);
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
        unknown_category.content.push(line);
      }
    }
  });

  if (unknown_category.content.length > 0) {
    hosts.categories.push(unknown_category);
  }
  return hosts;
}

export function remove_duplicates(hosts: Hosts) {
  let entries: string[] = [];
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
