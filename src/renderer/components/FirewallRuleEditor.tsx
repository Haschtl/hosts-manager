/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  CommandBar,
  InputSearchBox,
  InputText,
  LoaderBusy,
  Select,
  Switch,
} from 'react-windows-ui';
import { InputTextProps } from 'react-windows-ui/dist/components/InputText';
import { SelectProps } from 'react-windows-ui/dist/components/Select';
import { useNavigate } from 'react-router';

import { FirewallRule } from '../../shared/types';
import { State } from '../store/types';
import ListItem from './ListItem';
import './FirewallRuleEditor.scss';
import * as actions from '../store/actions';

const PortRegEx = [
  '',
  '/^d+$/',
  'Any',
  '^([0-9]*)+(,[0-9]+)+$',
  'PlayToDiscovery',
  '^([0-9]*)+(-[0-9]+)',
];
const AddressRegEx = [
  '',
  'Any',
  '^(?:[0-9]{1,3}.){3}[0-9]{1,3}$',
  '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))',
];
export const defaultRule: FirewallRule = {
  Direction: 'Inbound',
  Action: 'Block',
  // DisplayName: '',
  Enabled: true,
};
type RProps = Omit<InputTextProps, 'onChange'> & {
  regEx?: string[];
  defaultValue?: string;
  onChange(v: string): void;
};
const InputTextRegEx: React.FC<RProps> = ({
  regEx,
  onChange,
  defaultValue,
  ...props
}) => {
  const valid =
    regEx === undefined
      ? undefined
      : regEx.map((r) => RegExp(r).test(props.value)).some((v) => v);
  const onChangeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );
  return (
    <>
      {/* <InputSearchBox {...props} onChange={onChangeHandler} /> */}
      <InputText
        {...props}
        onChange={onChangeHandler}
        placeholder={defaultValue}
        setStatus={
          valid === undefined ? undefined : valid ? 'success' : 'danger'
        }
      />
    </>
  );
};
type SProps = Omit<Omit<SelectProps, 'data'>, 'onChange'> & {
  onChange(v: string): void;
  disabled?: boolean;
  data: { label: string; value: string }[];
};
const SelectPlus: React.FC<SProps> = ({ disabled, ...props }) => {
  if (disabled) {
    return (
      <div style={{ pointerEvents: 'none' }}>
        <Select {...(props as unknown as SelectProps)} />
      </div>
    );
  }
  return <Select {...(props as unknown as SelectProps)} />;
};
type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;
type OwnProps = {
  rule: FirewallRule;
  isNew?: boolean;
  editable?: boolean;
  onEdit?(rule: FirewallRule): void;
};
const FirewallEditor: React.FC<Props> = ({
  rule,
  isNew,
  editable = false,
  onEdit = () => {},
  removeFirewallRule,
}) => {
  const [currentRule, setCurrentRule] = React.useState(rule);
  const setDirection = React.useCallback(
    (e: 'Inbound') => {
      setCurrentRule({ ...currentRule, Direction: e });
    },
    [currentRule]
  );
  const setDisplayName = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, DisplayName: e });
    },
    [currentRule]
  );
  const setDisplayGroup = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, DisplayGroup: e });
    },
    [currentRule]
  );
  const setGroup = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, Group: e });
    },
    [currentRule]
  );
  const setDescription = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, Description: e });
    },
    [currentRule]
  );
  const setEdgeTraversalPolicy = React.useCallback(
    (e: 'Block') => {
      setCurrentRule({ ...currentRule, EdgeTraversalPolicy: e });
    },
    [currentRule]
  );
  const setProgram = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      return window.files.showOpenFileDialog().then((v) => {
        if (!v.canceled) {
          setCurrentRule({ ...currentRule, Program: v.filePaths[0] });
        }
        return undefined;
      });
    },
    [currentRule]
  );
  const rmProgram = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentRule({ ...currentRule, Program: 'All' });
    },
    [currentRule]
  );
  const setService = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, Service: e });
    },
    [currentRule]
  );
  const setProtocol = React.useCallback(
    (e: 'TCP') => {
      setCurrentRule({ ...currentRule, Protocol: e });
    },
    [currentRule]
  );
  const setLocalAddress = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, LocalAddress: e });
    },
    [currentRule]
  );
  const setLocalPort = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, LocalPort: e });
    },
    [currentRule]
  );
  const setLocalUser = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, LocalUser: e });
    },
    [currentRule]
  );
  const setRemoteAddress = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, RemoteAddress: e });
    },
    [currentRule]
  );
  const setRemotePort = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, RemotePort: e });
    },
    [currentRule]
  );
  const setRemoteUser = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, RemoteUser: e });
    },
    [currentRule]
  );
  const setProfile = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, Profile: e });
    },
    [currentRule]
  );
  const setEncryption = React.useCallback(
    (e: 'Required') => {
      setCurrentRule({ ...currentRule, Encryption: e });
    },
    [currentRule]
  );
  const setInterfaceType = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, InterfaceType: e });
    },
    [currentRule]
  );
  const setDynamicTarget = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, DynamicTarget: e });
    },
    [currentRule]
  );
  const setPolicyStoreSource = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, PolicyStoreSource: e });
    },
    [currentRule]
  );
  const setPolicyStoreSourceType = React.useCallback(
    (e: string) => {
      setCurrentRule({ ...currentRule, PolicyStoreSourceType: e });
    },
    [currentRule]
  );
  const toggleAction = React.useCallback(() => {
    setCurrentRule({
      ...currentRule,
      Action: currentRule.Action === 'Allow' ? 'Block' : 'Allow',
    });
  }, [currentRule]);
  const toggleEnabled = React.useCallback(() => {
    setCurrentRule({
      ...currentRule,
      Enabled: !currentRule.Enabled,
    });
  }, [currentRule]);

  const toggleLooseSourceMapping = React.useCallback(() => {
    setCurrentRule({
      ...currentRule,
      LooseSourceMapping: !currentRule.LooseSourceMapping,
    });
  }, [currentRule]);
  const toggleLocalOnlyMapping = React.useCallback(() => {
    setCurrentRule({
      ...currentRule,
      LocalOnlyMapping: !currentRule.LocalOnlyMapping,
    });
  }, [currentRule]);

  const toggleOverrideBlockRules = React.useCallback(() => {
    setCurrentRule({
      ...currentRule,
      OverrideBlockRules: !currentRule.OverrideBlockRules,
    });
  }, [currentRule]);
  const [isLoading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const onSave = React.useCallback(() => {
    setLoading(true);
    if (isNew) {
      return window.firewall.rules
        .new(currentRule)
        .then(() => {
          return navigate('/firewall');
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return window.firewall.rules
      .set(currentRule)
      .then(() => {
        return navigate('/firewall');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentRule, isNew, navigate]);
  const onDelete = React.useCallback(() => {
    if (currentRule.DisplayName) {
      setLoading(true);
      return window.firewall.rules
        .remove(currentRule.DisplayName)
        .then((v) => {
          console.log('Remove FW was successful:', v);
          if (v) {
            removeFirewallRule(currentRule.DisplayName!);
            return navigate('/firewall');
          }
          return undefined;
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
    return undefined;
  }, [currentRule.DisplayName, navigate, removeFirewallRule]);
  return (
    <>
      <LoaderBusy isLoading={isLoading} display="overlay" />
      <CommandBar>
        {/* @ts-ignore */}
        <CommandBar.Button
          onClick={onSave}
          value="Save"
          icon={<i className="icons10-checkmark color-success" />}
        />
        {/* @ts-ignore */}
        <CommandBar.Button
          onClick={onDelete}
          value="Delete"
          icon={<i className="icons10-cross color-danger" />}
        />
      </CommandBar>
      <div className="hosts-file-editor">
        <ListItem
          title="Direction"
          subtitle="Specifies that matching firewall rules of the indicated direction are created. This parameter specifies which direction of traffic to match with this rule."
          ItemEndComponent={
            <SelectPlus
              disabled
              defaultValue={currentRule.Direction}
              onChange={setDirection}
              data={[
                { label: 'Inbound', value: 'Inbound' },
                { label: 'Outbound', value: 'Outbound' },
              ]}
            />
          }
        />
        <h3>General</h3>
        <ListItem
          title="Action"
          subtitle="Specifies that matching firewall rules of the indicated action are created. This parameter specifies the action to take on traffic that matches this rule."
          ItemEndComponent={
            <Switch
              onChange={toggleAction}
              defaultChecked={currentRule.Action === 'Allow'}
              labelOn="Allow"
              labelOff="Block"
              labelPosition="start"
            />
          }
        />
        <ListItem
          title="DisplayName"
          subtitle="Specifies that only matching firewall rules of the indicated display name are created. Wildcard characters are accepted. Specifies the localized, user-facing name of the firewall rule being created. When creating a rule this parameter is required. This parameter value is locale-dependent. If the object is not modified, then this parameter value may change in certain circumstances."
          ItemEndComponent={
            <InputTextRegEx
              disabled
              onChange={setDisplayName}
              value={currentRule.DisplayName}
              defaultValue="DisplayName"
            />
          }
        />
        <ListItem
          title="Description"
          subtitle="Specifies that matching firewall rules of the indicated description are created. Wildcard characters are accepted. This parameter provides information about the firewall rule. This parameter specifies the localized, user-facing description of the IPsec rule."
          ItemEndComponent={
            <InputTextRegEx
              onChange={setDescription}
              value={currentRule.Description}
              defaultValue="Description"
            />
          }
        />
        <ListItem
          title="EdgeTraversalPolicy"
          subtitle="Specifies that matching firewall rules of the indicated edge traversal policy are created. This parameter specifies how this firewall rule will handle edge traversal cases. Valid only when the Direction parameter is set to Inbound."
          ItemEndComponent={
            <SelectPlus
              defaultValue={currentRule.EdgeTraversalPolicy}
              onChange={setEdgeTraversalPolicy}
              data={[
                { label: 'Block', value: 'Block' },
                { label: 'Allow', value: 'Allow' },
                { label: 'DeferToUser', value: 'DeferToUser' },
                { label: 'DeferToApp', value: 'DeferToApp' },
              ]}
            />
          }
        />
        <ListItem
          title="Enabled"
          subtitle="Specifies that matching firewall rules of the indicated state are created. This parameter specifies that the rule object is administratively enabled or administratively disabled."
          ItemEndComponent={
            <Switch
              onChange={toggleEnabled}
              defaultChecked={currentRule.Enabled}
              labelPosition="start"
            />
          }
        />
        <h3>Programs and services</h3>
        <ListItem
          title="Program"
          subtitle="Specifies the path and file name of the program for which the rule allows traffic. This is specified as the full path to an application file. Querying for rules with this parameter can only be performed using filter objects."
          ItemEndComponent={
            <div className="program-select">
              {/* <label htmlFor="file-upload" className="custom-file-upload"> */}
              <Button
                value="Select"
                onClick={setProgram}
                icon={<i className="icons10-file-explorer" />}
              />
              <Button
                value="Clear"
                onClick={rmProgram}
                icon={<i className="icons10-cross" />}
              />
              {/* </label>
              <input
                id="file-upload"
                type="file"
                accept=".exe"
                onChange={setProgram}
              /> */}
            </div>
          }
        >
          <div
            style={{
              paddingLeft: '32px',
              paddingTop: '10px',
              paddingBottom: '10px',
            }}
          >
            {currentRule.Program}
          </div>
        </ListItem>
        <ListItem
          title="Service"
          subtitle="Specifies the short name of a Windows Server 2012 service to which the firewall rule applies. If this parameter is not specified, then network traffic generated by any program or service matches this rule."
          ItemEndComponent={
            <InputTextRegEx
              onChange={setService}
              value={currentRule.Service}
              defaultValue="Any"
            />
          }
        />
        <h3>Protocols and ports</h3>
        <ListItem
          title="Protocol"
          subtitle="Specifies that network packets with matching IP addresses match this rule. This parameter specifies the protocol for an IPsec rule."
          ItemEndComponent={
            <SelectPlus
              defaultValue={currentRule.Protocol}
              onChange={setProtocol}
              data={[
                { label: 'Any', value: 'Any' },
                { label: 'TCP', value: 'TCP' },
                { label: 'UDP', value: 'UDP' },
                { label: 'ICMPv4', value: 'ICMPv4' },
                { label: 'ICMPv6', value: 'ICMPv6' },
              ]}
            />
          }
        />
        <ListItem
          title="LocalAddress"
          subtitle="Specifies that network packets with matching IP addresses match this rule. This parameter value is the first end point of an IPsec rule and specifies the computers that are subject to the requirements of this rule. This parameter value is an IPv4 or IPv6 address, hostname, subnet, range, or the following keyword: Any."
          ItemEndComponent={
            <InputTextRegEx
              onChange={setLocalAddress}
              regEx={AddressRegEx}
              value={currentRule.LocalAddress}
              defaultValue="Any"
            />
          }
        />
        <ListItem
          title="LocalPort"
          subtitle="Specifies that network packets with matching IP local port numbers match this rule. The acceptable value is a port, range, or keyword and depends on the protocol. If the Protocol parameter value is TCP or UDP, then the acceptable values for this parameter are: Port-range (0-65535), Port-number (80), Keyword (PlayToDiscovery, Any). If the Protocol parameter value is ICMPv4 or ICMPv6, then the acceptable values for this parameter are: ICMP type (0,8), Type and code (0-255) or keyword (Any)."
          ItemEndComponent={
            <InputTextRegEx
              onChange={setLocalPort}
              regEx={PortRegEx}
              value={currentRule.LocalPort}
              defaultValue="Any"
            />
          }
        />
        <ListItem
          title="LocalUser"
          subtitle="Specifies the principals to which network traffic this firewall rule applies. Principals for which the network traffic this firewall rule should apply. The principals, represented by security identifiers (SIDs) in the security descriptor definition language (SDDL) string, are services, users, application containers, or any SID to which network traffic is associated."
          ItemEndComponent={
            <InputTextRegEx
              onChange={setLocalUser}
              value={currentRule.LocalUser}
              defaultValue="Any"
            />
          }
        />
        <ListItem
          title="RemoteAddress"
          subtitle="Specifies that network packets with matching IP addresses match this rule. This parameter value is an IPv4 or IPv6 address, subnet, range or keyword."
          ItemEndComponent={
            <InputTextRegEx
              onChange={setRemoteAddress}
              regEx={AddressRegEx}
              value={currentRule.RemoteAddress}
              defaultValue="Any"
            />
          }
        />
        <ListItem
          title="RemotePort"
          subtitle="Specifies that network packets with matching IP port numbers match this rule. This parameter value is the second end point of an IPsec rule. The acceptable value is a port, range, or keyword and depends on the protocol."
          ItemEndComponent={
            <InputTextRegEx
              onChange={setRemotePort}
              regEx={PortRegEx}
              value={currentRule.RemotePort}
              defaultValue="Any"
            />
          }
        />
        <ListItem
          title="RemoteUser"
          subtitle="Specifies that matching IPsec rules of the indicated user accounts are created. This parameter specifies that only network packets that are authenticated as incoming from or outgoing to a user identified in the list of user accounts match this rule. This parameter value is specified as an SDDL string. Querying for rules with this parameter can only be performed using filter objects."
          ItemEndComponent={
            <InputTextRegEx
              onChange={setRemoteUser}
              value={currentRule.RemoteUser}
              defaultValue="Any"
            />
          }
        />
        <ListItem
          title="InterfaceType"
          subtitle="Specifies that only network connections made through the indicated interface types are subject to the requirements of this rule. This parameter specifies different authentication requirements for each of the three main network types."
          ItemEndComponent={
            <SelectPlus
              defaultValue={currentRule.InterfaceType}
              onChange={setInterfaceType}
              data={[
                { label: 'Any', value: 'Any' },
                { label: 'Wired', value: 'Wired' },
                { label: 'Wireless', value: 'Wireless' },
                { label: 'RemoteAccess', value: 'RemoteAccess' },
              ]}
            />
          }
        />
        <h3>Misc</h3>
        <ListItem
          title="Profile"
          subtitle="Specifies one or more profiles to which the rule is assigned. The rule is active on the local computer only when the specified profile is currently active. This relationship is many-to-many and can be indirectly modified by the user, by changing the Profiles field on instances of firewall rules. Only one profile is applied at a time."
          ItemEndComponent={
            <SelectPlus
              defaultValue={currentRule.Profile}
              onChange={setProfile}
              data={[
                { label: 'Any', value: 'Any' },
                { label: 'Domain', value: 'Domain' },
                { label: 'Private', value: 'Private' },
                { label: 'Public', value: 'Public' },
                { label: 'NotApplicable', value: 'NotApplicable' },
              ]}
            />
          }
        />
        <ListItem
          title="Encryption"
          subtitle="Specifies that encryption in authentication is required on firewall rules. The authentication is done through a separate IPsec or main mode rule."
          ItemEndComponent={
            <SelectPlus
              defaultValue={currentRule.Encryption}
              onChange={setEncryption}
              data={[
                { label: 'NotRequired', value: 'NotRequired' },
                { label: 'Required', value: 'Required' },
                { label: 'Dynamic', value: 'Dynamic' },
              ]}
            />
          }
        />
        <h3>Info</h3>
        <ListItem
          title="DynamicTarget"
          subtitle="Specifies a dynamic transport. The cmdlet adds the dynamic transport that you specify as a condition that must be matched for the firewall rule to apply."
          ItemEndComponent={
            <SelectPlus
              defaultValue={currentRule.DynamicTarget}
              onChange={setDynamicTarget}
              data={[
                { label: 'Any', value: 'Any' },
                { label: 'ProximityApps', value: 'ProximityApps' },
                { label: 'ProximitySharing', value: 'ProximitySharing' },
                { label: 'WifiDirectPrinting', value: 'WifiDirectPrinting' },
                { label: 'WifiDirectDisplay', value: 'WifiDirectDisplay' },
                {
                  label: 'WifiDirectDevices',
                  value: 'WifiDirectDevices',
                },
              ]}
            />
          }
        />
        <ListItem
          title="DisplayGroup"
          subtitle="The displayed group of this rule"
          ItemEndComponent={
            <InputTextRegEx
              onChange={setDisplayGroup}
              value={currentRule.DisplayGroup}
              defaultValue="DisplayGroup"
              disabled
            />
          }
        />
        <ListItem
          title="Group"
          subtitle="Specifies that only matching firewall rules of the indicated group association are copied. Wildcard characters are accepted. This parameter specifies the source string for the DisplayGroup parameter. If the DisplayGroup parameter value is a localizable string, then this parameter contains an indirect string."
          ItemEndComponent={
            <InputTextRegEx
              value={currentRule.Group}
              onChange={setGroup}
              disabled
              defaultValue="Group"
            />
          }
        />
        <ListItem
          title="PolicyStore"
          subtitle="Specifies the policy store from which to retrieve the rules to be created. A policy store is a container for firewall and IPsec policy."
          ItemEndComponent={
            <SelectPlus
              defaultValue={currentRule.PolicyStoreSource}
              onChange={setPolicyStoreSource}
              data={[
                { label: 'PersistentStore', value: 'PersistentStore' },
                { label: 'ActiveStore', value: 'ActiveStore' },
                { label: 'RSOP', value: 'RSOP' },
                { label: 'SystemDefaults', value: 'SystemDefaults' },
                { label: 'StaticServiceStore', value: 'StaticServiceStore' },
                {
                  label: 'ConfigurableServiceStore',
                  value: 'ConfigurableServiceStore',
                },
              ]}
            />
          }
        />
        <ListItem
          title="PolicyStoreSourceType"
          subtitle="Specifies that firewall rules that match the indicated policy store source type are retrieved. This parameter describes the type of policy store where the rule originated if the object is retrieved from the ActiveStore with the TracePolicyStoreSource option set. This parameter value is automatically generated and should not be modified."
          ItemEndComponent={
            <SelectPlus
              defaultValue={currentRule.PolicyStoreSourceType}
              onChange={setPolicyStoreSourceType}
              data={[
                { label: 'None', value: 'None' },
                { label: 'Local', value: 'Local' },
                { label: 'GroupPolicy', value: 'GroupPolicy' },
                { label: 'Dynamic', value: 'Dynamic' },
                { label: 'Generated', value: 'Generated' },
                { label: 'Hardcoded', value: 'Hardcoded' },
              ]}
            />
          }
        />
        <ListItem
          title="Status"
          subtitle="Specifies that firewall rules that match the indicated primary status are retrieved. This parameter specifies the overall status of the rule.

OK: Specifies that the rule will work as specified.
Degraded: Specifies that one or more parts of the rule will not be enforced.
Error: Specifies that the computer is unable to use the rule at all."
          ItemEndComponent={
            currentRule.PrimaryStatus === 'OK' ? (
              <i className="icons10-checkmark color-success" />
            ) : (
              <i className="icons10-cross color-danger" />
            )
          }
        >
          <div
            style={{
              paddingLeft: '32px',
              paddingTop: '10px',
              paddingBottom: '10px',
            }}
          >
            <p>{currentRule.Status}</p>
          </div>
        </ListItem>
        <ListItem
          title="Platform"
          subtitle="Specifies which version of Windows the associated rule applies. The acceptable format for this parameter is a number in the Major.Minor format. The version number of 6.0 corresponds to Vista (nextref_vista), 6.1 corresponds to Win7 (Windows® 7 or firstref_longhorn), and 6.2 corresponds to Win8 (Windows® 8 or Windows Server 2012). If + is not specified, then only that version is associated. If + is specified, then that version and later versions are associated. Querying for rules with this parameter with the Get-NetFirewallRule cmdlet cannot be performed."
          ItemEndComponent={currentRule.Platform}
        />
        <ListItem
          title="Package"
          subtitle="Specifies the Windows Store application to which the firewall rule applies. This parameter is specified as a security identifier (SID). Querying for rules with this parameter can only be performed using filter objects."
          ItemEndComponent={currentRule.Package}
        />
        <ListItem
          title="Owner"
          subtitle="Specifies that matching firewall rules of the indicated owner are created. This parameter specifies the owner of the firewall rule, represented as an SDDL string. All Windows Store applications that require network traffic create network isolation rules (normally through installing via the Store), where the user that installed the application is the owner. This parameter specifies that only network packets that are authenticated as coming from or going to an owner identified in the list of accounts (SID) match this rule."
          ItemEndComponent={currentRule.Owner}
        />
        <ListItem
          title="Name"
          subtitle="Specifies that only matching firewall rules of the indicated name are created. Wildcard characters are accepted. This parameter acts just like a file name, in that only one rule with a given name may exist in a policy store at a time. During group policy processing and policy merge, rules that have the same name but come from multiple stores being merged, will overwrite one another so that only one exists."
          ItemEndComponent={currentRule.Name}
        />
        <ListItem
          title="LooseSourceMapping"
          subtitle="Indicates that matching firewall rules of the indicated value are created. This parameter specifies the firewall rules for loose source mapping, which describes whether a packet can have a non-local source address when being forwarded to a destination."
          ItemEndComponent={
            <Switch
              labelPosition="start"
              onChange={toggleLooseSourceMapping}
              defaultChecked={currentRule.LooseSourceMapping}
              disabled
            />
          }
        />
        <ListItem
          title="LocalOnlyMapping"
          subtitle="Indicates that matching firewall rules of the indicated value are created. This parameter specifies the firewall rules for local only mapping, which describes whether a packet must pass through a local address on the way to the destination."
          ItemEndComponent={
            <Switch
              labelPosition="start"
              onChange={toggleLocalOnlyMapping}
              defaultChecked={currentRule.LocalOnlyMapping}
              disabled
            />
          }
        />
        <ListItem
          title="OverrideBlockRules"
          subtitle="Indicates that matching network traffic that would otherwise be blocked are allowed. The network traffic must be authenticated by using a separate IPsec rule."
          ItemEndComponent={
            <Switch
              labelPosition="start"
              onChange={toggleOverrideBlockRules}
              defaultChecked={currentRule.OverrideBlockRules}
              disabled
            />
          }
        />
        <ListItem
          title="RemoteDynamicKeywordAddresses"
          subtitle="Specifies dynamic keyword addresses that match this rule."
          ItemEndComponent={currentRule.RemoteDynamicKeywordAddresses}
        />
      </div>
    </>
  );
};

const mapDispatchToProps = {
  removeFirewallRule: actions.removeFirewallRule,
};

const mapStateToProps = (state: State) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(FirewallEditor);
