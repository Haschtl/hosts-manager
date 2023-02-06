/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import {
  NavPageContainer,
  LoaderBusy,
  Switch,
  CommandBar,
  Dialog,
  InputText,
  Button,
} from 'react-windows-ui';
import { useLocation, useNavigate } from 'react-router';

import Breadcrumbs from '../components/Breadcrumbs';
import { State } from '../store/types';
import './FirewallPage.scss';
import { filterAny } from '../components/Search';
import * as actions from '../store/actions';
import ListItem from '../components/ListItem';
import { FirewallRule } from '../../shared/types';

type DProps = {
  isVisible?: boolean;
  onDismiss?(): void;
};
export const RuleAddDialog: React.FC<DProps> = ({ isVisible, onDismiss }) => {
  const [displayName, setDisplayName] = React.useState('');
  const [action, setAction] = React.useState<'Block' | 'Allow'>('Block');
  const [direction, setDirection] = React.useState<'Inbound' | 'Outbound'>(
    'Inbound'
  );
  const onDisplayNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayName(e.target.value);
    },
    []
  );
  const navigate = useNavigate();
  const navigateNew = React.useCallback(() => {
    navigate(`/firewall/rule`, {
      state: {
        DisplayName: displayName,
        Action: action,
        Direction: direction,
      },
    });
  }, [navigate, displayName, action, direction]);
  const toggleDirection = React.useCallback(() => {
    setDirection(direction === 'Inbound' ? 'Outbound' : 'Inbound');
  }, [direction]);
  const toggleAction = React.useCallback(() => {
    setAction(action === 'Block' ? 'Allow' : 'Block');
  }, [action]);
  return (
    <Dialog
      // @ts-ignore
      style={{ overflow: 'visible' }}
      isVisible={isVisible}
      onBackdropPress={onDismiss}
    >
      {/* @ts-ignore */}
      <Dialog.Header>
        <h3>Add firewall rule</h3>
        {/* @ts-ignore */}
      </Dialog.Header>
      {/* @ts-ignore */}
      <Dialog.Body style={{ padding: 20, overflow: 'visible' }}>
        <p>Create a new firewall rule</p>
        <ListItem
          title="Name"
          ItemEndComponent={
            <InputText
              value={displayName} // Optional
              // @ts-ignore
              placeholder="Name"
              onChange={onDisplayNameChange}
            />
          }
        />
        <ListItem
          title="Action"
          ItemEndComponent={
            <Switch
              labelOn="Allow"
              labelOff="Block"
              labelPosition="start"
              defaultChecked={action === 'Allow'}
              onChange={toggleAction}
            />
          }
        />

        <ListItem
          title="Direction"
          ItemEndComponent={
            <Switch
              labelOn="Outbound"
              labelOff="Inbound"
              labelPosition="start"
              defaultChecked={direction === 'Outbound'}
              onChange={toggleDirection}
            />
          }
        />
        {/* @ts-ignore */}
      </Dialog.Body>
      {/* @ts-ignore */}
      <Dialog.Footer>
        <Button value="Abort" type="danger" onClick={onDismiss} />
        <Button value="Create" type="success" onClick={navigateNew} />
        {/* @ts-ignore */}
      </Dialog.Footer>
    </Dialog>
  );
};
export const getFilename = (f: string) => {
  const sp = f.split('\\');
  return sp[sp.length - 1];
};
type RProps = {
  rule: FirewallRule;
  setFirewallRule: (rule: FirewallRule) => {
    type: string;
    payload: {
      rule: FirewallRule;
    };
  };
};
const RuleItem: React.FC<RProps> = ({ rule, setFirewallRule }) => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = React.useState(false);
  const toggleRule = React.useCallback(() => {
    if (rule.DisplayName) {
      setLoading(true);
      return window.firewall.rules
        .toggle(rule.DisplayName, !rule.Enabled)
        .then((r) => {
          setLoading(false);
          return setFirewallRule(r);
        });
      // if (rule.Enabled) {
      //   window.firewall.rules
      //     .disable(rule.DisplayName)
      //     .then((r) => setFirewallRule(r));
      // } else {
      //   window.firewall.rules
      //     .enable(rule.DisplayName)
      //     .then((r) => setFirewallRule(r));
      // }
    }
    return undefined;
  }, [rule.DisplayName, rule.Enabled, setFirewallRule]);
  return (
    <>
      {isLoading ? (
        <LoaderBusy isLoading={isLoading} display="overlay" />
      ) : null}
      <ListItem
        title={rule.DisplayName}
        onClick={() =>
          navigate(`/firewall/rule`, {
            state: {
              DisplayName: rule.DisplayName,
            },
          })
        }
        subtitle={rule.DisplayGroup}
        icon={rule.Action === 'Allow' ? 'icons10-checkmark' : 'icons10-cancel'}
        ItemEndComponent={
          <Switch
            labelPosition="start"
            defaultChecked={rule.Enabled}
            onChange={toggleRule}
          />
        }
      />
    </>
  );
};
type OwnProps = {
  // filter: string;
};
type LProps = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

