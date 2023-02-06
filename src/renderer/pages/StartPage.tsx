/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable promise/always-return */
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  NavPageContainer,
  Button,
  LoaderBar,
  Dialog,
  InputText,
} from 'react-windows-ui';

import { State } from '../store/types';
import { NotImplemented } from '../components/NotImplemented';
import { sortHosts } from '../store/selectors';
import * as actions from '../store/actions';
import { annotateSources, hostsFile2sources } from '../../shared/helper';
import ProfileCard from '../components/ProfileCard';
import ListItem from '../components/ListItem';
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
  sources,
  sourcesConfig,
  settings,
  systemHosts,
  stateIsElevated,
  setHostsFile,
  profiles,
  setProfiles,
}) => {
  const [loading, setLoading] = useState<string>();
  const navigate = useNavigate();
  const [notImplemented, setNotImplemented] = useState(false);

  const onlineSources = sourcesConfig.sources.filter(
    (s) =>
      s.type === 'url' &&
      s.url !== undefined &&
      s.url !== '' &&
      s.location !== '' &&
      s.location !== undefined
  );
  const scs = onlineSources.filter((s) => s.enabled);
  const updateSources = (e: React.MouseEvent) => {
    if (scs.length === 0) {
      return;
    }
    e.stopPropagation();
    setLoading(`Downloading ${scs.length} sources`);

    window.taskbar.progress(2);
    scs.forEach(async (s, idx) => {
      const f = await window.files.downloadFile(s.url!, s.location);

      setLoading(`Downloaded ${s.label}...`);
      if (f) {
        setHostsFile(f);
      }
      if (idx === scs.length - 1) {
        setLoading(undefined);
        window.taskbar.progress(0);
      }
    });
    window.files.notify('Updating sources');
  };
  const openFolder = () => {
    window.files.openUserFolder();
  };

  const hideNotImplemented = useCallback(() => {
    setNotImplemented(false);
  }, []);

  const sorted = sortHosts(
    annotateSources(sources, sourcesConfig),
    settings.ipv6
  );
  const [profileName, setProfileName] = useState('');
  const [profileInputVisible, setProfileInputVisible] = useState(false);
  const hideProfileInput = useCallback(() => {
    setProfileInputVisible(false);
    setProfileName('');
  }, []);
  const showProfileInput = useCallback((e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    setProfileInputVisible(true);
    setProfileName('');
  }, []);
  const onProfileNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileName(e.target.value);
    },
    []
  );
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
  const createProfile = useCallback(() => {
    const name = profileName;
    hideProfileInput();
    setLoading('Creating profile...');
    window.taskbar.progress(2);
    window.files
      .saveHostsFile(
        sources,
        sourcesConfig,
        `./profiles/${name}.hosts`,
        settings.ipv6,
        settings.blockedHostOverwrite,
        settings.removeComments
      )
      .then(async () => {
        const profileFiles = await window.files.loadProfiles();

        if (profileFiles) {
          setProfiles(profileFiles);
        }
        setLoading(undefined);
        window.taskbar.progress(0);
      })
      .catch((e) => console.log(e));
  }, [
    settings.ipv6,
    settings.blockedHostOverwrite,
    settings.removeComments,
    sources,
    profileName,
    sourcesConfig,
    setProfiles,
    hideProfileInput,
  ]);
  const systemSorted = sortHosts(hostsFile2sources(systemHosts), true);
  return (
    <NavPageContainer animateTransition>
      <Dialog
        isVisible={profileInputVisible}
        onBackdropPress={hideProfileInput}
      >
        {/* @ts-ignore */}
        <Dialog.Header>
          <h3>Create profile</h3>
          {/* @ts-ignore */}
        </Dialog.Header>
        {/* @ts-ignore */}
        <Dialog.Body style={{ padding: 20 }}>
          <p>Specify a profile name.</p>
          <InputText
            value={profileName}
            onChange={onProfileNameChange}
            label="Profilename"
            placeholder="My profile"
          />
          {/* @ts-ignore */}
        </Dialog.Body>
        {/* @ts-ignore */}
        <Dialog.Footer>
          <Button value="Abort" type="danger" onClick={hideProfileInput} />
          <Button value="Create" type="success" onClick={createProfile} />
          {/* @ts-ignore */}
        </Dialog.Footer>
      </Dialog>
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
          <ListItem
            onClick={() => navigate('/sources')}
            ItemEndComponent={
              <>
                <Button
                  icon={<i className="icons10-refresh" />}
                  style={{ margin: 1, height: '40px', width: '40px' }}
                  onClick={updateSources}
                  value=""
                  disabled={scs.length === 0}
                  tooltip="Fetch online sources"
                />
                <Button
                  value="Create profile"
                  style={{ height: '40px' }}
                  onClick={showProfileInput}
                />
              </>
            }
            icon="icons10-bookmark"
            title="Current selection"
            subtitle={`${
              sourcesConfig.sources.filter((sc) => sc.enabled).length
            }/${sourcesConfig.sources.length} sources (${
              onlineSources.filter((sc) => sc.enabled).length
            }/${onlineSources.length} online)`}
          >
            <div className="profile-statistics">
              <ListItem
                title={String(sorted.blocked.length)}
                subtitle="Blocked"
                icon="icons10-cancel color-danger"
              />
              <ListItem
                title={String(sorted.allowed.length)}
                subtitle="Allowed"
                icon="icons10-checkmark color-success"
              />
              <ListItem
                title={String(sorted.redirected.length)}
                subtitle="Redirected"
                imgSrc={RedirectedIcon}
              />
            </div>
            <div className="update-bar">
              <div
                className={`updates-available ${
                  loading !== undefined ? ' visible' : ''
                }`}
              >
                {loading}
              </div>
              <LoaderBar isLoading={loading !== undefined} />
            </div>
          </ListItem>
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
  setHostsFile: actions.setHostsFile,
  setProfiles: actions.setProfiles,
};

const mapStateToProps = (state: State) => {
  return {
    active: state.app.active,
    sources: state.app.sources,
    settings: state.app.settings,
    sourcesConfig: state.app.sourcesConfig,
    stateIsElevated: state.app.isElevated,
    systemHosts: state.app.systemHosts,
    profiles: state.app.profiles,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
