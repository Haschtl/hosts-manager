/* eslint no-console: off */

import process from 'process';
import util from 'util';
// import {execa} from 'execa';
import { exec } from 'child_process';

const execPromise = util.promisify(exec);

export function isRoot() {
  return process.getuid ? process.getuid() === 0 : false;
}

// https://stackoverflow.com/a/28268802
async function testFltmc() {
  try {
    // await execa('fltmc');
    exec('fltmc');
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
    const drive = process.env.systemdrive ? process.env.systemdrive : 'C';
    // await execa("fsutil", ["dirty", "query", drive]);
    exec(`fsutil dirty query ${drive}`);
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return testFltmc();
    }

    return false;
  }
}

export async function isElevated2() {
  const { stdout, stderr } = await execPromise('NET SESSION');
  if (stderr.length === 0) {
    return true;
  }
  return false;
}
export async function isElevated() {
  return process.platform === 'win32' ? isAdmin() : isRoot();
}
export default isElevated2;
