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
import ListItem from '../components/ListItem';
import './StartPage.scss';
import { annotateSources, hostsFile2sources } from '../../shared/helper';
import { HostsFile, Sources } from '../../shared/types';
import ProfileCard from '../components/ProfileCard';

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

  const navigateSystem = useCallback(() => navigate('/system'), [navigate]);
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
            onClick={navigateSystem}
          />
          <HeaderButton
            title={String(allowed)}
            subtitle="Allowed"
            icon={AllowedIcon}
            onClick={navigateSystem}
          />
          <HeaderButton
            title={String(redirected)}
            subtitle="Redirected"
            icon={RedirectedIcon}
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
  // const profiles: HostsFile[] = [systemHosts];
  // window.files
  //   .isElevated()
  //   .then((v) => {
  //     console.log(`Has admin rights: ${v}`);
  //     return setElevated(v);
  //   })
  //   .catch((r) => console.log(r));
  const [updatesAvailable, setUpdatesAvailable] = useState(false);
  const [loading, setLoading] = useState<string>();
  const navigate = useNavigate();
  const [notImplemented, setNotImplemented] = useState(false);

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
  const onlineSources = sourcesConfig.sources.filter(
    (s) =>
      s.type === 'url' &&
      s.url !== undefined &&
      s.url !== '' &&
      s.location !== '' &&
      s.location !== undefined
  );
  const updateSources = (e: React.MouseEvent) => {
    e.stopPropagation();
    const scs = onlineSources.filter((s) => s.enabled);
    // setNotImplemented(true);
    setLoading(`Downloading ${scs.length} sources`);
    // setUpdatesAvailable(false);
    // setTimeout(() => {
    //   setLoading(false);
    //   setUpdatesAvailable(true);
    // }, 2000);

    scs.map(async (s, idx) => {
      const f = await window.files.downloadFile(s.url!, s.location);
      setLoading(`Downloaded ${s.label}...`);
      if (f) {
        setHostsFile(f);
      }
      if (idx === scs.length - 1) {
        setLoading(undefined);
      }
    });
    // Promise.all(promises).then(() => setLoading(undefined));
    window.files.notify('Updating sources');
  };
  // const upgradeSources = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setNotImplemented(true);
  //   setUpdatesAvailable(false);
  // };
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
  const onProfileNameChange = useCallback((e: any) => {
    setProfileName(e.target.value);
  }, []);
  const createSystemBackup = useCallback(() => {
    setLoading('Backing up system...');
    const id = `hosts_${new Date(Date.now())
      .toUTCString()
      .replaceAll(' ', '_')
      .replaceAll(',', '_')
      .replaceAll(':', '_')}`;
    window.files
      .backupHostsFile(`./profiles/${id}.hosts`)
      .then((hf) => {
        window.files
          .loadProfiles()
          .then((p) => {
            if (p) {
              setProfiles(p);
            }
            setLoading(undefined);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }, [setProfiles]);
  const createProfile = useCallback(() => {
    const name = profileName;
    hideProfileInput();
    setLoading('Creating profile...');
    window.files
      .saveHostsFile(
        sources,
        sourcesConfig,
        `./profiles/${name}.hosts`,
        settings.ipv6,
        settings.blockedHostOverwrite,
        settings.removeComments
      )
      .then(() => {
        window.files
          .loadProfiles()
          .then((p) => {
            if (p) {
              setProfiles(p);
            }
            setLoading(undefined);
          })
          .catch((e) => console.log(e));
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
          blocked={systemSorted.blocked.length}
          redirected={systemSorted.redirected.length}
          allowed={systemSorted.allowed.length}
        />
        <div className="page-content">
          <ListItem
            onClick={() => navigate('/sources')}
            ItemEndComponent={
              <Button
                icon={<img src={SyncIcon} height="20px" alt="sync" />}
                style={{ margin: 1, height: '40px', width: '40px' }}
                onClick={updateSources}
                value=""
                tooltip="Fetch online sources"
              />
            }
            imgSrc={BookMarkIcon}
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
                imgSrc={BlockedIcon}
                onClick={navigateBlocked}
              />
              <ListItem
                title={String(sorted.allowed.length)}
                subtitle="Allowed"
                imgSrc={AllowedIcon}
                onClick={navigateAllowed}
              />
              <ListItem
                title={String(sorted.redirected.length)}
                subtitle="Redirected"
                imgSrc={RedirectedIcon}
                onClick={navigateRedirected}
              />
            </div>
            <div className="create-profile-wrapper">
              <Button value="Create profile" onClick={showProfileInput} />
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
          {profiles.map((p) => (
            <ProfileCard profile={p} key={p.path} />
          ))}
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
