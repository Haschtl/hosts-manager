import process from 'node:process';
import execa from 'execa';

export default async function isElevated() {
  return process.platform === 'win32' ? isAdmin() : isRoot();
}

export function isRoot() {
  return process.getuid && process.getuid() === 0;
}

// https://stackoverflow.com/a/28268802
async function testFltmc() {
  try {
    await execa('fltmc');
    return true;
  } catch {
    return false;
  }
}

export async function isAdmin() {
  if (process.platform !== 'win32') {
    return false;
  }

  try {
    // https://stackoverflow.com/a/21295806/1641422
    let drive = process.env.systemdrive ? process.env.systemdrive : 'C';
    await execa('fsutil', ['dirty', 'query', drive]);
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return testFltmc();
    }

    return false;
  }
}
