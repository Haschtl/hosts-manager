import React, { useState } from "react";
import Footer from "../components/Footer";
import { connect } from "react-redux";
// import { shell } from "electron";
// import path from 'node:path';
import { State } from "../store/types";
// import SvgUri from 'react-native-svg-uri';
import { NotImplemented } from "../components/NotImplemented";
import { sortHosts } from "../hosts_manager";
import { saveHostsFile, openUserFolder,notify,isElevated } from "../files";
import * as actions from "../store/actions";
import { useNavigate } from "react-router";
// import isElevated from "../isElevated";
// import {IsDarkMode} from '../styles/styles';
import BookMarkIcon from "../drawable/ic_collections_bookmark_24dp.svg";
import AddIcon from "../drawable/ic_get_app_24dp.svg";
import SyncIcon from "../drawable/ic_sync_24dp.svg";
import AppIcon from "../drawable/icon_foreground.png";
import HelpIcon from "../drawable/ic_help_24dp.svg";
import DnsIcon from "../drawable/ic_outline_rule_24.svg";
import FavoriteIcon from "../drawable/baseline_favorite_24.svg";
import BlockedIcon from "../drawable/baseline_block_24.svg";
import AllowedIcon from "../drawable/baseline_check_24.svg";
import RedirectedIcon from "../drawable/baseline_compare_arrows_24.svg";
import "./StartPage.scss";
// const shell = window.require("electron").shell
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const StartPage: React.FC<Props> = ({ active, hosts, stateIsElevated,setElevated }) => {
  isElevated().then((v) => setElevated(v));
  let [updatesAvailable, setUpdatesAvailable] = useState(false);
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  let [notImplemented, setNotImplemented] = useState(false);
  let hideNotImplemented = () => {
    setNotImplemented(false);
  };

  let updateSources = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotImplemented(true);
    setLoading(true);
    setUpdatesAvailable(false);
    setTimeout(() => {
      setLoading(false);
      setUpdatesAvailable(true);
    }, 2000);
    notify("Updating sources")
  };
  let upgradeSources = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotImplemented(true);
    setUpdatesAvailable(false);
  };
  let openFolder = () => {
    openUserFolder();
  };
  let checkHostFile = () => {
    // checkBackendService().then((v) => console.log(v));
  };

  let sorted = sortHosts(hosts);
  return (
    <div className="page start">
      <NotImplemented onDismiss={hideNotImplemented} isOpen={notImplemented} />
      {!stateIsElevated && (
        <div className="button adminWarning" onClick={openFolder}>
          <div className="adminWarningText">
            AdAway not running as Admin. Can not write hosts file directly
          </div>
        </div>
      )}
      <StartHeader
        active={active}
        blocked={sorted.blocked.length}
        redirected={sorted.redirected.length}
        allowed={sorted.allowed.length}
      />
      <div className="content">
        <div className="button mainbutton" onClick={() => navigate("/sources")}>
          <div className="buttonbar">
            <div className="mainleft">
              <img src={BookMarkIcon} />
            </div>

            <div className="maincenter">
              <div>{hosts.categories.length + " aktuelle Quellen"}</div>
              <div>{"0 veraltete Quellen"}</div>
            </div>
            <div className="mainright">
              <div
                className="button"
                style={{ margin: 5 }}
                onClick={updateSources}
              >
                <img src={SyncIcon} />
              </div>
              <div
                className="button"
                style={{ margin: 5 }}
                onClick={upgradeSources}
              >
                <img src={AddIcon} />
              </div>
            </div>
          </div>
          <div className="update-bar">
            <div
              className={
                "updates-available" + (updatesAvailable ? " visible" : "")
              }
            >
              Updates available
            </div>
            <div className={"progress-bar" + (loading ? " visible" : "")}>
              <div className="border-overlay"></div>
              <div className="gradient-overlay"></div>
              <div className="bar"></div>
            </div>
          </div>
        </div>
        <div className="buttonbar">
          <HeaderButton
            subtitle="Show DNS-Request-Protocol"
            icon={DnsIcon}
            onClick={() => navigate("/dns")}
          />
          <HeaderButton
            subtitle="Show Tips and Help"
            icon={HelpIcon}
            onClick={() => navigate("/help")}
          />
          <HeaderButton
            subtitle="Support"
            icon={FavoriteIcon}
            onClick={() => navigate("/support")}
          />
        </div>
        <div
          className="button simple"
          onClick={() => {
            saveHostsFile(hosts);
          }}
        >
          Export hosts
        </div>
      </div>
      <Footer />
    </div>
  );
};
const mapDispatchToProps = {
  setElevated: actions.setElevated
};

const mapStateToProps = (state: State) => {
  return {
    active: state.app.active,
    hosts: state.app.hosts,
    stateIsElevated: state.app.isElevated,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);

type HProps = {
  active: boolean;
  allowed: number;
  blocked: number;
  redirected: number;
};
export const StartHeader: React.FC<HProps> = ({
  active,
  allowed,
  blocked,
  redirected,
}) => {
  let navigate = useNavigate();
  const goToVersion = () => {
    navigate("/version");
  };
  return (
    <>
      <div className={"start-header " + (active ? "active" : "inactive")}>
        <div className="iconwrapper">
          <img src={AppIcon} />
        </div>
        <div className="textWrapper">
          <div className="title">AdAway</div>
          <div className="subtitle">Open Source ad blocker</div>
        </div>
        <div className="abs_version" onClick={goToVersion}>
          {"1.0.0"}
        </div>
        <div className="abs_buttonbar">
          <HeaderButton
            title={blocked + ""}
            subtitle="Blocked"
            icon={BlockedIcon}
            onClick={() => navigate("/list/blocked")}
          />
          <HeaderButton
            title={allowed + ""}
            subtitle="Allowed"
            icon={AllowedIcon}
            onClick={() => navigate("/list/allowed")}
          />
          <HeaderButton
            title={redirected + ""}
            subtitle="Redirected"
            icon={RedirectedIcon}
            onClick={() => navigate("/list/redirected")}
          />
        </div>
      </div>
    </>
  );
};

interface HBProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  onClick?(): void;
}
export const HeaderButton: React.FC<HBProps> = ({
  title,
  subtitle,
  icon,
  onClick,
}) => {
  return (
    <div className="buttonwrapper">
      <div className="button headerbutton" onClick={onClick}>
        <div className="content">
          {title !== undefined && <div className="title">{title}</div>}
          {subtitle !== undefined && <div className="subtitle">{subtitle}</div>}
        </div>
      </div>
      {icon !== undefined ? (
        <div className="buttonicon">
          <img src={icon} className="icon" />
        </div>
      ) : null}
    </div>
  );
};
