/* eslint-disable promise/always-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Routes,
  Route,
  // Outlet,
  // useLocation,
  useNavigate,
} from 'react-router-dom';
import { connect } from 'react-redux';
// import { motion } from 'framer-motion';
import {
  AppTheme,
  LoaderBusy,
  NavBar,
  NavBarLink,
  // NavBarSubMenu,
  // NavBarThemeSwitch,
  // NavBarSearchBox,
  // NavBarSearchSuggestion,
  // NavPageContainer,
} from 'react-windows-ui';

import './App.scss';
import './styles/styles.scss';
import { loadState } from './store/reducer';
import * as actions from './store/actions';
import { State } from './store/types';
// import DnsIcon from '../../assets/drawable/ic_outline_rule_24.svg';
import HomeIcon from '../../assets/icons8/icons8-home-page-48.png';
import SourcesIcon from '../../assets/icons8/icons8-checklist-48.png';
import HelpIcon from '../../assets/icons8/icons8-ask-question-48.png';
import DnsIcon from '../../assets/icons8/icons8-dns-48.png';
import SponsorIcon from '../../assets/icons8/icons8-favorite-48.png';
import FirewallIcon from '../../assets/icons8/icons8-firewall-48.png';
import HostsIcon from '../../assets/icons8/icons8-database-48.png';
import SettingsIcon from '../../assets/icons8/icons8-settings-48.png';

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

// const pageVariants = {
//   initial: {
//     opacity: 0,
//   },
//   in: {
//     opacity: 1,
//   },
//   out: {
//     opacity: 0,
//   },
// };

// const pageTransition = {
//   type: 'tween',
//   ease: 'linear',
//   duration: 0.5,
// };
// const AnimationLayout = () => {
//   const { pathname } = useLocation();
//   return (
//     <>
//       <motion.div
//         key={pathname}
//         initial="initial"
//         animate="in"
//         variants={pageVariants}
//         transition={pageTransition}
//       >
//         <Outlet />
//       </motion.div>
//     </>
//   );
// };
const AppRoutes = () => (
  <Routes key="root">
    {/* <Route element={<AnimationLayout />}> */}
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
    {/* <Route path="dns" element={<DNSPage />} /> */}
    <Route path="dns/*" element={<DNSPage />} />
    <Route path="firewall/*" element={<FirewallPage />} />
    <Route element={<StartPage />} />
    {/* </Route> */}
  </Routes>
);
// export default _Routes;

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const App: React.FC<Props> = ({
  setState,
  darkMode = undefined,
  setHostsFile,
  setSourceConfig,
}) => {
  // if (darkMode === undefined) {
  //   darkMode = await window.darkMode.toggle();
  // }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const navigateVersion = () => {
    navigate('/version');
  };
  useEffect(() => {
    loadState().then((state) => {
      setState(state);
      setLoading(false);
      return undefined;
    });
    // .catch((r) => {
    //   console.log(r);
    // });
  }, []);
  const [highlight, setHighlight] = useState(false);
  const closeWindow = useCallback(() => window.files.closeWindow(), []);
  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer);
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
    [...e.dataTransfer.files].forEach((f) => {
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
      window.files.importFile(f.path, hostsPath).then(() => {
        window.files.loadHostsFile(hostsPath).then((hf) => {
          if (hf) {
            setHostsFile(hf);
          }
        });
      });
      // setHostsFile({ path: hostsPath, lines: [] });
    });
    console.log(e.dataTransfer.files);
    if (id) {
      navigate(`/source/${id}`);
    }
  }, []);
  return (
    <div
      className={`root ${
        // eslint-disable-next-line no-nested-ternary
        darkMode === undefined ? '' : darkMode ? 'dark-theme' : 'light-theme'
      }`}
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
        scheme={darkMode === undefined ? 'system' : darkMode ? 'dark' : 'light'}
        color="#86352c"
        colorDarkMode="#86352c"
        onColorChange={() => {}}
        onSchemeChange={() => {}}
      />
      <div id="extra-drag-area">
        <Search />
      </div>
      {/* <button type="button" id="close-button" onClick={closeWindow}>
        <div />
      </button> */}
      <LoaderBusy isLoading={loading} display="overlay" />
      <NavBar
        collapsed
        title="AdAway"
        shadowOnScroll
        titleBarMobile={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: 'calc(100% - 60px)',
            }}
          >
            <span className="app-navbar-name">AdAway</span>
            {/* <span className="app-navbar-name">Subtitle</span> */}
          </div>
        }
      >
        {/* <NavBarSearchSuggestion
          placeholder="Search..."
          tooltip="Search on page"

          data={
            [
              {
                label: 'home',
                link: '/',
                icon: <i className="icons10-home" />,
              },
              { label: 'Page 1', link: '/page1' },
              { label: 'Page 2', link: '/page2' },
            ] as any
          }
        /> */}
        {/* <NavBarThemeSwitch /> */}

        <h1>Hosts</h1>
        <div className="app-hr" />
        <NavBarLink
          to="/index.html"
          exact
          text="Home"
          imgSrc={HomeIcon}
          // icon={<i className="icons10-home" />}
          // icon={<i className="icons10-grid-2"></i>}
        />
        <NavBarLink
          to="/sources"
          exact
          text="Sources"
          imgSrc={SourcesIcon}
          // icon={<i className="icons10-tasks" />}
          // icon={<i className="icons10-grid-2"></i>}
        />
        <NavBarLink
          to="/list"
          exact
          text="Hosts"
          imgSrc={HostsIcon}

          // icon={<i className="icons10-align-left" />}
          // icon={<i className="icons10-grid-2"></i>}
        />
        <h1>Tools</h1>
        <div className="app-hr" />

        <NavBarLink
          to="/firewall"
          exact
          text="Firewall"
          imgSrc={FirewallIcon}
          // icon={<i className="icons10-align-left" />}
          // icon={<i className="icons10-grid-2"></i>}
        />
        {/* <NavBarSubMenu title="Hosts">
          <NavBarLink
            to="/deny"
            exact
            text="Blocked"
            icon={<i className="icons10-align-left" />}
            // icon={<i className="icons10-grid-2"></i>}
          />
          <NavBarLink
            to="/allow"
            exact
            text="Allowed"
            icon={<i className="icons10-align-left" />}
            // icon={<i className="icons10-grid-2"></i>}
          />
          <NavBarLink
            to="/redirect"
            exact
            text="Redirected"
            icon={<i className="icons10-align-left" />}
            // icon={<i className="icons10-grid-2"></i>}
          />
        </NavBarSubMenu> */}
        <NavBarLink to="/dns" exact text="DNS Queries" imgSrc={DnsIcon} />

        <h1>Various</h1>

        <div className="app-hr" />
        <NavBarLink
          to="/help"
          exact
          text="Help"
          imgSrc={HelpIcon}
          // icon={<i className="icons10-question-mark" />}
        />
        {/* <NavBarLink to="list/*"/>} /> */}
        {/* <NavBarLink
            to="/sources"
            exact
            text="Home"
            icon={<i className="icons10-grid-2" />}
          /> */}
        {/* <NavBarLink
            to="/editsource"
            exact
            text="Home"
            icon={<i className="icons10-grid-2" />}
          /> */}

        <NavBarLink
          to="/support"
          exact
          text="Support"
          imgSrc={SponsorIcon}
          // icon={<i className="icons10-heart" />}
        />
        <div style={{ marginTop: 'auto' }} />
        <NavBarLink
          to="/settings"
          exact
          text="Settings"
          imgSrc={SettingsIcon}
          // icon={<i className="icons10-settings" />}
          // style={{
          //   marginTop: 'auto',
          // }}
        />
        {/* <NavBarLink
          to="/version"
          exact
          text="1.0.0"
          icon={<i className="icons10-grid-2" />}
        /> */}
        <button
          type="button"
          className="flat abs_version"
          onClick={navigateVersion}
        >
          1.0.0
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
};
// export default App;
const mapStateToProps = (state: State) => {
  return {
    darkMode: state.app.settings.darkMode,
    // searchText: state.app.searchText,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
