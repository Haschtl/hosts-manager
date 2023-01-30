import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../components/Header';
import { State } from '../store/types';
import { sortHosts } from '../store/selectors';
import HostsFileEditor from '../components/HostsFileEditor';
import SearchIcon from '../../../assets/drawable/baseline_search_24.svg';
import BookMarkIcon from '../../../assets/drawable/ic_collections_bookmark_24dp.svg';

import BlockedIcon from '../../../assets/drawable/baseline_block_24.svg';
import AllowedIcon from '../../../assets/drawable/baseline_check_24.svg';
import RedirectedIcon from '../../../assets/drawable/baseline_compare_arrows_24.svg';
import './ListViewPage.scss';

type HProps = {
  children?: React.ReactNode;
};
const ListHeader: React.FC<HProps> = ({ children }) => {
  return (
    <Header>
      {children}
      <div className="buttonwrapper">
        <div className="button">
          <img src={SearchIcon} alt="search" />
        </div>
        <div className="button">
          <img src={BookMarkIcon} alt="favorites" />
        </div>
      </div>
    </Header>
  );
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const ListViewPage: React.FC<Props> = ({ hosts }) => {
  const sorted = sortHosts(hosts);

  const Blocked = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.blocked,
        applyRedirects: false,
        format: 'block',
        label: '',
        type: 'file',
      },
    });
  };
  const Allowed = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.allowed,
        applyRedirects: false,
        format: 'block',
        label: '',
        type: 'file',
      },
    });
  };
  const Redirected = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.redirected,
        applyRedirects: false,
        format: 'block',
        label: '',
        type: 'file',
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
    <div className="page list">
      <ListHeader>{title}</ListHeader>
      <div className="content">
        <Routes key="listroot">
          <Route path="blocked" element={<Blocked />} />
          <Route path="allowed" element={<Allowed />} />
          <Route path="redirected" element={<Redirected />} />
        </Routes>
      </div>
      <div className="tab-bar">
        <button
          type="button"
          className={`tab-button ${
            location.pathname.includes('blocked') ? ' active' : ''
          }`}
          onClick={goToBlocked}
        >
          <img src={BlockedIcon} alt="blocked" />
          Blocked
        </button>
        <button
          type="button"
          className={`tab-button ${
            location.pathname.includes('allowed') ? ' active' : ''
          }`}
          onClick={goToAllowed}
        >
          <img src={AllowedIcon} alt="allowed" />
          Allowed
        </button>
        <button
          type="button"
          className={`tab-button ${
            location.pathname.includes('redirected') ? ' active' : ''
          }`}
          onClick={goToRedirected}
        >
          <img src={RedirectedIcon} alt="redirected" />
          Redirected
        </button>
      </div>
    </div>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { hosts: state.app.hosts };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewPage);
