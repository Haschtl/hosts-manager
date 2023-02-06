/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import {
  NavPageContainer,
  LoaderBusy,
  CommandBar,
  Select,
} from 'react-windows-ui';
import { Route, Routes, useNavigate } from 'react-router';

import { State } from '../store/types';
import ListItem from '../components/ListItem';
import './FirewallPage.scss';
import { filterAny } from '../components/Search';
import { FirewallRule, FirewallRuleKeys } from '../../shared/types';
import * as actions from '../store/actions';
import FirewallGroupPage, {
  getFilename,
  RuleAddDialog,
} from './FirewallGroupPage';
import FirewallRulePage from './FirewallRule';
import { HeaderButton } from './StartPage';

type HProps = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FirewallPage: React.FC<HProps> = ({
  rules,
  searchText,
  filter,
  profiles,
  setFirewallRules,
  setFirewallFilter,
}) => {
  const [isLoading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const [grouping, setGrouping] = React.useState<FirewallRuleKeys>('Program');
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
  const navigateGroup = React.useCallback(
    (id: string) => {
      navigate('/firewall/group', {
        state: {
          key: grouping,
          id,
        },
      });
    },
    [navigate, grouping]
  );

  const reload = React.useCallback(() => {
    if (isLoading) {
      return undefined;
    }
    setLoading(true);
    return window.firewall.rules.showSmart().then((r) => {
      setLoading(false);
      return setFirewallRules(r);
    });
  }, [setFirewallRules, isLoading]);

  const filteredRules = rules
    .filter(filterAny(searchText))
    .filter((r) =>
      !filter.system
        ? true
        : !String(r.Program)?.toLowerCase().startsWith('%systemroot%')
    )
    .filter((r) => (!filter.blocked ? true : r.Action !== 'Block'))
    .filter((r) => (!filter.allowed ? true : r.Action === 'Block'))
    .filter((r) => (!filter.disabled ? true : r.Enabled))
    .filter((r) => (!filter.enabled ? true : !r.Enabled));
  const programGroups = filteredRules.reduce((r, a) => {
    // @ts-ignore
    r[a[grouping]!] = r[a[grouping]!] || [];
    // @ts-ignore
    r[a[grouping]!].push(a);
    return r;
  }, Object.create({}) as { [key: string]: FirewallRule[] });
  const groupNames = Object.keys(programGroups).sort();
  // .filter(filterAny(searchText));

  const groups: FirewallRuleKeys[] = [
    'Name',
    'DisplayName',
    'Description',
    'DisplayGroup',
    'Group',
    'Enabled',
    'Profile',
    'Platform',
    'Direction',
    'Action',
    'EdgeTraversalPolicy',
    'Protocol',
    'LocalPort',
    'RemotePort',
    'Program',
    'Package',
    'LocalAddress',
    'RemoteAddress',
  ];
  // const groupFilters = groups.map((v) => {
  //   return (
  //     // @ts-ignore
  //     <CommandBar.MenuItem
  //       label={v}
  //       key={v}
  //       onClick={() => {
  //         setGrouping(v as 'Name');
  //       }}
  //     />
  //   );
  // });

  const [addVisible, setAddVisible] = React.useState(false);
  const showAdd = React.useCallback(() => {
    setAddVisible(true);
  }, []);
  const hideAdd = React.useCallback(() => {
    setAddVisible(false);
  }, []);

  const profileRules = profiles.map((p) => {
    const pRules = rules.filter(
      (r) => r.Profile === 'Any' || r.Profile?.includes(p.Name!)
    );
    return { profile: p, rules: pRules };
  });

  return (
    <NavPageContainer animateTransition>
      <RuleAddDialog isVisible={addVisible} onDismiss={hideAdd} />
      <div className="page full dns">
        {/* <h2>Profiles</h2> */}
        <div className={`start-header p20 ${true ? 'active' : 'inactive'}`}>
          <div className="page-header">
            <h1>Firewall</h1>
            <button type="button" className="flat" onClick={reload}>
              {!isLoading ? (
                <i className="icons10-refresh" style={{ fontSize: '25px' }} />
              ) : (
                <LoaderBusy isLoading={isLoading} />
              )}
            </button>
          </div>
          <div className="abs_buttonbar">
            {profileRules.map((p) => (
              <HeaderButton
                className="profile-header"
                key={p.profile.Name}
                title={String(p.profile.Name)}
                // subtitle={p.profile.Enabled ? 'enabled' : 'disabled'}
                subtitle={`${p.rules.filter((r) => r.Enabled).length}/${
                  p.rules.length
                } rules`}
                // imgSrc={RedirectedIcon}
                icon={
                  p.profile.Enabled
                    ? 'icons10-checkmark color-success'
                    : 'icons10-cancel color-danger'
                }
                // onClick={navigateSystem}
              />
            ))}
          </div>
        </div>
        <br />
        <br />
        <div className="p20">
          <h2>Rules</h2>

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
            {/* @ts-ignore */}
            <CommandBar.SplitDivider />
            <Select
              // style={{ maxWidth: '100px' }}
              defaultValue={grouping}
              // @ts-ignore
              onChange={setGrouping}
              data={
                groups.map((v) => {
                  return { value: String(v), label: String(v) };
                }) as any[]
              }
            />
          </CommandBar>
          <div className="content">
            <p>View and configure Windows-Firewall rules.</p>
            <p className="app-para-light">
              For full control edit the{' '}
              <button
                className="flat"
                type="button"
                onClick={() => window.firewall.open()}
              >
                Windows Firewall
              </button>{' '}
              directly.
            </p>
          </div>
          {groupNames.map((pg) => (
            <ListItem
              className="app-section-container-fg item-container firewall-program"
              title={getFilename(pg)}
              subtitle={pg}
              key={pg}
              onClick={() => {
                navigateGroup(pg);
              }}
              ItemEndComponent={
                <div className="programm-card-end">
                  <div>
                    {
                      programGroups[pg].filter((r) => r.Direction === 'Inbound')
                        .length
                    }{' '}
                    <i className="icons10-arrow-down color-success" />
                  </div>
                  <div>
                    {
                      programGroups[pg].filter(
                        (r) => r.Direction === 'Outbound'
                      ).length
                    }{' '}
                    <i className="icons10-arrow-up color-danger" />
                  </div>
                </div>
              }
            />
          ))}
          <LoaderBusy isLoading={rules.length === 0} />
        </div>
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {
  setFirewallRules: actions.setFirewallRules,
  setFirewallFilter: actions.setFirewallFilter,
};
const mapStateToProps = (state: State) => {
  return {
    rules: state.app.firewall.rules,
    profiles: state.app.firewall.profiles,
    searchText: state.app.searchText,
    filter: state.app.firewall.filter,
  };
};
const CFirewallPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FirewallPage);

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const DNSPage: React.FC<Props> = () => {
  return (
    <Routes key="firewallroot">
      <Route path="/" element={<CFirewallPage />} />
      <Route path="/group" element={<FirewallGroupPage />} />
      <Route path="/rule" element={<FirewallRulePage />} />
    </Routes>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DNSPage);
