import * as React from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/Header';
import { State } from '../store/types';
import { Settings } from '../../shared/types';
import * as actions from '../store/actions';
import { NotImplemented } from '../components/NotImplemented';
import { saveConfig } from '../ipc/files';
import BrightnessIcon from '../../../assets/drawable/ic_brightness_medium_24dp.svg';
import SyncIcon from '../../../assets/drawable/ic_sync_24dp.svg';
import RootIcon from '../../../assets/drawable/ic_superuser_24dp.svg';
import VPNIcon from '../../../assets/drawable/ic_vpn_key_24dp.svg';
import IPv6Icon from '../../../assets/drawable/ic_ipv6_24dp.svg';
import BackupIcon from '../../../assets/drawable/ic_sd_storage_24dp.svg';
import DiagnosticsIcon from '../../../assets/drawable/outline_cloud_upload_24.svg';
import LoggingIcon from '../../../assets/drawable/ic_bug_report_24dp.svg';

import './SettingsPage.scss';
import { CheckBox } from '../components/Inputs';

type HProps = {
  children?: React.ReactNode;
};
const SettingsHeader: React.FC<HProps> = () => {
  return (
    <Header>
      <div className="page-title">Settings</div>
      <div style={{ width: '100%' }} />
    </Header>
  );
};

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
      saveConfig(s);
      setSettings(s);
    },
    [setSettings]
  );
  const toggleLogging = React.useCallback(
    () => setAndSaveSettings({ ...settings, logging: !settings.logging }),
    [setAndSaveSettings, settings]
  );
  const toggleDarkMode = React.useCallback(
    () => setAndSaveSettings({ ...settings, darkMode: !settings.darkMode }),
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
  return (
    <div className="page settings">
      <NotImplemented onDismiss={hideNotImplemented} isOpen={notImplemented} />
      <SettingsHeader />
      <div className="content">
        <div className="group">
          <div className="groupHeader">General</div>
          <button
            type="button"
            className="button element"
            onClick={toggleDarkMode}
          >
            <img src={BrightnessIcon} alt="brightness" />
            <div className="elementContent">Activate dark-mode</div>
            <CheckBox value={settings.darkMode} onChange={toggleDarkMode} />
          </button>
          <button
            type="button"
            className="button element"
            onClick={toggleAutoUpdates}
          >
            <img src={SyncIcon} alt="sync" />
            <div className="elementContent">Automatic updates</div>
            <CheckBox
              value={settings.autoUpdates}
              onChange={toggleAutoUpdates}
            />
          </button>
        </div>
        <div className="group">
          <div className="groupHeader">Block ADs</div>
          <button
            type="button"
            className={`button element ${
              settings.blockMode !== 'admin'
                ? 'elementDisabled'
                : 'elementEnabled'
            }`}
            onClick={setAdminBasedAdblock}
          >
            <img src={RootIcon} alt="root" />
            <div className="elementContent">Admin based AD-blocker</div>
          </button>
          <button
            type="button"
            className={`button element ${
              settings.blockMode === 'admin'
                ? 'elementDisabled'
                : 'elementEnabled'
            }`}
            onClick={setVPNBasedAdblock}
          >
            <img src={VPNIcon} alt="vpn" />
            <div className="elementContent">VPN based AD-blocker</div>
          </button>
          <button type="button" className="button element" onClick={toggleIpv4}>
            <img src={IPv6Icon} alt="ipv6" />
            <div className="elementContent">Activate IPv6</div>
            <CheckBox value={settings.ipv6} onChange={toggleIpv4} />
          </button>
          <button
            type="button"
            className="button element"
            onClick={startBackup}
          >
            <img src={BackupIcon} alt="backup" />
            <div className="elementContent">Backup/Recover your lists</div>
          </button>
        </div>
        <div className="group">
          <div className="groupHeader">Diagnoses</div>
          <button
            type="button"
            className="button element"
            onClick={toggleDiagnostics}
          >
            <img src={DiagnosticsIcon} alt="diagnostics" />
            <div className="elementContent">Send error reports</div>
            <CheckBox
              value={settings.diagnostics}
              onChange={toggleDiagnostics}
            />
          </button>
          <button
            type="button"
            className="button element"
            onClick={toggleLogging}
          >
            <img src={LoggingIcon} alt="logging" />
            <div className="elementContent">Activate extended logging</div>
            <CheckBox value={settings.logging} onChange={toggleLogging} />
          </button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setSettings: actions.setSettings,
};

const mapStateToProps = (state: State) => {
  return { settings: state.app.settings };
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
