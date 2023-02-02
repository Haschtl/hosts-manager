import { HostsLine, Sources } from '../../shared/types';

export function removeDuplicates(sources: Sources) {
  const entries: HostsLine[] = [];
  sources.forEach((c) => {
    c.lines.forEach((l) => {
      if (entries.includes(l)) {
        console.log(`Found duplicate: ${l}`);
      } else {
        entries.push(l);
      }
    });
  });
  return sources;
}

export const sortHosts = (sources: Sources) => {
  const blocked: HostsLine[] = [];
  const allowed: HostsLine[] = [];
  const redirected: HostsLine[] = [];
  sources.forEach((v) => {
    if (v.enabled) {
      v.lines.forEach((l) => {
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
