import dns from 'node:dns';

export function lookup(hostname: string) {
  return new Promise<{
    error: NodeJS.ErrnoException | null;
    address: string;
    family: number;
  }>((_resolve, reject) => {
    dns.lookup(hostname, (error, address, family) => {
      _resolve({ error, address, family });
    });
  });
  // return look(hostname, { all: true });
}

export function resolve(hostname: string) {
  return new Promise<string[]>((_resolve, reject) => {
    dns.resolve(hostname, (err, addresses) => {
      _resolve(addresses);
    });
  });
  // return solve(hostname);
}
