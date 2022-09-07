import process from "process";
// import {execa} from 'execa';
import { exec } from "child_process";

export function isElevated2(){
  exec("NET SESSION", function (err, so, se) {
    console.log(se.length === 0 ? "admin" : "not admin");
  });
}
export async function isElevated() {
  return process.platform === "win32" ? isAdmin() : isRoot();
}
export default isElevated;

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
