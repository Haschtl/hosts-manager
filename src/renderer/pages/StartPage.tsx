/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable promise/always-return */
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { LoaderBusy, NavPageContainer } from 'react-windows-ui';

import { State } from '../store/types';
import { NotImplemented } from '../components/NotImplemented';
import { sortHosts } from '../store/selectors';
import * as actions from '../store/actions';
import { hostsFile2sources } from '../../shared/helper';
import ProfileCard from '../components/ProfileCard';
import AppIcon from '../../../assets/icon.png';
import RedirectedIcon from '../../../assets/icons/redirect_24.svg';
import './StartPage.scss';

interface HBProps {
  title?: string;
  subtitle?: string;
  subsubtitle?: string;
  icon?: string;
  imgSrc?: string;
  onClick?(): void;
  className?: string;
}
export const HeaderButton: React.FC<HBProps> = ({
  title,
  subtitle,
  subsubtitle,
  icon,
  imgSrc,
  onClick,
  className = '',
}) => {
  return (
    <div className={`buttonwrapper ${className}`}>
      <button type="button" className="headerbutton" onClick={onClick}>
        <div className="content">
          {title !== undefined && <div className="title">{title}</div>}
          {subtitle !== undefined && <div className="subtitle">{subtitle}</div>}
          {subsubtitle !== undefined && (
            <div className="subsubtitle">{subsubtitle}</div>
          )}
        </div>
      </button>
      {icon !== undefined ? (
        <div className="buttonicon">
          <i className={icon} />
        </div>
      ) : null}
      {imgSrc !== undefined ? (
        <div className="buttonicon">
          <img src={imgSrc} alt="alt" />
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

  const navigateSystem = useCallback(() => navigate('/system'), [navigate]);
  return (
    <>
      <div className={`start-header ${active ? 'active' : 'inactive'}`}>
        <div className="iconwrapper">
          <img src={AppIcon} alt="app-icon" />
        </div>
        <div className="textWrapper">
          <div className="title">hosts_manager</div>
          <div className="subtitle">Open Source ad blocker</div>
        </div>
        <div className="abs_buttonbar">
          <HeaderButton
            title={String(blocked)}
            subtitle="Blocked"
            icon="icons10-cancel color-danger"
            onClick={navigateSystem}
          />
          <HeaderButton
            title={String(allowed)}
            subtitle="Allowed"
            icon="icons10-checkmark color-success"
            onClick={navigateSystem}
          />
          <HeaderButton
            title={String(redirected)}
            subtitle="Redirected"
            imgSrc={RedirectedIcon}
            onClick={navigateSystem}
          />
        </div>
      </div>
    </>
  );
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const StartPage: React.FC<Props> = ({
  active,
  systemHosts,
  stateIsElevated,
  profiles,
  setProfiles,
}) => {
  const [notImplemented, setNotImplemented] = useState(false);
  const [loading, setLoading] = useState<string>();

  const openFolder = () => {
    window.files.openUserFolder();
  };

  const hideNotImplemented = useCallback(() => {
    setNotImplemented(false);
  }, []);

  const createSystemBackup = useCallback(() => {
    window.taskbar.progress(2);
    setLoading('Backing up system...');
    window.files
      .backupHostsFile()
      .then(async () => {
        const profileFiles = await window.files.loadProfiles();
        if (profileFiles) {
          setProfiles(profileFiles);
        }
        setLoading(undefined);

        window.taskbar.progress(0);
      })
      .catch((e) => console.log(e));
  }, [setProfiles]);
  const systemSorted = sortHosts(hostsFile2sources(systemHosts), true);
  return (
    <NavPageContainer animateTransition>
      <NotImplemented onDismiss={hideNotImplemented} isOpen={notImplemented} />
      <div className="page full start">
        {!stateIsElevated && (
          <button
            type="button"
            className="button adminWarning"
            onClick={openFolder}
          >
            <div className="adminWarningText">
              hosts_manager is not running as Admin. Can not write hosts file
              directly
            </div>
          </button>
        )}
        <StartHeader
          active={active}
          blocked={systemSorted.blocked.length}
          redirected={systemSorted.redirected.length}
          allowed={systemSorted.allowed.length}
        />
        <div className="page-content">
          <LoaderBusy isLoading={loading !== undefined} title={loading} />
          <div className="profiles-header">
            <h1>Profiles</h1>
            <p onClick={createSystemBackup} style={{ cursor: 'pointer' }}>
              Create backup of system&apos;s hosts
            </p>
          </div>
          {profiles.length === 0 ? (
            <p>
              Create a profile from the selected sources. Then you can apply it
              to your system&apos;s hosts file.
            </p>
          ) : (
            <>
              {profiles.map((p) => (
                <ProfileCard profile={p} key={p.path} />
              ))}
            </>
          )}
        </div>
        <br />
        <br />
      </div>
    </NavPageContainer>
  );
};
const mapDispatchToProps = {
  setElevated: actions.setElevated,
  setProfiles: actions.setProfiles,
};

const mapStateToProps = (state: State) => {
  return {
    active: state.app.active,
    stateIsElevated: state.app.isElevated,
    systemHosts: state.app.systemHosts,
    profiles: state.app.profiles,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
