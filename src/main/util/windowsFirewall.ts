/* eslint no-console: off */
import { exec } from 'child_process';

export type FirewallRule = {
  Name: string;
  DisplayName: string;
  Description: string;
  DisplayGroup: string;
  Group: string;
  Enabled: boolean;
  Profile: string;
  Platform: string;
  Direction: 'Outbound' | 'Inbound';
  Action: 'Allow' | 'Block';
  EdgeTraversalPolicy: 'Allow' | 'Block';
  LooseSourceMapping: boolean;
  LocalOnlyMapping: boolean;
  Owner: string;
  PrimaryStatus: string;
  EnforcementStatus: string;
  PolicyStoreSource: string;
  PolicyStoreSourceType: string;
  RemoteDynamicKeywordAddresses: string;
};

export type FirewallRuleO = Partial<FirewallRule>;

export function getFirewallRules() {
  exec(
    'get-netfirewallrule -all',
    { shell: 'powershell.exe' },
    (error, stdout, stderr) => {
      // do whatever with stdout
      console.log(`Powershell Stdout: ${stdout}`);
      console.log(`Powershell Stderr: ${stderr}`);
      console.log(`Powershell error: ${error}`);

      const rules: FirewallRule[] = [];
      stdout.split('\n\n').forEach((block) => {
        const rule: any = {};
        block.split('\n').forEach((line) => {
          const lineParts = line.split(': ', 2);
          if (lineParts.length === 2) {
            const key = lineParts[0].trim();
            const value = lineParts[1].trim();
            rule[key] = value;
          }
        });
        exec(
          `Get-NetFirewallPortFilter -Name ${rule.Name}`,
          {
            shell: 'powershell.exe',
          },
          (_error, _stdout, _stderr) => {
            console.log(_stdout);
          }
        );
        rules.push(rule as FirewallRule);
      });
      return rules;
    }
  );
}
export function showFirewallRules(rule: FirewallRuleO) {
  let cmd = 'show-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);

    const rules: FirewallRule[] = [];
    stdout.split('\n\n').forEach((block) => {
      const newRule: any = {};
      block.split('\n').forEach((line) => {
        const lineParts = line.split(': ', 2);
        if (lineParts.length === 2) {
          const key = lineParts[0].trim();
          const value = lineParts[1].trim();
          newRule[key] = value;
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
  exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
  });
}

export function newFirewallRule(newRule: FirewallRuleO) {
  let cmd = 'new-netfirewallrule ';
  Object.keys(newRule).forEach((key) => {
    cmd += `-${key} ${String(newRule[key as 'Name'])}`;
  });
  exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
  });
}

export function copyFirewallRule(rule: FirewallRuleO) {
  let cmd = 'copy-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
  });
}
export function disableFirewallRule(rule: FirewallRuleO) {
  let cmd = 'disable-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
  });
}
export function enableFirewallRule(rule: FirewallRuleO) {
  let cmd = 'enable-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
  });
}
export function removeFirewallRule(rule: FirewallRuleO) {
  let cmd = 'remove-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
  });
}
export function renameFirewallRule(rule: FirewallRuleO) {
  let cmd = 'rename-netfirewallrule ';
  Object.keys(rule).forEach((key) => {
    cmd += `-${key} ${String(rule[key as 'Name'])}`;
  });
  exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log(`Powershell Stdout: ${stdout}`);
    console.log(`Powershell Stderr: ${stderr}`);
    console.log(`Powershell error: ${error}`);
  });
}
