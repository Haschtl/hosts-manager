import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { NavPageContainer, Button, LoaderBar } from 'react-windows-ui';

import { State } from '../store/types';
import { NotImplemented } from '../components/NotImplemented';
import { sortHosts } from '../store/selectors';
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
import { annotateSources } from '../../shared/helper';

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
  sources,
  sourcesConfig,
  stateIsElevated,
  setElevated,
}) => {
  // window.files
  //   .isElevated()
  //   .then((v) => {
  //     console.log(`Has admin rights: ${v}`);
  //     return setElevated(v);
  //   })
  //   .catch((r) => console.log(r));
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
    window.files.notify('Updating sources');
  };
  const upgradeSources = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotImplemented(true);
    setUpdatesAvailable(false);
  };
  const openFolder = () => {
    window.files.openUserFolder();
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

  const sorted = sortHosts(annotateSources(sources, sourcesConfig));
  return (
    <NavPageContainer animateTransition>
      <div className="page full start">
        <NotImplemented
          onDismiss={hideNotImplemented}
          isOpen={notImplemented}
        />
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
        <div className="page-content">
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
                <div>{`${sourcesConfig.sources.length} aktuelle Quellen`}</div>
                <div>0 veraltete Quellen</div>
              </div>
              <div className="mainright">
                <Button
                  icon={<img src={SyncIcon} height="20px" alt="sync" />}
                  style={{ margin: 1, height: '40px', width: '40px' }}
                  onClick={updateSources}
                  value=""
                  tooltip="Fetch online sources"
                />
                <Button
                  icon={<img src={AddIcon} height="20px" alt="update" />}
                  style={{ margin: 1, height: '40px', width: '40px' }}
                  onClick={upgradeSources}
                  value=""
                  tooltip="Download updated sources"
                />
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
              <LoaderBar isLoading={loading} />
            </div>
          </button>
          {/* <div className="buttonbar">
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
          </div> */}
          <Button
            onClick={() => {
              window.files.saveHostsFile(sources, sourcesConfig, false);
            }}
            value="Export hosts"
          />
          <Button onClick={() => {}} value="Reload system hosts" />
          <Button onClick={() => {}} value="Write system hosts" />
          <Button onClick={() => {}} value="Toggle AdAway" />
        </div>
        {/* <Footer /> */}
      </div>
    </NavPageContainer>
  );
};
const mapDispatchToProps = {
  setElevated: actions.setElevated,
};

const mapStateToProps = (state: State) => {
  return {
    active: state.app.active,
    sources: state.app.sources,
    sourcesConfig: state.app.sourcesConfig,
    stateIsElevated: state.app.isElevated,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