const FirewallGroupPage: React.FC<LProps> = ({
  rules,
  searchText,
  setFirewallFilter,
  setFirewallRule,
  filter,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [{ id, key }, setState] = React.useState(location.state);

  const filteredRules = rules
    .filter((v) => v[key as 'Name'] === id)
    .filter(filterAny(searchText))
    .sort((a, b) => (a.Action === 'Allow' ? 1 : -1));

  const toggleFilterSystem = React.useCallback(() => {
    setFirewallFilter({ ...filter, system: !filter.system });
  }, [setFirewallFilter, filter]);
  const toggleFilterBlocked = React.useCallback(() => {
    setFirewallFilter({ ...filter, blocked: !filter.blocked });
  }, [setFirewallFilter, filter]);
  const toggleFilterAllowed = React.useCallback(() => {
    setFirewallFilter({ ...filter, allowed: !filter.allowed });
  }, [setFirewallFilter, filter]);
  const toggleFilterEnabled = React.useCallback(() => {
    setFirewallFilter({ ...filter, enabled: !filter.enabled });
  }, [setFirewallFilter, filter]);
  const toggleFilterDisabled = React.useCallback(() => {
    setFirewallFilter({ ...filter, disabled: !filter.disabled });
  }, [setFirewallFilter, filter]);
  const inboundRules = filteredRules.filter((v) => v.Direction === 'Inbound');
  const outboundRules = filteredRules.filter((v) => v.Direction !== 'Inbound');
  const renderRow = (item: FirewallRule) => (
    <RuleItem
      rule={item}
      key={item.DisplayName}
      setFirewallRule={setFirewallRule}

      // onChange={editable}
    />
  );
  const [addVisible, setAddVisible] = React.useState(false);
  const showAdd = React.useCallback(() => {
    setAddVisible(true);
  }, []);
  const hideAdd = React.useCallback(() => {
    setAddVisible(false);
  }, []);
  return (
    <NavPageContainer animateTransition>
      <RuleAddDialog isVisible={addVisible} onDismiss={hideAdd} />
      <div className="page dns">
        <Breadcrumbs
          title={key}
          history={[{ title: 'Firewall', to: '/firewall' }]}
        />

        <CommandBar>
          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={showAdd}
            value="Add"
            icon={<i className="icons10-plus color-success" />}
          />

          {/* @ts-ignore */}
          <CommandBar.SplitDivider />
          {/* @ts-ignore */}
          <CommandBar.Menu menuDirection="leftJustify">
            {/* @ts-ignore */}
            <CommandBar.MenuTrigger>
              {/* @ts-ignore */}
              <CommandBar.Button
                value="Filter"
                // icon={<i className="icons10-file" />}
              />
              {/* @ts-ignore */}
            </CommandBar.MenuTrigger>

            {/* @ts-ignore */}
            <CommandBar.MenuItem
              onClick={toggleFilterSystem}
              label="System rules"
              icon={
                <i
                  className={`icons10-cross color-danger ${
                    filter.system ? 'filter-active' : ''
                  }`}
                />
              }
            />
            {/* @ts-ignore */}
            <CommandBar.MenuItem
              onClick={toggleFilterEnabled}
              label="Enabled"
              icon={
                <i
                  className={`icons10-cross color-danger ${
                    filter.enabled ? 'filter-active' : ''
                  }`}
                />
              }
            />
            {/* @ts-ignore */}
            <CommandBar.MenuItem
              onClick={toggleFilterDisabled}
              label="Disabled"
              icon={
                <i
                  className={`icons10-cross color-danger ${
                    filter.disabled ? 'filter-active' : ''
                  }`}
                />
              }
            />
            {/* @ts-ignore */}
            <CommandBar.MenuItem
              onClick={toggleFilterBlocked}
              label="Blocked"
              icon={
                <i
                  className={`icons10-cross color-danger ${
                    filter.blocked ? 'filter-active' : ''
                  }`}
                />
              }
            />
            {/* @ts-ignore */}
            <CommandBar.MenuItem
              onClick={toggleFilterAllowed}
              label="Allowed"
              icon={
                <i
                  className={`icons10-cross color-danger ${
                    filter.allowed ? 'filter-active' : ''
                  }`}
                />
              }
            />
            {/* @ts-ignore */}
          </CommandBar.Menu>
        </CommandBar>
        <div className="content">
          <p>
            This page contains rules where &apos;{key}&apos; is &apos;
            {getFilename(id)}&apos;.
          </p>
        </div>
        {rules?.length === 0 ? (
          <LoaderBusy />
        ) : (
          <>
            {inboundRules.length === 0 ? null : <h3>Inbound</h3>}
            {inboundRules.map((r) => renderRow(r))}
            {outboundRules.length === 0 ? null : <h3>Outbound</h3>}
            {outboundRules.map((r) => renderRow(r))}

            {/* <ViewportList items={outboundRules} itemMinSize={60}>
              {renderRow}
            </ViewportList> */}
          </>
        )}
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {
  setFirewallRules: actions.setFirewallRules,
  setFirewallRule: actions.setFirewallRule,
  setFirewallFilter: actions.setFirewallFilter,
};
const mapStateToProps = (state: State) => {
  return {
    rules: state.app.firewall.rules,
    searchText: state.app.searchText,
    filter: state.app.firewall.filter,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FirewallGroupPage);
