import { exec, ExecException } from 'child_process';
import fs from 'fs';
import { extendPath } from './userFolder';

type ExecReturn = {
  error: ExecException | null;
  stdout: string;
  stderr: string;
};
export const execNormal = async (command: string) => {
  return new Promise<{
    error: ExecException | null;
    stdout: string;
    stderr: string;
  }>((resolve) => {
    console.log(`PS: ${command}`);
    exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
};

export function openFolder(path: string) {
  return new Promise<ExecReturn>((resolve) =>
    exec(`start "${path}"`, (error, stdout, stderr) =>
      resolve({ error, stdout, stderr })
    )
  );
}

/** Options to use when running an executable as admin */
interface RunAsAdminCommand {
  /** Path to the executable to run */
  path: string;
  /** Working dir to run the executable from */
  workingDir?: string;
}

const runAsAdminWithOutput = async (command: string) => {
  const cmd = `$pinfo = New-Object System.Diagnostics.ProcessStartInfo
$pinfo.RedirectStandardError = $true
$pinfo.RedirectStandardOutput = $true
$pinfo.UseShellExecute = $false
$pinfo.Arguments = "${command.replaceAll('"', '`"')}"
$p = New-Object System.Diagnostics.Process
$p.StartInfo = $pinfo
$p.Start() | Out-Null
$p.WaitForExit()
$stdout = $p.StandardOutput.ReadToEnd()
$stderr = $p.StandardError.ReadToEnd()
Write-Host "stdout: $stdout"
Write-Host "stderr: $stderr"
Write-Host "exit code: " + $p.ExitCode
`;
  return execNormal(cmd);
};
const runAsAdminBase = async (
  command: string | RunAsAdminCommand,
  RedirectStandardOutput?: string,
  RedirectStandardError?: string
) => {
  const usePowerShell = typeof command === 'string';
  // if (usePowerShell) {
  //   return runAsAdminWithOutput(command);
  // }
  let args;
  if (usePowerShell) {
    args = `-ArgumentList "${command.replaceAll('"', '`"')}"`;
  } else {
    args = `-FilePath '${command.path}'`;
    if (command.workingDir) {
      args += ` -WorkingDirectory '${command.workingDir}'`;
    }
  }
  if (RedirectStandardOutput) {
    args += ` -RedirectStandardOutput "${RedirectStandardOutput}"`;
  }
  if (RedirectStandardError) {
    args += ` -RedirectStandardError "${RedirectStandardError}"`;
  }
  const cmd = `Start-Process ${
    usePowerShell ? 'PowerShell' : ''
  } -Verb RunAs -WindowStyle Hidden -PassThru ${
    usePowerShell ? '-Wait' : ''
  } ${args}`;
  console.log(`PS (elevated): ${cmd}`);
  return execNormal(cmd);
};

// export const runScriptAsAdmin = async (script: string) => {
//   const absPath = extendPath('./temp.ps1');
//   fs.writeFileSync(absPath, script);
//   return runAsAdminBase({ path: absPath, workingDir: userFolder });
// };
/**
 * Runs a PowerShell command or an executable as admin
 *
 * @param command If a string is provided, it will be used as a command to
 *   execute in an elevated PowerShell. If an object with `path` is provided,
 *   the executable will be started in Run As Admin mode
 *
 * If providing a string for elevated PowerShell, ensure the command is parsed
 *   by PowerShell correctly by using an interpolated string and wrap the
 *   command in double quotes.
 *
 * Example:
 *
 * ```
 * `"Do-The-Thing -Param '${pathToFile}'"`
 * ```
 */
export const execAdmin = async (
  command: string | RunAsAdminCommand
  // useScript = false
) => {
  // if (useScript && typeof command === 'string') {
  //   return runScriptAsAdmin(command);
  // }
  // const RedirectStandardOutput = extendPath('./out.txt');
  // const RedirectStandardError = extendPath('./error.txt');
  return runAsAdminBase(command);
  // .then(({ error }) => {
  //   // const stdout = fs.readFileSync(RedirectStandardOutput);
  //   // const stderr = fs.readFileSync(RedirectStandardError);
  //   return { error, stdout, stderr };
  // });
};

export default execAdmin;

// execAdmin('Get-NetFirewallRule -all')
//   .then(({ error, stdout, stderr }) => {
//     console.log(stdout);
//   })
//   .catch(console.log);
