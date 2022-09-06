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
import { Routes, Route } from "react-router-dom";

const _Routes = () => (
  <Routes key="root">
    <Route path="/home">
      <StartPage />
    </Route>
    <Route path="start">
      <StartPage />
    </Route>
    <Route path="version">
      <VersionPage />
    </Route>
    <Route path="list">
      <ListViewPage />
    </Route>
    <Route path="settings">
      <SettingsPage />
    </Route>
    <Route path="sources">
      <SourcesPage />
    </Route>
    <Route path="editsource">
      <SourceEditor />
    </Route>
    <Route path="support">
      <SupportPage />
    </Route>
    <Route path="help">
      <HelpPage />
    </Route>
    <Route path="dns">
      <DNSPage />
    </Route>
  </Routes>
);
export default _Routes;
