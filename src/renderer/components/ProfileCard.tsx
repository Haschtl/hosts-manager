/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as React from 'react';
import { sortHosts } from 'renderer/store/selectors';
import { Alert, Button, Dialog, InputText, LoaderBusy } from 'react-windows-ui';
import { useNavigate } from 'react-router';
import { connect } from 'react-redux';
import { hostsFile2sources, path2profilename } from '../../shared/helper';
import { HostsFile } from '../../shared/types';
import ListItem from './ListItem';
import RedirectedIcon from '../../../assets/icons/redirect_24.svg';
import { timeSince } from './SourceListElement';
import * as actions from '../store/actions';
import './ProfileCard.scss';
import { State } from '../store/types';

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  profile: HostsFile;
  imgSrc?: string;
  icon?: string;
  color?: 'success' | 'danger';
  children?: React.ReactNode;
};
const ProfileCard: React.FC<Props> = ({
  profile,
  imgSrc,
  icon,
  color,
  children,
  setProfiles,
  setSystemHosts,
  setActiveProfile,
  sourcesConfig,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const onClick = React.useCallback(() => {
    navigate(`/profile/${path2profilename(profile.path)}`, {
      state: {
        idx: -1,
      },
    });
  }, [navigate, profile.path]);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alert2Visible, setAlert2Visible] = React.useState(false);

  const showAlert2 = React.useCallback(() => {
    setAlert2Visible(true);
  }, []);
  const hideAlert = React.useCallback(() => {
    setAlertVisible(false);
    setAlert2Visible(false);
  }, []);
  const sorted = sortHosts(hostsFile2sources(profile), true);
  const tooLong = sorted.blocked.length + sorted.redirected.length > 100000;

  const applyProfile = React.useCallback(
    (e: Event) => {
      e.stopPropagation();
      e.preventDefault();

      setLoading(true);

      window.taskbar.progress(2);
      return window.files.applyProfile(profile.path).then(async () => {
        const f = await window.files.loadHostsFile(true);
        if (f) {
          setSystemHosts(f);
          setActiveProfile(path2profilename(profile.path));
        } else {
          setAlertVisible(true);
        }
        setLoading(false);
        window.taskbar.progress(0);
        return undefined;
      });
    },
    [profile.path, setSystemHosts, setActiveProfile]
  );
  const [applyAlertVisible, setApplyAlertVisible] = React.useState(false);
  const showApplyAlert = React.useCallback(
    (e: Event) => {
      if (tooLong) {
        setApplyAlertVisible(true);
      } else {
        applyProfile(e);
      }
    },
    [applyProfile, tooLong]
  );
  const hideApplyAlert = React.useCallback(() => {
    setApplyAlertVisible(false);
  }, []);
  const [copyAlertVisible, setCopyAlertVisible] = React.useState(false);
  const showCopyAlert = React.useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setCopyAlertVisible(true);
  }, []);
  const hideCopyAlert = React.useCallback(() => {
    setCopyAlertVisible(false);
  }, []);
  const [profileName, setProfileName] = React.useState('');

  const onProfileNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileName(e.target.value);
    },
    []
  );
  const removeProfile = React.useCallback(
    (e: Event) => {
      e.stopPropagation();
      e.preventDefault();

      window.taskbar.progress(2);
      setLoading(true);
      window.files
        .removeProfile(profile.path)
        .then((p) => {
          if (p) {
            setLoading(false);
            window.taskbar.progress(0);
            setProfiles(p);
          }
          return undefined;
        })
        .catch((ev) => console.log(ev));
    },
    [profile.path, setProfiles]
  );
  const copyProfile = React.useCallback(() => {
    window.taskbar.progress(2);
    setLoading(true);
    window.files
      .copyHostsFile(profile.path, `./profiles/${profileName}.hosts`)
      .then(async () => {
        const profileFiles = await window.files.loadProfiles();
        if (profileFiles) {
          setProfiles(profileFiles);
        }
        setLoading(false);

        return window.taskbar.progress(0);
      })
      .finally(() => setCopyAlertVisible(false))
      .catch((e) => console.log(e));
  }, [profileName, profile.path, setProfiles]);
  let iconComponent: React.ReactNode;
  if (tooLong) {
    iconComponent = <i className="icons10-exclamation-mark color-danger" />;
  } else {
    iconComponent = <div className="settings-icon" />;
  }
  return (
    <>
      <Dialog isVisible={copyAlertVisible} onBackdropPress={hideCopyAlert}>
        {/* @ts-ignore */}
        <Dialog.Header>
          <h3>Copy profile</h3>
          {/* @ts-ignore */}
        </Dialog.Header>
        {/* @ts-ignore */}
        <Dialog.Body style={{ padding: 20 }}>
          <p>Specify a new profile name.</p>
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
          <Button value="Abort" type="danger" onClick={hideCopyAlert} />
          <Button value="Create" type="success" onClick={copyProfile} />
          {/* @ts-ignore */}
        </Dialog.Footer>
      </Dialog>
      <Alert
        isVisible={alertVisible}
        // @ts-ignore
        style={{ padding: 20 }}
        onBackdropPress={hideAlert}
        title="Admin privileges required"
        message="You need admin privileges to modify the system's hosts file"
      >
        {/* @ts-ignore */}
        <Alert.Footer>
          <Button
            style={{ flex: 'auto' }}
            value="Confirm"
            type="primary"
            onClick={hideAlert}
          />
          {/* @ts-ignore */}
        </Alert.Footer>
      </Alert>
      <Alert
        isVisible={applyAlertVisible}
        // @ts-ignore
        style={{ padding: 20 }}
        onBackdropPress={hideApplyAlert}
        title="Profile too long"
        message="This hosts profile contains too many entries, which can cause trouble on Windows. Do you wish to continue anyway?"
      >
        {/* @ts-ignore */}
        <Alert.Footer>
          <Button
            style={{ flex: 'auto' }}
            value="Abort"
            type="success"
            onClick={hideApplyAlert}
          />
          <Button
            style={{ flex: 'auto' }}
            value="Ignore"
            type="danger"
            onClick={applyProfile}
          />
          {/* @ts-ignore */}
        </Alert.Footer>
      </Alert>

      <Alert
        isVisible={alert2Visible}
        // @ts-ignore
        style={{ padding: 20 }}
        onBackdropPress={hideAlert}
        title="Delete profile"
        message="Do you really want to remove this profile?"
      >
        {/* @ts-ignore */}
        <Alert.Footer>
          <Button
            style={{ flex: 'auto' }}
            value="Abort"
            // type="danger"
            onClick={hideAlert}
          />
          <Button
            style={{ flex: 'auto' }}
            value="Confirm"
            type="danger"
            onClick={removeProfile}
          />
          {/* @ts-ignore */}
        </Alert.Footer>
      </Alert>
      <LoaderBusy display="overlay" isLoading={loading} />
      <div
        className={`app-section-container-fg item-container profile-container ${
          onClick !== undefined ? 'clickable' : ''
        } ${
          sourcesConfig.active === path2profilename(profile.path)
            ? 'enabled'
            : 'disabled'
        }`}
        onClick={onClick}
      >
        <div className="item-outer">
          <div className="item-wrapper">
            <div className="item-content">
              {iconComponent}
              <div className="item-content-inner">
                <div className="item-title">
                  {path2profilename(profile.path)}
                  <div className="profile-changed-label">
                    {profile.mtime
                      ? `(Changed ${timeSince(profile.mtime)} ago)`
                      : ''}
                  </div>
                </div>
                <div className="item-subtitle app-m-0 app-para-light profile-inner">
                  <ListItem
                    title={String(sorted.blocked.length)}
                    subtitle="Blocked"
                    icon="icons10-cancel color-danger"
                    className="profile-item"
                  />
                  {/* <ListItem
                    title={String(sorted.allowed.length)}
                    subtitle="Allowed"
                    className="profile-item"
                    icon="icons10-checkmark color-success"
                  /> */}
                  <ListItem
                    title={String(sorted.redirected.length)}
                    className="profile-item"
                    subtitle="Redirected"
                    imgSrc={RedirectedIcon}
                  />
                </div>
              </div>
            </div>
            <div className="item-end" onClick={(e) => e.stopPropagation()}>
              <Button
                icon={<i className="icons10-copy" />}
                style={{ margin: 1, height: '40px', width: '40px' }}
                onClick={showCopyAlert}
                value=""
                tooltip="Copy this profile"
              />
              <Button
                icon={<i className="icons10-cross color-danger" />}
                style={{ margin: 1, height: '40px', width: '40px' }}
                onClick={showAlert2}
                value=""
                tooltip="Delete this profile"
              />
              <Button
                icon={<i className="icons10-checkmark color-success" />}
                style={{ margin: 1, height: '40px', width: '40px' }}
                onClick={showApplyAlert}
                value=""
                tooltip="Apply this profile"
              />
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};
const mapDispatchToProps = {
  setProfiles: actions.setProfiles,
  setSystemHosts: actions.setSystemHosts,
  setActiveProfile: actions.setActiveProfile,
};

const mapStateToProps = (state: State) => {
  return { sourcesConfig: state.app.sourcesConfig };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard);
