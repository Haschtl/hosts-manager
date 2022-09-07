import React from "react";
import StartPage from "./pages/StartPage";
import VersionPage from "./pages/VersionPage";
import ListViewPage from "./pages/ListViewPage";
import SupportPage from "./pages/SupportPage";
import SourcesPage from "./pages/SourcesPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import DNSPage from "./pages/DNSPage";
import SourceEditor from "./pages/SourceEditor";
import { motion } from "framer-motion";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

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
    type: "tween",
    ease: "linear",
    duration: 0.5,
  }; 

const _Routes = () => (
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
      <Route path="/" element={<StartPage />} />
    </Route>
  </Routes>
);
export default _Routes;
