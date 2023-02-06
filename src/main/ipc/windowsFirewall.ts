/* eslint no-console: off */
import { exec, ExecException } from 'child_process';
import { FirewallProfile, FirewallRule, FirewallRuleO } from 'shared/types';
import { runAsAdmin } from './files';

const execP = async (command: string) => {
  return new Promise<{
    error: ExecException | null;
    stdout: string;
    stderr: string;
  }>((resolve) => {
    exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
};

export function openWindowsFirewall() {
  exec('wf.msc', { shell: 'powershell.exe' });
}

function parseGroups<O = FirewallRule>(stdout: string): O[] {
  let rule: Partial<O> = {};
  const rules: O[] = [];
  stdout.split('\n').forEach((line) => {
    if (line.trim() === '') {
      if (Object.keys(rule).length > 0) {
        rules.push(rule as O);
      }
      rule = {};
    }
    const lineParts = line.split(': ', 2);
    if (lineParts.length === 2) {
      const key = lineParts[0].trim();
      const value = lineParts[1].trim();
      rule[key as keyof O] = value as any;
    }
  });
  return rules;
}

export function parseShowNetFirewallRules(stdout: string) {
  let rule: Partial<FirewallRule> = {};
  const rules: FirewallRule[] = [];
  stdout.split('\n').forEach((line) => {
    if (line.startsWith('--------------')) {
      if (Object.keys(rule).length > 0) {
        rules.push(rule as FirewallRule);
      }
      rule = {};
    }
    if (line.includes(':')) {
      const lineParts = line.split(': ', 2);
      if (lineParts.length === 2) {
        const key = lineParts[0].trim();
        const value = lineParts[1].trim();
        rule[key as 'Name'] = value;
      }
    }
  });
  return rules;
}

export function getFirewallProfiles(args = '') {
  const cmd = `Get-NetFirewallProfile ${args}`;
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(error, stderr);
    return parseGroups<FirewallProfile>(stdout);
  });
}
export function getFirewallRules(args = '') {
  const cmd = `get-netfirewallrule -all ${args}`;
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(error, stderr);
    return parseGroups(stdout);
  });
}

export function showFirewallRules(args = '') {
  const cmd = `show-netfirewallrule ${args}`;
  // Object.keys(rule).forEach((key) => {
  //   cmd += `-${key} ${String(rule[key as 'Name'])}`;
  // });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(error, stderr);
    return parseShowNetFirewallRules(stdout);
  });
}

type NetFirewallFilter =
  | 'Get-NetFirewallAddressFilter'
  | 'Get-NetFirewallPortFilter'
  | 'Get-NetFirewallApplicationFilter'
  | 'Get-NetFirewallInterfaceFilter'
  | 'Get-NetFirewallInterfaceTypeFilter'
  | 'Get-NetFirewallSecurityFilter'
  | 'Get-NetFirewallServiceFilter';

function getFirewallFilter(filter: NetFirewallFilter, args?: string) {
  let cmd: string = filter;
  if (args !== undefined && args !== '') {
    cmd = `Get-NetFirewallRule ${args} | ${filter}`;
  }

  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(error, stderr);
    return parseGroups(stdout);
  });
}

// function formatFilter(name: string, filter: NetFirewallFilter) {
//   return `@{Name='${name}';Expression={($PSItem | ${filter} -ThrottleLimit 1000).${name}}}`;
// }

