/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { NavPageContainer, Switch, Select, Button } from 'react-windows-ui';

import { State } from '../store/types';
import { Settings } from '../../shared/types';
import * as actions from '../store/actions';
import { NotImplemented } from '../components/NotImplemented';
import BrightnessIcon from '../../../assets/drawable/ic_brightness_medium_24dp.svg';
import SyncIcon from '../../../assets/drawable/ic_sync_24dp.svg';
import IPv6Icon from '../../../assets/drawable/ic_ipv6_24dp.svg';
import BackupIcon from '../../../assets/drawable/ic_sd_storage_24dp.svg';
import DiagnosticsIcon from '../../../assets/drawable/outline_cloud_upload_24.svg';
import LoggingIcon from '../../../assets/drawable/ic_bug_report_24dp.svg';
import ListItem from '../components/ListItem';

import './SettingsPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const SettingsPage: React.FC<Props> = ({ settings, setSettings }) => {
  const [notImplemented, setNotImplemented] = React.useState(false);
  const hideNotImplemented = React.useCallback(() => {
    setNotImplemented(false);
  }, []);
  const setAdminBasedAdblock = () => {
    setNotImplemented(true);
  };
  const setVPNBasedAdblock = () => {
    setNotImplemented(true);
  };
  const setAndSaveSettings = React.useCallback(
    (s: Settings) => {
      window.files.saveConfig(s);
      setSettings(s);
    },
    [setSettings]
  );
  const toggleLogging = React.useCallback(
    () => setAndSaveSettings({ ...settings, logging: !settings.logging }),
    [setAndSaveSettings, settings]
  );
  const changeDarkMode = React.useCallback(
    (e: string) => {
      if (e === 'dark') {
        setAndSaveSettings({ ...settings, darkMode: true });
      } else if (e === 'light') {
        setAndSaveSettings({ ...settings, darkMode: false });
      } else {
        setAndSaveSettings({ ...settings, darkMode: undefined });
      }
    },
    [setAndSaveSettings, settings]
  );
  const toggleAutoUpdates = React.useCallback(
    () =>
      setAndSaveSettings({ ...settings, autoUpdates: !settings.autoUpdates }),
    [setAndSaveSettings, settings]
  );
  const toggleIpv4 = React.useCallback(
    () => setAndSaveSettings({ ...settings, ipv6: !settings.ipv6 }),
    [setAndSaveSettings, settings]
  );
  const toggleDiagnostics = React.useCallback(
    () =>
      setAndSaveSettings({ ...settings, diagnostics: !settings.diagnostics }),
    [setAndSaveSettings, settings]
  );
  const startBackup = React.useCallback(() => {
    setNotImplemented(true);
  }, []);
  const isSystemDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <NavPageContainer animateTransition>
      <NotImplemented isOpen={notImplemented} onDismiss={hideNotImplemented} />
      <div className="page settings">
        <h1>Settings</h1>
        <h3>General</h3>
        <ListItem
          imgSrc={BrightnessIcon}
          title="Select mode"
          subtitle="Change the visual appearence."
          ItemEndComponent={
            <Select
              defaultValue={
                settings.darkMode === undefined
                  ? 'system'
                  : settings.darkMode
                  ? 'dark'
                  : 'light'
              } // Optional
              // @ts-ignore
              onChange={changeDarkMode}
              data={
                [
                  { label: 'Dark', value: 'dark' },
                  { label: 'Light', value: 'light' },
                  {
                    label: `System default (${
                      isSystemDark ? 'Dark' : 'Light'
                    })`,
                    value: 'system',
                  },
                ] as any
              }
            />
          }
        />
        <ListItem
          onClick={toggleAutoUpdates}
          imgSrc={SyncIcon}
          title="Automatic Updates"
          subtitle="Enable or disable automatic updates. (not available)"
          ItemEndComponent={
            <Switch
              labelOn="On"
              labelOff="Off"
              onChange={toggleAutoUpdates}
              defaultChecked={settings.autoUpdates}
              labelPosition="start"
            />
          }
        />
        <h3>Block ADs</h3>
        <ListItem
          onClick={toggleIpv4}
          imgSrc={IPv6Icon}
          title="IPv6"
          subtitle="Enable or disable blocking of IPv6 adresses"
          ItemEndComponent={
            <Switch
              labelOn="On"
              labelOff="Off"
              onChange={toggleIpv4}
              defaultChecked={settings.ipv6}
              labelPosition="start"
            />
          }
        />
        <ListItem
          onClick={startBackup}
          imgSrc={BackupIcon}
          title="Backup/Recover"
          subtitle="Backup or recover your hosts sources"
          ItemEndComponent={<Button onClick={startBackup} value="Start" />}
        />
        <h3>Diagnostics</h3>
        <ListItem
          onClick={toggleDiagnostics}
          imgSrc={DiagnosticsIcon}
          title="Send error reports"
          subtitle="Share error reports. Submitted data is always anonymized."
          ItemEndComponent={
            <Switch
              labelOn="On"
              labelOff="Off"
              onChange={toggleDiagnostics}
              defaultChecked={settings.diagnostics}
              labelPosition="start"
            />
          }
        />
        <ListItem
          onClick={toggleLogging}
          imgSrc={LoggingIcon}
          title="Extended logging"
          subtitle="Enable or disable extended logging. Costs a lot of CPU. Do not enable, if not needed."
          ItemEndComponent={
            <Switch
              labelOn="On"
              labelOff="Off"
              onChange={toggleLogging}
              defaultChecked={settings.logging}
              labelPosition="start"
            />
          }
        />
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {
  setSettings: actions.setSettings,
};

const mapStateToProps = (state: State) => {
  return { settings: state.app.settings };
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
