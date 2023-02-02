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

type HProps = {
  children?: React.ReactNode;
};
const ListHeader: React.FC<HProps> = ({ children }) => {
  return (
    <div>
      {children}
      <div className="buttonwrapper">
        <div className="button">
          <img src={SearchIcon} alt="search" />
        </div>
        <div className="button">
          <img src={BookMarkIcon} alt="favorites" />
        </div>
      </div>
    </div>
  );
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const ListViewPage: React.FC<Props> = ({ sourcesConfig, sources }) => {
  const sorted = sortHosts(annotateSources(sources, sourcesConfig));

  const Blocked = (props: any) => {
    return HostsFileEditor({
      ...props,
      file: {
        lines: sorted.blocked,
        path: 'block',
      },
    });
  };
  const Allowed = (props: any) => {
    return HostsFileEditor({
      ...props,
      file: {
        lines: sorted.allowed,
        path: 'allowed',
      },
    });
  };
  const Redirected = (props: any) => {
    return HostsFileEditor({
      ...props,
      file: {
        lines: sorted.redirected,
        path: 'redirected',
      },
    });
  };
  const navigate = useNavigate();
  const location = useLocation();
  const goToBlocked = React.useCallback(() => {
    navigate('/list/blocked');
  }, [navigate]);
  const goToAllowed = React.useCallback(() => {
    navigate('/list/allowed');
  }, [navigate]);
  const goToRedirected = React.useCallback(() => {
    navigate('/list/redirected');
  }, [navigate]);
  let title;
  if (location.pathname.includes('blocked')) {
    title = 'Blocked';
  } else if (location.pathname.includes('allowed')) {
    title = 'Allowed';
  } else {
    title = 'Redirected';
  }
  return (
    <NavPageContainer animateTransition>
      <div className="page list">
        <h1>Hosts</h1>
        <CommandBar>
          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={goToBlocked}
            value="Blocked"
            icon={
              <img
                src={BlockedIcon}
                height="20px"
                style={{ marginLeft: '5px', marginRight: '5px' }}
                alt="blocked"
              />
            }
          />

          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={goToAllowed}
            value="Allowed"
            icon={
              <img
                src={AllowedIcon}
                height="20px"
                style={{ marginLeft: '5px', marginRight: '5px' }}
                alt="blocked"
              />
            }
          />
          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={goToRedirected}
            value="Redirected"
            icon={
              <img
                src={RedirectedIcon}
                height="20px"
                style={{ marginLeft: '5px', marginRight: '5px' }}
                alt="redirected"
              />
            }
          />
        </CommandBar>
        <p>This is the current hosts file of your system</p>
        <ListHeader>{title}</ListHeader>
        <div className="content">
          <Routes key="listroot">
            <Route path="blocked" element={<Blocked />} />
            <Route path="allowed" element={<Allowed />} />
            <Route path="redirected" element={<Redirected />} />
          </Routes>
        </div>
      </div>
    </NavPageContainer>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { sourcesConfig: state.app.sourcesConfig, sources: state.app.sources };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewPage);
