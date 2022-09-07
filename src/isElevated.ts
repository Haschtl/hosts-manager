// import process from "process";
// // import {execa} from 'execa';
// import { spawn } from "child_process";
const process = window.require("process");
const { spawn } = window.require("child_process");

export default async function isElevated() {
  return process.platform === "win32" ? isAdmin() : isRoot();
}

export function isRoot() {
  return process.getuid ? process.getuid() === 0 : false;
}

// https://stackoverflow.com/a/28268802
async function testFltmc() {
  try {
    // await execa('fltmc');
    await spawn("fltmc");
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
    await spawn(`fsutil dirty query ${drive}`);
    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return testFltmc();
    }

    return false;
  }
}
