import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import Footer from '../components/Footer';
import { State } from '../store/types';
import { NotImplemented } from '../components/NotImplemented';
import { sortHosts } from '../store/selectors';
import {
  saveHostsFile,
  openUserFolder,
  notify,
  isElevated,
} from '../ipc/files';
import * as actions from '../store/actions';
import BookMarkIcon from '../../../assets/drawable/ic_collections_bookmark_24dp.svg';
import AddIcon from '../../../assets/drawable/ic_get_app_24dp.svg';
import SyncIcon from '../../../assets/drawable/ic_sync_24dp.svg';
import AppIcon from '../../../assets/drawable/icon_foreground.png';
import HelpIcon from '../../../assets/drawable/ic_help_24dp.svg';
import DnsIcon from '../../../assets/drawable/ic_outline_rule_24.svg';
import FavoriteIcon from '../../../assets/drawable/baseline_favorite_24.svg';
import BlockedIcon from '../../../assets/drawable/baseline_block_24.svg';
import AllowedIcon from '../../../assets/drawable/baseline_check_24.svg';
import RedirectedIcon from '../../../assets/drawable/baseline_compare_arrows_24.svg';
import './StartPage.scss';

interface HBProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  onClick?(): void;
}
export const HeaderButton: React.FC<HBProps> = ({
  title,
  subtitle,
  icon,
  onClick,
}) => {
  return (
    <div className="buttonwrapper">
      <button type="button" className="headerbutton" onClick={onClick}>
        <div className="content">
          {title !== undefined && <div className="title">{title}</div>}
          {subtitle !== undefined && <div className="subtitle">{subtitle}</div>}
        </div>
      </button>
      {icon !== undefined ? (
        <div className="buttonicon">
          <img src={icon} className="icon" alt="icon" />
        </div>
      ) : null}
    </div>
  );
};

type HProps = {
  active: boolean;
  allowed: number;
  blocked: number;
  redirected: number;
};
export const StartHeader: React.FC<HProps> = ({
  active,
  allowed,
  blocked,
  redirected,
}) => {
  const navigate = useNavigate();
  const navigateVersion = () => {
    navigate('/version');
  };

  const navigateBlocked = useCallback(
    () => navigate('/list/blocked'),
    [navigate]
  );
  const navigateAllowed = useCallback(
    () => navigate('/list/allowed'),
    [navigate]
  );
  const navigateRedirected = useCallback(
    () => navigate('/list/redirected'),
    [navigate]
  );
  return (
    <>
      <div className={`start-header ${active ? 'active' : 'inactive'}`}>
        <div className="iconwrapper">
          <img src={AppIcon} alt="app-icon" />
        </div>
        <div className="textWrapper">
          <div className="title">AdAway</div>
          <div className="subtitle">Open Source ad blocker</div>
        </div>
        <button type="button" className="abs_version" onClick={navigateVersion}>
          1.0.0
        </button>
        <div className="abs_buttonbar">
          <HeaderButton
            title={String(blocked)}
            subtitle="Blocked"
            icon={BlockedIcon}
            onClick={navigateBlocked}
          />
          <HeaderButton
            title={String(allowed)}
            subtitle="Allowed"
            icon={AllowedIcon}
            onClick={navigateAllowed}
          />
          <HeaderButton
            title={String(redirected)}
            subtitle="Redirected"
            icon={RedirectedIcon}
            onClick={navigateRedirected}
          />
        </div>
      </div>
    </>
  );
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const StartPage: React.FC<Props> = ({
  active,
  hosts,
  stateIsElevated,
  setElevated,
}) => {
  isElevated()
    .then((v) => {
      return setElevated(v);
    })
    .catch((r) => console.log(r));
  const [updatesAvailable, setUpdatesAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notImplemented, setNotImplemented] = useState(false);

  const updateSources = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotImplemented(true);
    setLoading(true);
    setUpdatesAvailable(false);
    setTimeout(() => {
      setLoading(false);
      setUpdatesAvailable(true);
    }, 2000);
    notify('Updating sources');
  };
  const upgradeSources = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotImplemented(true);
    setUpdatesAvailable(false);
  };
  const openFolder = () => {
    openUserFolder();
  };
  // const checkHostFile = () => {
  //   // checkBackendService().then((v) => console.log(v));
  // };

  const hideNotImplemented = useCallback(() => {
    setNotImplemented(false);
  }, []);
  const navigateDNS = useCallback(() => navigate('/dns'), [navigate]);
  const navigateHelp = useCallback(() => navigate('/help'), [navigate]);
  const navigateSupport = useCallback(() => navigate('/support'), [navigate]);

  const sorted = sortHosts(hosts);
  return (
    <div className="page start">
      <NotImplemented onDismiss={hideNotImplemented} isOpen={notImplemented} />
      {!stateIsElevated && (
        <button
          type="button"
          className="button adminWarning"
          onClick={openFolder}
        >
          <div className="adminWarningText">
            AdAway not running as Admin. Can not write hosts file directly
          </div>
        </button>
      )}
      <StartHeader
        active={active}
        blocked={sorted.blocked.length}
        redirected={sorted.redirected.length}
        allowed={sorted.allowed.length}
      />
      <div className="content">
        <button
          type="button"
          className="button mainbutton"
          onClick={() => navigate('/sources')}
        >
          <div className="buttonbar">
            <div className="mainleft">
              <img src={BookMarkIcon} alt="favorites" />
            </div>

            <div className="maincenter">
              <div>{`${hosts.categories.length} aktuelle Quellen`}</div>
              <div>0 veraltete Quellen</div>
            </div>
            <div className="mainright">
              <button
                type="button"
                className="button"
                style={{ margin: 5 }}
                onClick={updateSources}
              >
                <img src={SyncIcon} alt="sync" />
              </button>
              <button
                type="button"
                className="button"
                style={{ margin: 5 }}
                onClick={upgradeSources}
              >
                <img src={AddIcon} alt="add" />
              </button>
            </div>
          </div>
          <div className="update-bar">
            <div
              className={`updates-available ${
                updatesAvailable ? ' visible' : ''
              }`}
            >
              Updates available
            </div>
            <div className={`progress-bar ${loading ? 'visible' : ''}`}>
              <div className="border-overlay" />
              <div className="gradient-overlay" />
              <div className="bar" />
            </div>
          </div>
        </button>
        <div className="buttonbar">
          <HeaderButton
            subtitle="Show DNS-Request-Protocol"
            icon={DnsIcon}
            onClick={navigateDNS}
          />
          <HeaderButton
            subtitle="Show Tips and Help"
            icon={HelpIcon}
            onClick={navigateHelp}
          />
          <HeaderButton
            subtitle="Support"
            icon={FavoriteIcon}
            onClick={navigateSupport}
          />
        </div>
        <button
          type="button"
          className="button simple"
          onClick={() => {
            saveHostsFile(hosts, false);
          }}
        >
          Export hosts
        </button>
      </div>
      <Footer />
    </div>
  );
};
const mapDispatchToProps = {
  setElevated: actions.setElevated,
};

const mapStateToProps = (state: State) => {
  return {
    active: state.app.active,
    hosts: state.app.hosts,
    stateIsElevated: state.app.isElevated,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
