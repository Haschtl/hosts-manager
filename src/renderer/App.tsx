import React, { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';

import './App.scss';
import './styles/styles.scss';
import { loadState } from './store/reducer';
import * as actions from './store/actions';
import { State } from './store/types';

import StartPage from './pages/StartPage';
import VersionPage from './pages/VersionPage';
import ListViewPage from './pages/ListViewPage';
import SupportPage from './pages/SupportPage';
import SourcesPage from './pages/SourcesPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import DNSPage from './pages/DNSPage';
import SourceEditor from './pages/SourceEditor';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'linear',
  duration: 0.5,
};
const AnimationLayout = () => {
  const { pathname } = useLocation();
  return (
    <>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Outlet />
      </motion.div>
    </>
  );
};

const AppRoutes = () => (
  <Routes key="root">
    <Route element={<AnimationLayout />}>
      <Route path="home" element={<StartPage />} />
      <Route path="start" element={<StartPage />} />
      <Route path="version" element={<VersionPage />} />
      <Route path="list/*" element={<ListViewPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="sources" element={<SourcesPage />} />
      <Route path="editsource" element={<SourceEditor />} />
      <Route path="support" element={<SupportPage />} />
      <Route path="help" element={<HelpPage />} />
      <Route path="dns" element={<DNSPage />} />
      <Route element={<StartPage />} />
    </Route>
  </Routes>
);
// export default _Routes;

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const App: React.FC<Props> = ({ setState, darkMode = true }) => {
  useEffect(() => {
    loadState()
      .then((state) => {
        setState(state);
        return undefined;
      })
      .catch((r) => {
        console.log(r);
      });
  }, [setState]);
  return (
    <div className={darkMode ? 'root dark-mode' : 'root light-mode'}>
      <AppRoutes />
    </div>
  );
};

const mapDispatchToProps = {
  setState: actions.setState,
  setElevated: actions.setElevated,
};
// export default App;
const mapStateToProps = (state: State) => {
  return { darkMode: state.app.settings.darkMode };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
