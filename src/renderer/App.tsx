/* eslint-disable promise/always-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppTheme, LoaderBusy, NavBar, NavBarLink } from 'react-windows-ui';

import './App.scss';
import './styles/styles.scss';
import { loadState, VERSION } from './store/reducer';
import * as actions from './store/actions';
import { State } from './store/types';
import HomeIcon from '../../assets/icons8/icons8-home-page-48.png';
import SourcesIcon from '../../assets/icons8/icons8-checklist-48.png';
import HelpIcon from '../../assets/icons8/icons8-ask-question-48.png';
import DnsIcon from '../../assets/icons8/icons8-dns-48.png';
import SponsorIcon from '../../assets/icons8/icons8-favorite-48.png';
import FirewallIcon from '../../assets/icons8/icons8-firewall-48.png';
import SettingsIcon from '../../assets/icons8/icons8-settings-48.png';
import DNSServerIcon from '../../assets/icons8/icons8-data-transfer-48.png';

import StartPage from './pages/StartPage';
import VersionPage from './pages/VersionPage';
import ListViewPage from './pages/ListViewPage';
import SupportPage from './pages/SupportPage';
import SourcesPage from './pages/SourcesPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import DNSPage from './pages/DNSPage';
import SourceEditor from './pages/SourceEditor';
import FirewallPage from './pages/FirewallPage';
import ProfilePage from './pages/ProfilePage';
import Search from './components/Search';
import DNSServerPage from './pages/DNSServerPage';

const AppRoutes = () => (
  <Routes key="root">
    <Route path="home" element={<StartPage />} />
    <Route path="index.html" element={<StartPage />} />
    <Route path="start" element={<StartPage />} />
    <Route path="version" element={<VersionPage />} />
    <Route path="list/*" element={<ListViewPage />} />
    <Route path="profile/*" element={<ProfilePage />} />
    <Route path="system" element={<ProfilePage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="sources" element={<SourcesPage />} />
    <Route path="editsource" element={<SourceEditor />} />
    <Route path="support" element={<SupportPage />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="dns/*" element={<DNSPage />} />
    <Route path="dnsserver/*" element={<DNSServerPage />} />
    <Route path="firewall/*" element={<FirewallPage />} />
    <Route path="*" element={<StartPage />} />
  </Routes>
);

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const App: React.FC<Props> = ({
  setState,
  darkMode = undefined,
  setHostsFile,
  setSourceConfig,
  setFirewallRules,
  setFirewallProfiles,
  setFirewallSettings,
}) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const navigateVersion = () => {
    navigate('/version');
  };
  useEffect(() => {
    window.taskbar.progress(2);
    loadState().then((state) => {
      setState(state);
      setLoading(false);
      window.taskbar.progress(0);
      return undefined;
    });
    window.firewall.rules.showSmart().then((rules) => setFirewallRules(rules));
    window.firewall.profiles
      .get()
      .then((profiles) => setFirewallProfiles(profiles));
    window.firewall.settings.get().then((s) => {
      console.log(s);
      setFirewallSettings(s);
    });
  }, []);
  const [highlight, setHighlight] = useState(false);
  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlight(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlight(false);
  }, []);
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlight(true);
  }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlight(false);
    let id = '';
    [...e.dataTransfer.files].forEach(async (f) => {
      [id] = f.name.split('.');
      const hostsPath = `./sources/${id}.hosts`;
      setSourceConfig({
        applyRedirects: false,
        comment: 'Dropped',
        enabled: true,
        format: 'block',
        label: id,
        location: hostsPath,
        type: 'file',
        id: -1,
      });
      await window.files.importFile(f.path, hostsPath);
      window.files.loadHostsFile(hostsPath).then((hf) => {
        if (hf) {
          setHostsFile(hf);
        }
      });
    });
    if (id) {
      navigate(`/source/${id}`);
    }
  }, []);
  let darkTheme: 'system' | 'dark' | 'light' | undefined = 'system';
  if (darkTheme !== undefined) {
    darkTheme = darkMode ? 'dark' : 'light';
  }
  return (
    <div
      className={`root ${darkTheme}-theme`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={`highlight ${highlight ? 'visible' : 'hidden'}`}>
        Drop hosts file
      </div>
      <AppTheme
        // eslint-disable-next-line no-nested-ternary
        scheme={darkTheme}
        color="#ae2538"
        colorDarkMode="#ae2538"
        onColorChange={() => {}}
        onSchemeChange={() => {}}
      />
      <div id="extra-drag-area">
        <Search />
      </div>
      <LoaderBusy isLoading={loading} display="overlay" />
      <NavBar
        collapsed
        title="hosts_manager"
        shadowOnScroll
        titleBarMobile={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: 'calc(100% - 60px)',
            }}
          >
            <span className="app-navbar-name">hosts_manager</span>
          </div>
        }
      >
        <h1>Hosts</h1>
        <div className="app-hr" />
        <NavBarLink to="/index.html" exact text="Home" imgSrc={HomeIcon} />
        <NavBarLink to="/sources" exact text="Sources" imgSrc={SourcesIcon} />
        {/* <NavBarLink to="/list" exact text="Hosts" imgSrc={HostsIcon} /> */}
        <h1>Tools</h1>
        <div className="app-hr" />
        <NavBarLink
          to="/firewall"
          exact
          text="Firewall"
          imgSrc={FirewallIcon}
        />
        <NavBarLink
          to="/dnsserver"
          exact
          text="DNS Server"
          imgSrc={DNSServerIcon}
        />
        <NavBarLink to="/dns" exact text="DNS Queries" imgSrc={DnsIcon} />

        <h1>Various</h1>

        <div className="app-hr" />
        <NavBarLink to="/help" exact text="Help" imgSrc={HelpIcon} />
        <NavBarLink to="/support" exact text="Support" imgSrc={SponsorIcon} />
        <div style={{ marginTop: 'auto' }} />
        <NavBarLink
          to="/settings"
          exact
          text="Settings"
          imgSrc={SettingsIcon}
        />
        <button
          type="button"
          className="flat abs_version"
          onClick={navigateVersion}
        >
          {VERSION}
        </button>
      </NavBar>
      <AppRoutes />
    </div>
  );
};

const mapDispatchToProps = {
  setState: actions.setState,
  setElevated: actions.setElevated,
  setSearchText: actions.setSearchText,
  setSourceConfig: actions.setSourceConfig,
  setHostsFile: actions.setHostsFile,
  setFirewallRules: actions.setFirewallRules,
  setFirewallProfiles: actions.setFirewallProfiles,
  setFirewallSettings: actions.setFirewallSettings,
};

const mapStateToProps = (state: State) => {
  return {
    darkMode: state.app.settings.darkMode,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
