/* eslint no-console: off */
import { exec, ExecException } from 'child_process';
import { FirewallRule, FirewallRuleO } from 'shared/types';

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

export function getFirewallRules() {
  return execP('get-netfirewallrule -all').then(({ stdout }) => {
    let rule: Partial<FirewallRule> = {};
    const rules: FirewallRule[] = [];
    stdout.split('\n').forEach((line) => {
      if (line.trim() === '') {
        if (Object.keys(rule).length > 0) {
          rules.push(rule as FirewallRule);
        }
        rule = {};
      }
      const lineParts = line.split(': ', 2);
      if (lineParts.length === 2) {
        const key = lineParts[0].trim();
        const value = lineParts[1].trim();
        rule[key as 'Name'] = value;
      }
    });
    return rules;
  });
}
export function showFirewallRules(rule: FirewallRuleO) {
  let cmd = 'show-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);

    const rules: FirewallRule[] = [];
    stdout.split('\n\n').forEach((block) => {
      const newRule: Partial<FirewallRule> = {};
      block.split('\n').forEach((line) => {
        const lineParts = line.split(': ', 2);
        if (lineParts.length === 2) {
          const key = lineParts[0].trim();
          const value = lineParts[1].trim();
          newRule[key as 'Name'] = value;
        }
      });
      rules.push(newRule as FirewallRule);
    });
    return rules;
  });
}

export function setFirewallRule(newRule: FirewallRuleO) {
  let cmd = 'set-netfirewallrule ';
  Object.keys(newRule).forEach((key) => {
    cmd += `-${key} ${String(newRule[key as 'Name'])}`;
  });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
    return 'ok';
  });
}

export function newFirewallRule(newRule: FirewallRuleO) {
  let cmd = 'new-netfirewallrule ';
  Object.keys(newRule).forEach((key) => {
    cmd += `-${key} ${String(newRule[key as 'Name'])}`;
  });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
    return 'ok';
  });
}

export function copyFirewallRule(rule: FirewallRuleO) {
  let cmd = 'copy-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
    return 'ok';
  });
}
export function disableFirewallRule(rule: FirewallRuleO) {
  let cmd = 'disable-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
    return 'ok';
  });
}
export function enableFirewallRule(rule: FirewallRuleO) {
  let cmd = 'enable-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
    return 'ok';
  });
}
export function removeFirewallRule(rule: FirewallRuleO) {
  let cmd = 'remove-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
    return 'ok';
  });
}
export function renameFirewallRule(rule: FirewallRuleO) {
  let cmd = 'rename-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  return execP(cmd).then(({ error, stdout, stderr }) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
    return 'ok';
  });
}
