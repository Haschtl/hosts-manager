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
import IPv6Icon from '../../../assets/icons/ipv6_24.svg';
import ListItem from '../components/ListItem';

import './SettingsPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const SettingsPage: React.FC<Props> = ({ settings, setSettings }) => {
  const [notImplemented, setNotImplemented] = React.useState(false);
  const hideNotImplemented = React.useCallback(() => {
    setNotImplemented(false);
  }, []);
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
  const changeBlockedHostOverwrite = React.useCallback(
    (e: string) => {
      if (e === 'undefined') {
        setAndSaveSettings({ ...settings, blockedHostOverwrite: undefined });
      } else {
        setAndSaveSettings({ ...settings, blockedHostOverwrite: e });
      }
    },
    [setAndSaveSettings, settings]
  );
  const toggleAutoUpdates = React.useCallback(
    () =>
      setAndSaveSettings({ ...settings, autoUpdates: !settings.autoUpdates }),
    [setAndSaveSettings, settings]
  );
  const toggleRemoveComments = React.useCallback(
    () =>
      setAndSaveSettings({
        ...settings,
        removeComments: !settings.removeComments,
      }),
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
    window.files.openUserFolder();
  }, []);
  const isSystemDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  let darkMode = 'system';
  if (settings.darkMode !== undefined) {
    darkMode = settings.darkMode ? 'dark' : 'light';
  }
  return (
    <NavPageContainer animateTransition>
      <NotImplemented isOpen={notImplemented} onDismiss={hideNotImplemented} />
      <div className="page settings">
        <h1>Settings</h1>
        <h3>General</h3>
        <ListItem
          icon="icons10-pencil"
          title="Select mode"
          subtitle="Change the visual appearence."
          ItemEndComponent={
            <Select
              defaultValue={darkMode} // Optional
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
                ] as unknown as string[]
              }
            />
          }
        />
        <ListItem
          // onClick={toggleAutoUpdates}
          icon="icons10-refresh"
          title="Automatic Updates"
          subtitle="Enable or disable automatic updates. (not available)"
          ItemEndComponent={
            <Switch
              labelOn="On"
              labelOff="Off"
              disabled
              onChange={toggleAutoUpdates}
              defaultChecked={settings.autoUpdates}
              labelPosition="start"
            />
          }
        />
        <h3>Block ADs</h3>
        <ListItem
          icon="icons10-undo"
          title="Overwrite blocked"
          subtitle="Overwrite the host for blocked domains. 0.0.0.0 is preferable over 127.0.0.1 (see https://github.com/StevenBlack/hosts). "
          ItemEndComponent={
            <Select
              defaultValue={
                settings.blockedHostOverwrite === undefined
                  ? 'undefined'
                  : settings.blockedHostOverwrite
              } // Optional
              // @ts-ignore
              onChange={changeBlockedHostOverwrite}
              data={
                [
                  { label: '0.0.0.0', value: '0.0.0.0' },
                  { label: '127.0.0.1', value: '127.0.0.1' },
                  {
                    label: `No overwrite`,
                    value: 'undefined',
                  },
                ] as unknown as string[]
              }
            />
          }
        />
        <ListItem
          onClick={toggleRemoveComments}
          icon="icons10-messages"
          title="Remove comments"
          subtitle="Remove comments from generated hosts files"
          ItemEndComponent={
            <Switch
              labelOn="On"
              labelOff="Off"
              onChange={toggleRemoveComments}
              defaultChecked={settings.removeComments}
              labelPosition="start"
            />
          }
        />
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
          icon="icons10-file-explorer"
          title="Backup/Recover"
          subtitle="Backup or recover your hosts sources"
          ItemEndComponent={<Button onClick={startBackup} value="Start" />}
        />
        <h3>Diagnostics</h3>
        <ListItem
          // onClick={toggleDiagnostics}
          icon="icons10-upload-2"
          title="Send error reports"
          subtitle="Share error reports. Submitted data is always anonymized."
          ItemEndComponent={
            <Switch
              labelOn="On"
              labelOff="Off"
              disabled
              onChange={toggleDiagnostics}
              defaultChecked={settings.diagnostics}
              labelPosition="start"
            />
          }
        />
        <ListItem
          // onClick={toggleLogging}
          icon="icons10-align-center"
          title="Extended logging"
          subtitle="Enable or disable extended logging. Costs a lot of CPU. Do not enable, if not needed."
          ItemEndComponent={
            <Switch
              labelOn="On"
              disabled
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
