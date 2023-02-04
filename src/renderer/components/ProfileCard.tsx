/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as React from 'react';
import { sortHosts } from 'renderer/store/selectors';
import { Alert, Button, LoaderBusy } from 'react-windows-ui';
import { useNavigate } from 'react-router';
import { connect } from 'react-redux';
import { hostsFile2sources } from '../../shared/helper';
import { HostsFile } from '../../shared/types';
import ListItem from './ListItem';
import RedirectedIcon from '../../../assets/icons/redirect_24.svg';
import { timeSince } from './SourceListElement';
import * as actions from '../store/actions';
import './ProfileCard.scss';

export function path2profilename(p: string) {
  return p.replace('./profiles/', '').replace('.hosts', '');
}

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  profile: HostsFile;
  imgSrc?: string;
  icon?: string;
  enabled?: boolean;
  color?: 'success' | 'danger';
  children?: React.ReactNode;
};
const ProfileCard: React.FC<Props> = ({
  profile,
  enabled = true,
  imgSrc,
  icon,
  color,
  children,
  setProfiles,
  setSystemHosts,
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
  const hideAlert = React.useCallback(() => {
    setAlertVisible(false);
  }, []);
  const sorted = sortHosts(hostsFile2sources(profile), true);
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
        } else {
          setAlertVisible(true);
        }
        setLoading(false);
        window.taskbar.progress(0);
        return undefined;
      });
    },
    [profile.path, setSystemHosts]
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
  let iconComponent: React.ReactNode;
  if (imgSrc !== undefined) {
    iconComponent = <img className="settings-icon" src={imgSrc} alt="icon" />;
  } else if (icon !== undefined) {
    iconComponent = <i className={`settings-icon ${icon} color-${color}`} />;
  } else {
    iconComponent = <div className="settings-icon" />;
  }
  return (
    <div
      className={`app-section-container-fg item-container profile-container ${
        onClick !== undefined ? 'clickable' : ''
      } ${enabled ? 'enabled' : 'disabled'}`}
      onClick={onClick}
    >
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
      <LoaderBusy display="overlay" isLoading={loading} />
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
                <ListItem
                  title={String(sorted.allowed.length)}
                  subtitle="Allowed"
                  className="profile-item"
                  icon="icons10-checkmark color-success"
                />
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
              icon={<i className="icons10-cross color-danger" />}
              style={{ margin: 1, height: '40px', width: '40px' }}
              onClick={removeProfile}
              value=""
              tooltip="Delete this profile"
            />
            <Button
              icon={<i className="icons10-checkmark color-success" />}
              style={{ margin: 1, height: '40px', width: '40px' }}
              onClick={applyProfile}
              value=""
              tooltip="Apply this profile"
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
const mapDispatchToProps = {
  setProfiles: actions.setProfiles,
  setSystemHosts: actions.setSystemHosts,
};

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard);
