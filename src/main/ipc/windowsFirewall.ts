/* eslint no-console: off */
import {
  FirewallProfile,
  FirewallRule,
  FirewallRuleO,
  FirewallSetting,
} from 'shared/types';
import { execAdmin, execNormal } from '../util/os';

export function openWindowsFirewall() {
  return execNormal('wf.msc');
}

function parseLine(line: string) {
  const lineParts = line.split(': ', 2);
  if (lineParts.length === 2) {
    const key = lineParts[0].trim();
    let value: string | boolean | number = lineParts[1].trim();
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      if (value.toLowerCase() === 'false') {
        value = false;
      } else {
        value = true;
      }
    } else if (!Number.isNaN(Number(value))) {
      value = Number(value);
    }
    return { key, value };
  }
  return undefined;
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
    const result = parseLine(line);
    if (result) {
      rule[result.key as keyof O] = result.value as any;
    }
  });
  return rules;
}

export function parseShowNetFirewallRules<O = FirewallRule>(stdout: string) {
  let rule: Partial<O> = {};
  const rules: O[] = [];
  stdout.split('\n').forEach((line) => {
    if (line.startsWith('--------------')) {
      if (Object.keys(rule).length > 0) {
        rules.push(rule as O);
      }
      rule = {};
    }
    const result = parseLine(line);
    if (result) {
      rule[result.key as keyof O] = result.value as any;
    }
  });
  return rules;
}

export function getFirewallProfiles(args = '') {
  const cmd = `Get-NetFirewallProfile ${args}`;
  return execNormal(cmd).then(({ error, stdout, stderr }) => {
    // console.log(error, stderr);
    return parseGroups<FirewallProfile>(stdout);
  });
}
export function toggleFirewallProfile(name: string, enabled: boolean) {
  const cmd = `Set-NetFirewallProfile -Name '${name}' -Enabled ${enabled}`;
  return execAdmin(cmd).then(({ error, stdout, stderr }) => {
    // console.log(error, stderr);
    return getFirewallProfiles();
  });
}
export function getFirewallSettings(args = '-PolicyStore ActiveStore') {
  const cmd = `Get-NetFirewallSetting ${args}`;
  return execNormal(cmd).then(({ error, stdout, stderr }) => {
    // console.log(error, stderr);
    return parseGroups<FirewallSetting>(stdout)[0];
  });
}
export function getFirewallRules(args = '') {
  const cmd = `Get-NetFirewallRule -all ${args}`;
  return execNormal(cmd).then(({ error, stdout, stderr }) => {
    // console.log(error, stderr);
    return parseGroups(stdout);
  });
}

export function showFirewallRules(args = '') {
  const cmd = `Show-NetFirewallRule ${args}`;
  // Object.keys(rule).forEach((key) => {
  //   cmd += `-${key} ${String(rule[key as 'Name'])}`;
  // });
  return execNormal(cmd).then(({ error, stdout, stderr }) => {
    // console.log(error, stderr);
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

  return execNormal(cmd).then(({ error, stdout, stderr }) => {
    // console.log(error, stderr);
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
  let cmd = `Set-NetFirewallRule -DisplayName '${DisplayName}'`;
  Object.keys(rest).forEach((key) => {
    cmd += ` -${key} '${String(rest[key as 'Name'])}'`;
  });
  return execAdmin(cmd).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    // console.log(`Powershell error: ${error}`);

    if (error === null) {
      return showSmartFirewallRule(rule.DisplayName!);
    }
    console.log(`Powershell Error: ${error}`);
    return undefined;
  });
}

export function newFirewallRule(newRule: FirewallRuleO) {
  let cmd = 'New-NetFirewallRule ';
  Object.keys(newRule).forEach((key) => {
    cmd += ` -${key} '${String(newRule[key as 'Name'])}'`;
  });
  return execAdmin(cmd).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    // console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);

    if (error === null) {
      return showSmartFirewallRule(newRule.DisplayName!);
    }
    console.log(`Powershell Error: ${error}`);
    return undefined;
  });
}

export function copyFirewallRule(displayName: string, newName: string) {
  const cmd = `Copy-NetFirewallRule -DisplayName '${displayName}' -NewName '${newName}'`;
  return execAdmin(cmd).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    // console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);

    if (error === null) {
      return showSmartFirewallRule(newName);
    }
    return undefined;
  });
}
export function disableFirewallRule(displayName: string) {
  const cmd = `Disable-NetFirewallRule -DisplayName '${displayName}'`;
  return execAdmin(cmd).then(({ error, stdout, stderr }) => {
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
  const cmd = `Enable-NetFirewallRule -DisplayName '${displayName}'`;
  return execAdmin(cmd).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    // console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);
    if (error === null) {
      return showSmartFirewallRule(displayName);
    }
    console.log(error);
    return undefined;
  });
}
export function removeFirewallRule(displayName: string) {
  const cmd = `Remove-NetFirewallRule -DisplayName '${displayName}'`;
  return execAdmin(cmd).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    // console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);
    if (error === null) {
      return true;
    }
    console.log(error);
    return false;
  });
}
export function renameFirewallRule(name: string, newName: string) {
  const cmd = `Rename-NetFirewallRule -Name '${name}' -NewName '${newName}'`;
  return execAdmin(cmd).then(({ error, stdout, stderr }) => {
    // console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    // console.log(`Powershell error: ${error}`);
    if (error === null) {
      return showSmartFirewallRule(newName);
    }
    console.log(error);
    return undefined;
  });
}
