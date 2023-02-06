/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavPageContainer, CommandBar } from 'react-windows-ui';

import { State } from '../store/types';
import { sortHosts } from '../store/selectors';
import HostsFileEditor from '../components/HostsFileEditor';

import RedirectedIcon from '../../../assets/icons/redirect_24.svg';
import { path2profilename, hostsFile2sources } from '../../shared/helper';
import { HostsFile } from '../../shared/types';
import Breadcrumbs from '../components/Breadcrumbs';
import './ListViewPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const ListViewPage: React.FC<Props> = ({ settings, profiles, systemHosts }) => {
  const location = useLocation();
  let profile: HostsFile = { lines: [], path: '' };
  let id = location.pathname.split('/')[2];

  if (location.pathname === '/system') {
    profile = systemHosts;
    id = 'System hosts';
  } else {
    const tempProfile = profiles.find((p) => path2profilename(p.path) === id);
    if (tempProfile) {
      profile = tempProfile;
    }
  }
  const sorted = sortHosts(hostsFile2sources(profile), settings.ipv6);
  const [filter, setFilter] = React.useState<{
    blocked: boolean;
    allowed: boolean;
    redirected: boolean;
  }>({
    blocked: false,
    allowed: false,
    redirected: false,
  });
  const toggleFilterBlocked = React.useCallback(() => {
    setFilter({ ...filter, blocked: !filter.blocked });
  }, [filter]);
  const toggleFilterRedirected = React.useCallback(() => {
    setFilter({ ...filter, redirected: !filter.redirected });
  }, [filter]);
  const toggleFilterAllowed = React.useCallback(() => {
    setFilter({ ...filter, allowed: !filter.allowed });
  }, [filter]);
  return (
    <NavPageContainer animateTransition>
      <div className="page list">
        <Breadcrumbs
          history={[{ title: 'Profiles', to: '/index.html' }]}
          title={id}
        />
        <CommandBar>
          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={toggleFilterBlocked}
            value="Blocked"
            icon={
              <i
                className={`icons10-cancel color-danger ${
                  filter.blocked ? 'filter-active' : ''
                }`}
                style={{ marginLeft: '5px', marginRight: '5px' }}
              />
            }
          />

          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={toggleFilterAllowed}
            value="Allowed"
            icon={
              <i
                className={`icons10-checkmark color-success ${
                  filter.allowed ? 'filter-active' : ''
                }`}
                style={{ marginLeft: '5px', marginRight: '5px' }}
              />
            }
          />
          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={toggleFilterRedirected}
            value="Redirected"
            icon={
              <img
                src={RedirectedIcon}
                height="20px"
                className={filter.redirected ? 'filter-active' : ''}
                style={{ marginLeft: '5px', marginRight: '5px' }}
                alt="redirected"
              />
            }
          />
        </CommandBar>
        <p>This is the combined list of your current source selection</p>
        <p className="app-para-light">
          Note that this list still contains all duplicates. Created profiles
          will not contain any duplicates.
        </p>
        {/* <h3>{title}</h3> */}
        <div className="content">
          <HostsFileEditor
            file={{
              lines: [
                ...(filter.allowed ? [] : sorted.allowed),
                ...(filter.redirected ? [] : sorted.redirected),
                ...(filter.blocked ? [] : sorted.blocked),
              ],
              path: 'block',
            }}
          />
        </div>
      </div>
    </NavPageContainer>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {
    profiles: state.app.profiles,
    settings: state.app.settings,
    systemHosts: state.app.systemHosts,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewPage);