// const keySelector = `Select-Object Name,DisplayName,Enabled,Direction,Action,${formatFilter(
//   'Protocol',
//   'Get-NetFirewallPortFilter'
// )},${formatFilter('LocalPort', 'Get-NetFirewallPortFilter')},${formatFilter(
//   'LocalAddress',
//   'Get-NetFirewallAddressFilter'
// )},${formatFilter(
//   'RemoteAddress',
//   'Get-NetFirewallAddressFilter'
// )},${formatFilter('Program', 'Get-NetFirewallApplicationFilter')}`;
export async function showSmartFirewallRules(args?: string) {
  const promises = [
    getFirewallRules(args),
    getFirewallFilter('Get-NetFirewallAddressFilter', args),
    getFirewallFilter('Get-NetFirewallPortFilter', args),
    getFirewallFilter('Get-NetFirewallApplicationFilter', args),
    getFirewallFilter('Get-NetFirewallInterfaceFilter', args),
    getFirewallFilter('Get-NetFirewallInterfaceTypeFilter', args),
    getFirewallFilter('Get-NetFirewallSecurityFilter', args),
    getFirewallFilter('Get-NetFirewallServiceFilter', args),
  ];
  return Promise.all(promises).then((parts) => {
    return parts[0].map((fr, idx) => {
      let r = fr;
      parts.forEach((f, idx2) => {
        if (idx2 !== 0) {
          r = { ...r, ...parts[idx2][idx] };
        }
      });
      return r;
    });
  });
  // const rules = await getFirewallRules();
  // return rules.map((r, idx) => {
  //   return {
  //     ...r,
  //     ...addresses[idx],
  //     ...ports[idx],
  //     ...applications[idx],
  //   } as FirewallRule;
  // });
  // const promises = [
  // showFirewallRules('-ThrottleLimit 1000'),
  // getFirewallRules(
  //   `-ThrottleLimit 1000 -PolicyStore ConfigurableServiceStore | ${keySelector}`
  // ),
  // getFirewallRules(
  //   `-ThrottleLimit 1000 -PolicyStore ActiveStore | ${keySelector}`
  // ),
  // getFirewallRules(
  //   `-ThrottleLimit 1000 -PolicyStore PersistentStore | ${keySelector}`
  // ),
  // getFirewallRules(`-ThrottleLimit 1000 -PolicyStore RSOP | ${keySelector}`),
  // showFirewallRules('-PolicyStore ConfigurableServiceStore'),
  // showFirewallRules('-PolicyStore ActiveStore'),
  // showFirewallRules('-PolicyStore PersistentStore'),
  // showFirewallRules('-PolicyStore RSOP'),
  // getFirewallRules('-PolicyStore SystemDefaults'),
  // getFirewallRules('-PolicyStore StaticServiceStore'),
  // ];

  // return Promise.all(promises).then((r) => {
  //   return r.flat();
  // });
}
export async function showSmartFirewallRule(displayName: string) {
  return showSmartFirewallRules(`-DisplayName '${displayName}'`).then(
    (r) => r[0]
  );
}

export function setFirewallRule(rule: FirewallRuleO) {
  const { DisplayName, ...rest } = rule;
  let cmd = `set-netfirewallrule -DisplayName '${DisplayName}'`;
  Object.keys(rest).forEach((key) => {
    cmd += ` -${key} '${String(rest[key as 'Name'])}'`;
  });
  console.log(cmd);
  return runAsAdmin(cmd, false).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);

    if (error === null) {
      return showSmartFirewallRule(rule.DisplayName!);
    }
    return undefined;
  });
}

export function newFirewallRule(newRule: FirewallRuleO) {
  let cmd = 'new-netfirewallrule ';
  Object.keys(newRule).forEach((key) => {
    cmd += ` -${key} '${String(newRule[key as 'Name'])}'`;
  });
  console.log(cmd);

  return runAsAdmin(cmd, false).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);

    if (error === null) {
      return showSmartFirewallRule(newRule.DisplayName!);
    }
    return undefined;
  });
}

export function copyFirewallRule(displayName: string, newName: string) {
  const cmd = `copy-netfirewallrule -DisplayName '${displayName}' -NewName '${newName}'`;
  return runAsAdmin(cmd, false).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);

    if (error === null) {
      return showSmartFirewallRule(newName);
    }
    return undefined;
  });
}
export function disableFirewallRule(displayName: string) {
  const cmd = `disable-netfirewallrule -DisplayName '${displayName}'`;
  return runAsAdmin(cmd, false).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);

    if (error === null) {
      return showSmartFirewallRule(displayName);
    }
    return undefined;
  });
}
export function enableFirewallRule(displayName: string) {
  const cmd = `enable-netfirewallrule -DisplayName '${displayName}'`;
  return runAsAdmin(cmd, false).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);
    if (error === null) {
      return showSmartFirewallRule(displayName);
    }
    return undefined;
  });
}
export function removeFirewallRule(displayName: string) {
  const cmd = `remove-netfirewallrule -DisplayName '${displayName}'`;
  return runAsAdmin(cmd, false).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);
    if (error === null) {
      return false;
    }
    return true;
  });
}
export function renameFirewallRule(name: string, newName: string) {
  const cmd = `rename-netfirewallrule -Name '${name}' -NewName '${newName}'`;
  return runAsAdmin(cmd, false).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);
    if (error === null) {
      return showSmartFirewallRule(newName);
    }
    return undefined;
  });
}
