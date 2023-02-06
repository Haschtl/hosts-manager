import { HostsLinePlus, Sources } from '../../shared/types';
import { path2profilename } from '../../shared/helper';

export const sortHosts = (sources: Sources, includeIPv6: boolean) => {
  const blocked: HostsLinePlus[] = [];
  const allowed: HostsLinePlus[] = [];
  const redirected: HostsLinePlus[] = [];
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
                  allowed.push({ ...l, source: path2profilename(v.path) });
                } else {
                  blocked.push({ ...l, source: path2profilename(v.path) });
                }
              } else if (v.type === 'file' || v.applyRedirects) {
                redirected.push({ ...l, source: path2profilename(v.path) });
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
