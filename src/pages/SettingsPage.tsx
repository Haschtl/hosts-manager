import * as React from "react";
import { Header } from "../components/Header";
// import {Footer} from '../components/Footer';

import { connect } from "react-redux";
import { Settings, State } from "../store/types";
import * as actions from "../store/actions";
import { NotImplemented } from "../components/NotImplemented";
import { saveConfig } from "../files";
import BrightnessIcon from "../drawable/ic_brightness_medium_24dp.svg";
import SyncIcon from "../drawable/ic_sync_24dp.svg";
import RootIcon from "../drawable/ic_superuser_24dp.svg";
import VPNIcon from "../drawable/ic_vpn_key_24dp.svg";
import IPv6Icon from "../drawable/ic_ipv6_24dp.svg";
import BackupIcon from "../drawable/ic_sd_storage_24dp.svg";
import DiagnosticsIcon from "../drawable/outline_cloud_upload_24.svg";
import LoggingIcon from "../drawable/ic_bug_report_24dp.svg";

import "./SettingsPage.scss";
import { CheckBox } from "../components/Inputs";

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const SettingsPage: React.FC<Props> = ({ settings, setSettings }) => {
  let [notImplemented, setNotImplemented] = React.useState(false);
  let hideNotImplemented = () => {
    setNotImplemented(false);
  };
  let setAdminBasedAdblock = () => {
    setNotImplemented(true);
  };
  let setVPNBasedAdblock = () => {
    setNotImplemented(true);
  };
  let _setSettings = (settings: Settings) => {
    saveConfig(settings);
    setSettings(settings);
  };
  let toggleLogging = () =>
    _setSettings({ ...settings, logging: !settings.logging });
  let toggleDarkMode = () =>
    _setSettings({ ...settings, darkMode: !settings.darkMode });
  let toggleAutoUpdates = () =>
    _setSettings({ ...settings, autoUpdates: !settings.autoUpdates });
  let toggleIpv4 = () => _setSettings({ ...settings, ipv6: !settings.ipv6 });
  let toggleDiagnostics = () =>
    _setSettings({ ...settings, diagnostics: !settings.diagnostics });
  let startBackup = () => {
    setNotImplemented(true);
  };
  return (
    <div className="page settings">
      <NotImplemented onDismiss={hideNotImplemented} isOpen={notImplemented} />
      <SettingsHeader />
      <div className="content">
        <div className="group">
          <div className="groupHeader">General</div>
          <div className="button element" onClick={toggleDarkMode}>
            <img src={BrightnessIcon} />
            <div className="elementContent">Activate dark-mode</div>
            <CheckBox
              value={settings.darkMode}
              onChange={toggleDarkMode}
            />
          </div>
          <div className="button element" onClick={toggleAutoUpdates}>
            <img src={SyncIcon} />
            <div className="elementContent">Automatic updates</div>
            <CheckBox
              value={settings.autoUpdates}
              onChange={toggleAutoUpdates}
            />
          </div>
        </div>
        <div className="group">
          <div className="groupHeader">Block ADs</div>
          <div
            className={
              "button element " +
              (settings.blockMode !== "admin"
                ? "elementDisabled"
                : "elementEnabled")
            }
            onClick={setAdminBasedAdblock}
          >
            <img src={RootIcon} />
            <div className="elementContent">Admin based AD-blocker</div>
          </div>
          <div
            className={
              "button element " +
              (settings.blockMode === "admin"
                ? "elementDisabled"
                : "elementEnabled")
            }
            onClick={setVPNBasedAdblock}
          >
            <img src={VPNIcon} />
            <div className="elementContent">VPN based AD-blocker</div>
          </div>
          <div className="button element" onClick={toggleIpv4}>
            <img src={IPv6Icon} />
            <div className="elementContent">Activate IPv6</div>
            <CheckBox value={settings.ipv6} onChange={toggleIpv4} />
          </div>
          <div className="button element" onClick={startBackup}>
            <img src={BackupIcon} />
            <div className="elementContent">Backup/Recover your lists</div>
          </div>
        </div>
        <div className="group">
          <div className="groupHeader">Diagnoses</div>
          <div className="button element" onClick={toggleDiagnostics}>
            <img src={DiagnosticsIcon} />
            <div className="elementContent">Send error reports</div>
            <CheckBox
              value={settings.diagnostics}
              onChange={toggleDiagnostics}
            />
          </div>
          <div className="button element" onClick={toggleLogging}>
            <img src={LoggingIcon} />
            <div className="elementContent">Activate extended logging</div>
            <CheckBox value={settings.logging} onChange={toggleLogging} />
          </div>
        </div>
      </div>
    </div>
  );
};

type HProps = {
  children?: React.ReactNode;
};
let SettingsHeader: React.FC<HProps> = ({}) => {
  return (
    <Header>
      <div className="page-title">Settings</div>
      <div style={{width:"100%"}}></div>
    </Header>
  );
};
const mapDispatchToProps = {
  setSettings: actions.setSettings,
};

const mapStateToProps = (state: State) => {
  return { settings: state.app.settings };
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
