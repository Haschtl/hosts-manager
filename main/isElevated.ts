import process from "process";
import util from "util";
// import {execa} from 'execa';
import { exec } from "child_process";
const exec_p = util.promisify(exec);

export async function isElevated2(){
  let {stdout,stderr} = await exec_p("NET SESSION");
  if (stderr.length===0){
    return true
  }else{
    return false
  }
}
export async function isElevated() {
  return process.platform === "win32" ? isAdmin() : isRoot();
}
export default isElevated2;

export function isRoot() {
  return process.getuid ? process.getuid() === 0 : false;
}

// https://stackoverflow.com/a/28268802
async function testFltmc() {
  try {
    // await execa('fltmc');
    await exec("fltmc");
    return true;
  } catch {
    return false;
  }
}

export async function isAdmin() {
  if (process.platform !== "win32") {
    return false;
  }

  try {
    // https://stackoverflow.com/a/21295806/1641422
    let drive = process.env.systemdrive ? process.env.systemdrive : "C";
    // await execa("fsutil", ["dirty", "query", drive]);
    await exec(`fsutil dirty query ${drive}`);
    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return testFltmc();
    }

    return false;
  }
}
