/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { NavPageContainer, CommandBar } from 'react-windows-ui';

import { State } from '../store/types';
import { sortHosts } from '../store/selectors';
import HostsFileEditor from '../components/HostsFileEditor';

import BlockedIcon from '../../../assets/drawable/baseline_block_24.svg';
import AllowedIcon from '../../../assets/drawable/baseline_check_24.svg';
import RedirectedIcon from '../../../assets/drawable/baseline_compare_arrows_24.svg';
import { annotateSources } from '../../shared/helper';
import './ListViewPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const ListViewPage: React.FC<Props> = ({
  sourcesConfig,
  settings,
  sources,
}) => {
  const sorted = sortHosts(
    annotateSources(sources, sourcesConfig),
    settings.ipv6
  );

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
        <h1>Hosts</h1>
        <CommandBar>
          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={toggleFilterBlocked}
            value="Blocked"
            icon={
              <img
                src={BlockedIcon}
                height="20px"
                style={{ marginLeft: '5px', marginRight: '5px' }}
                className={filter.blocked ? 'filter-active' : ''}
                alt="blocked"
              />
            }
          />

          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={toggleFilterAllowed}
            value="Allowed"
            icon={
              <img
                src={AllowedIcon}
                className={filter.allowed ? 'filter-active' : ''}
                height="20px"
                style={{ marginLeft: '5px', marginRight: '5px' }}
                alt="blocked"
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
                className={filter.redirected ? 'filter-active' : ''}
                height="20px"
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
    sourcesConfig: state.app.sourcesConfig,
    sources: state.app.sources,
    settings: state.app.settings,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewPage);
