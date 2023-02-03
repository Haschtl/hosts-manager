import { HostsLine, Sources } from '../../shared/types';

export const sortHosts = (sources: Sources, includeIPv6: boolean) => {
  const blocked: HostsLine[] = [];
  const allowed: HostsLine[] = [];
  const redirected: HostsLine[] = [];
  sources.forEach((v) => {
    if (v.enabled) {
      v.lines.forEach((l) => {
        if (l.enabled) {
          if (l.host !== undefined) {
            if (
              !l.host?.includes(':') ||
              (l.host?.includes(':') && includeIPv6)
            ) {
              if (['127.0.0.1', '0.0.0.0'].includes(l.host)) {
                if (v.format === 'allow') {
                  allowed.push(l);
                } else {
                  blocked.push(l);
                }
              } else if (v.type === 'file' || v.applyRedirects) {
                redirected.push(l);
              }
            }
          }
        }
      });
    }
  });
  return { blocked, allowed, redirected };
};

export default sortHosts;
