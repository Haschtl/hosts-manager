import { Hosts, HostsLine } from '../../shared/types';

export function removeDuplicates(hosts: Hosts) {
  const entries: HostsLine[] = [];
  hosts.categories.forEach((c) => {
    c.content.forEach((l) => {
      if (entries.includes(l)) {
        console.log(`Found duplicate: ${l}`);
      } else {
        entries.push(l);
      }
    });
  });
  return hosts;
}

export const sortHosts = (hosts: Hosts) => {
  const blocked: HostsLine[] = [];
  const allowed: HostsLine[] = [];
  const redirected: HostsLine[] = [];
  hosts.categories.forEach((v) => {
    if (v.enabled) {
      v.content.forEach((l) => {
        if (l.enabled) {
          if (l.host !== undefined) {
            if (['127.0.0.1', '0.0.0.0'].includes(l.host)) {
              if (v.format === 'allow') {
                allowed.push(l);
              } else {
                blocked.push(l);
              }
            } else {
              redirected.push(l);
            }
          }
        }
      });
    }
  });
  return { blocked, allowed, redirected };
};
