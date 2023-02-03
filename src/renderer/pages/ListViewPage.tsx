/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { NavPageContainer, CommandBar } from 'react-windows-ui';

import { State } from '../store/types';
import { sortHosts } from '../store/selectors';
import HostsFileEditor from '../components/HostsFileEditor';
import SearchIcon from '../../../assets/drawable/baseline_search_24.svg';
import BookMarkIcon from '../../../assets/drawable/ic_collections_bookmark_24dp.svg';

import BlockedIcon from '../../../assets/drawable/baseline_block_24.svg';
import AllowedIcon from '../../../assets/drawable/baseline_check_24.svg';
import RedirectedIcon from '../../../assets/drawable/baseline_compare_arrows_24.svg';
import { annotateSources } from '../../shared/helper';
import './ListViewPage.scss';

// type HProps = {
//   children?: React.ReactNode;
// };
// const ListHeader: React.FC<HProps> = ({ children }) => {
//   return (
//     <div>
//       {children}
//       <div className="buttonwrapper">
//         <div className="button">
//           <img src={SearchIcon} alt="search" />
//         </div>
//         <div className="button">
//           <img src={BookMarkIcon} alt="favorites" />
//         </div>
//       </div>
//     </div>
//   );
// };

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

  // const Blocked = (props: any) => {
  //   return HostsFileEditor({
  //     ...props,
  //     file: {
  //       lines: sorted.blocked,
  //       path: 'block',
  //     },
  //   });
  // };
  // const Allowed = (props: any) => {
  //   return HostsFileEditor({
  //     ...props,
  //     file: {
  //       lines: sorted.allowed,
  //       path: 'allowed',
  //     },
  //   });
  // };
  // const Redirected = (props: any) => {
  //   return HostsFileEditor({
  //     ...props,
  //     file: {
  //       lines: sorted.redirected,
  //       path: 'redirected',
  //     },
  //   });
  // };
  const [filter, setFilter] = React.useState<{
    blocked: boolean;
    allowed: boolean;
    redirected: boolean;
  }>({
    blocked: false,
    allowed: false,
    redirected: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  // const goToBlocked = React.useCallback(() => {
  //   navigate('/list/blocked');
  // }, [navigate]);
  // const goToAllowed = React.useCallback(() => {
  //   navigate('/list/allowed');
  // }, [navigate]);
  // const goToRedirected = React.useCallback(() => {
  //   navigate('/list/redirected');
  // }, [navigate]);
  const toggleFilterBlocked = React.useCallback(() => {
    setFilter({ ...filter, blocked: !filter.blocked });
  }, [filter]);
  const toggleFilterRedirected = React.useCallback(() => {
    setFilter({ ...filter, redirected: !filter.redirected });
  }, [filter]);
  const toggleFilterAllowed = React.useCallback(() => {
    setFilter({ ...filter, allowed: !filter.allowed });
  }, [filter]);
  let title;
  if (location.pathname.includes('redirected')) {
    title = 'Redirected';
  } else if (location.pathname.includes('allowed')) {
    title = 'Allowed';
  } else {
    title = 'Blocked';
  }
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
          {/* <Routes key="listroot">
            <Route path="blocked" element={<Blocked />} />
            <Route path="allowed" element={<Allowed />} />
            <Route path="redirected" element={<Redirected />} />
            <Route path="" element={<Blocked />} />
          </Routes> */}
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
